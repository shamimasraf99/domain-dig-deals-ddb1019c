<?php
/**
 * Domain Offer Scraper (PHP)
 *
 * Scrapes https://domainoffer.net for every TLD (domain extension) and every
 * registrar offer per TLD, then writes the merged dataset to public/domains.json
 *
 * Usage:
 *   php scrape.php            # full scrape (all TLDs + all registrars per TLD)
 *   php scrape.php --quick    # only the /price-compare table (cheapest registrar per TLD)
 */

declare(strict_types=1);

const BASE_URL          = 'https://domainoffer.net';
const FIRECRAWL_URL     = 'https://api.firecrawl.dev/v2/scrape';
const COMPARE_PER_PAGE  = 100;
const TLD_PER_PAGE      = 100;
const CONCURRENCY       = 5;
const REQUEST_TIMEOUT   = 120;
const USER_AGENT        = 'DomainDealsScraper/1.0';
const OUTPUT_FILE       = __DIR__ . '/../public/domains.json';

$FIRECRAWL_API_KEY = getenv('FIRECRAWL_API_KEY') ?: '';
if ($FIRECRAWL_API_KEY === '') {
    fwrite(STDERR, "ERROR: FIRECRAWL_API_KEY env var is required.\n");
    exit(1);
}

$quick = in_array('--quick', $argv, true);

/* ---------------------- HTTP helpers ---------------------- */

function firecrawl_payload(string $url): string {
    return json_encode([
        'url'            => $url,
        'formats'        => ['html'],
        'onlyMainContent'=> false,
        'waitFor'        => 1500,
    ]);
}

function firecrawl_extract_html($body): ?string {
    if (!is_string($body) || $body === '') return null;
    $j = json_decode($body, true);
    if (!is_array($j) || empty($j['success'])) return null;
    return $j['data']['html'] ?? $j['data']['rawHtml'] ?? $j['html'] ?? null;
}

function http_get(string $url): ?string {
    global $FIRECRAWL_API_KEY;
    $ch = curl_init(FIRECRAWL_URL);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => firecrawl_payload($url),
        CURLOPT_TIMEOUT        => REQUEST_TIMEOUT,
        CURLOPT_USERAGENT      => USER_AGENT,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $FIRECRAWL_API_KEY,
        ],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $code >= 400) return null;
    return firecrawl_extract_html($body);
}

/**
 * Parallel scrape via Firecrawl. $urls: assoc [key => url]. Returns [key => htmlOrNull].
 */
function http_get_many(array $urls, int $concurrency = CONCURRENCY): array {
    global $FIRECRAWL_API_KEY;
    $results = [];
    $keys    = array_keys($urls);
    $chunks  = array_chunk($keys, $concurrency);
    foreach ($chunks as $chunk) {
        $mh = curl_multi_init();
        $hs = [];
        foreach ($chunk as $k) {
            $ch = curl_init(FIRECRAWL_URL);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => firecrawl_payload($urls[$k]),
                CURLOPT_TIMEOUT        => REQUEST_TIMEOUT,
                CURLOPT_USERAGENT      => USER_AGENT,
                CURLOPT_HTTPHEADER     => [
                    'Content-Type: application/json',
                    'Authorization: Bearer ' . $FIRECRAWL_API_KEY,
                ],
            ]);
            curl_multi_add_handle($mh, $ch);
            $hs[$k] = $ch;
        }
        do {
            $status = curl_multi_exec($mh, $running);
            if ($running) curl_multi_select($mh, 1.0);
        } while ($running && $status === CURLM_OK);

        foreach ($hs as $k => $ch) {
            $body = curl_multi_getcontent($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $results[$k] = ($body !== false && $code < 400) ? firecrawl_extract_html($body) : null;
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
        }
        curl_multi_close($mh);
    }
    return $results;
}


/* ---------------------- HTML parsing ---------------------- */

function load_dom(string $html): DOMXPath {
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML('<?xml encoding="UTF-8">' . $html);
    libxml_clear_errors();
    return new DOMXPath($doc);
}

function text(DOMNode $n): string {
    return trim(preg_replace('/\s+/u', ' ', $n->textContent));
}

function parse_price(string $raw): ?float {
    if ($raw === '' || stripos($raw, 'n/a') !== false) return null;
    if (!preg_match('/([0-9]+(?:\.[0-9]+)?)/', $raw, $m)) return null;
    return (float)$m[1];
}

/**
 * Parse the /price-compare table rows.
 * Returns rows of [tld, cheapest_price, icann_fee, cheapest_registrar, offer_url].
 */
function parse_compare_page(string $html): array {
    $xp   = load_dom($html);
    $rows = [];
    foreach ($xp->query('//tbody[@id="domain-table-body"]/tr') as $tr) {
        $tldSpan   = $xp->query('.//div[contains(@class,"domain-cell")]/span', $tr)->item(0);
        $price     = $xp->query('.//span[contains(@class,"price-text")]', $tr)->item(0);
        $icann     = $xp->query('.//span[contains(@class,"icann-fee-text")]', $tr)->item(0);
        $reg       = $xp->query('.//span[contains(@class,"registrar-name")]', $tr)->item(0);
        $offerLink = $xp->query('.//a[contains(@class,"table-tld-link")]', $tr)->item(0);
        if (!$tldSpan) continue;
        $rows[] = [
            'tld'                => text($tldSpan),
            'cheapest_price'     => $price ? parse_price(text($price)) : null,
            'icann_fee'          => $icann ? parse_price(text($icann)) : null,
            'cheapest_registrar' => $reg ? text($reg) : null,
            'offer_url'          => $offerLink ? $offerLink->getAttribute('href') : null,
        ];
    }
    return $rows;
}

function parse_total_pages(string $html): int {
    if (preg_match('/data-page="(\d+)">\d+<\/button>(?:[^<]*<button[^>]*data-page="(\d+)")?/u', $html, $m)) {
        // fallthrough — use generic max search below
    }
    $max = 1;
    if (preg_match_all('/data-page="(\d+)"/', $html, $mm)) {
        foreach ($mm[1] as $n) $max = max($max, (int)$n);
    }
    return $max;
}

/**
 * Parse /tld/{tld} page rows: [registrar, new, icann_fee, renew, transfer, offer_url].
 */
function parse_tld_page(string $html): array {
    $xp   = load_dom($html);
    $out  = [];
    foreach ($xp->query('//tbody[@id="domain-table-body"]/tr') as $tr) {
        $tds = $xp->query('./td', $tr);
        if ($tds->length < 5) continue;
        $reg       = $xp->query('.//span[contains(@class,"registrar-name")]', $tr)->item(0);
        $offerLink = $xp->query('.//a[contains(@class,"table-tld-link")]', $tr)->item(0);
        $new       = $xp->query('.//span[contains(@class,"price-text")]', $tds->item(1))->item(0);
        $icann     = $xp->query('.//span[contains(@class,"icann-fee-text")]', $tds->item(2))->item(0);
        $renew     = $xp->query('.//span[contains(@class,"price-text")]', $tds->item(3))->item(0);
        $transfer  = $xp->query('.//span[contains(@class,"price-text")]', $tds->item(4))->item(0);
        if (!$reg) continue;
        $out[] = [
            'registrar'          => text($reg),
            'registration_price' => $new ? parse_price(text($new)) : null,
            'icann_fee'          => $icann ? parse_price(text($icann)) : null,
            'renewal_price'      => $renew ? parse_price(text($renew)) : null,
            'transfer_price'     => $transfer ? parse_price(text($transfer)) : null,
            'offer_url'          => $offerLink ? $offerLink->getAttribute('href') : null,
        ];
    }
    return $out;
}

function registrar_slug(string $name): string {
    $s = strtolower($name);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim($s, '-');
}

/* ---------------------- Pipeline ---------------------- */

echo "==> Fetching /price-compare (per_page=" . COMPARE_PER_PAGE . ")\n";

$firstUrl  = BASE_URL . '/price-compare?per_page=' . COMPARE_PER_PAGE . '&page=1';
$firstHtml = http_get($firstUrl);
if ($firstHtml === null) { fwrite(STDERR, "Failed: $firstUrl\n"); exit(1); }

$totalPages = parse_total_pages($firstHtml);
echo "    total pages: $totalPages\n";

$compareRows = parse_compare_page($firstHtml);
if ($totalPages > 1) {
    $urls = [];
    for ($p = 2; $p <= $totalPages; $p++) {
        $urls[$p] = BASE_URL . '/price-compare?per_page=' . COMPARE_PER_PAGE . '&page=' . $p;
    }
    $pages = http_get_many($urls);
    foreach ($pages as $p => $html) {
        if ($html === null) { echo "    !! page $p failed\n"; continue; }
        $compareRows = array_merge($compareRows, parse_compare_page($html));
    }
}
echo "    extensions discovered: " . count($compareRows) . "\n";

$offers = [];
$idx    = 0;

if ($quick) {
    echo "==> Quick mode: cheapest registrar per TLD only\n";
    foreach ($compareRows as $r) {
        if (!$r['tld'] || $r['cheapest_registrar'] === null) continue;
        $idx++;
        $reg = $r['cheapest_registrar'];
        $offers[] = [
            'id'                 => 'd' . $idx,
            'domain'             => $r['tld'],
            'registrar'          => $reg,
            'registrar_logo'     => strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $reg), 0, 2)),
            'price'              => $r['cheapest_price'] ?? 0,
            'registration_price' => $r['cheapest_price'] ?? 0,
            'renewal_price'      => null,
            'transfer_price'     => null,
            'icann_fee'          => $r['icann_fee'],
            'coupon_code'        => '',
            'category'           => 'domain-offer',
            'buy_link'           => $r['offer_url'] ?: '#',
            'cheapest'           => true,
            'rating'             => null,
        ];
    }
} else {
    echo "==> Full mode: fetching every registrar per TLD\n";
    $tlds = array_values(array_filter(array_map(fn($r) => $r['tld'], $compareRows)));

    foreach (array_chunk($tlds, 50) as $batchIdx => $batch) {
        // First page of each TLD in parallel
        $urls = [];
        foreach ($batch as $tld) {
            $slug = ltrim($tld, '.');
            $urls[$tld] = BASE_URL . '/tld/' . rawurlencode($slug) . '?per_page=' . TLD_PER_PAGE . '&page=1';
        }
        $pages = http_get_many($urls);
        $needMore = []; // tld => totalPages

        foreach ($pages as $tld => $html) {
            if ($html === null) { echo "    !! $tld page 1 failed\n"; continue; }
            $rows = parse_tld_page($html);
            foreach ($rows as $row) {
                $idx++;
                $reg = $row['registrar'];
                $offers[] = [
                    'id'                 => 'd' . $idx,
                    'domain'             => $tld,
                    'registrar'          => $reg,
                    'registrar_logo'     => strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $reg), 0, 2)),
                    'price'              => $row['registration_price'] ?? 0,
                    'registration_price' => $row['registration_price'],
                    'renewal_price'      => $row['renewal_price'],
                    'transfer_price'     => $row['transfer_price'],
                    'icann_fee'          => $row['icann_fee'],
                    'coupon_code'        => '',
                    'category'           => 'domain-offer',
                    'buy_link'           => $row['offer_url'] ?: '#',
                    'rating'             => null,
                ];
            }
            $tp = parse_total_pages($html);
            if ($tp > 1) $needMore[$tld] = $tp;
        }

        // Remaining pages per TLD (also parallel)
        $extra = [];
        foreach ($needMore as $tld => $tp) {
            $slug = ltrim($tld, '.');
            for ($p = 2; $p <= $tp; $p++) {
                $extra["$tld|$p"] = BASE_URL . '/tld/' . rawurlencode($slug) . '?per_page=' . TLD_PER_PAGE . '&page=' . $p;
            }
        }
        if ($extra) {
            $extraPages = http_get_many($extra);
            foreach ($extraPages as $key => $html) {
                if ($html === null) continue;
                [$tld] = explode('|', $key, 2);
                foreach (parse_tld_page($html) as $row) {
                    $idx++;
                    $reg = $row['registrar'];
                    $offers[] = [
                        'id'                 => 'd' . $idx,
                        'domain'             => $tld,
                        'registrar'          => $reg,
                        'registrar_logo'     => strtoupper(substr(preg_replace('/[^A-Za-z]/', '', $reg), 0, 2)),
                        'price'              => $row['registration_price'] ?? 0,
                        'registration_price' => $row['registration_price'],
                        'renewal_price'      => $row['renewal_price'],
                        'transfer_price'     => $row['transfer_price'],
                        'icann_fee'          => $row['icann_fee'],
                        'coupon_code'        => '',
                        'category'           => 'domain-offer',
                        'buy_link'           => $row['offer_url'] ?: '#',
                        'rating'             => null,
                    ];
                }
            }
        }

        echo "    batch " . ($batchIdx + 1) . "/" . ceil(count($tlds) / 50)
            . " — running total offers: " . count($offers) . "\n";
    }

    // Mark cheapest per TLD
    $minByTld = [];
    foreach ($offers as $o) {
        $t = $o['domain'];
        $p = $o['registration_price'];
        if ($p === null) continue;
        if (!isset($minByTld[$t]) || $p < $minByTld[$t]) $minByTld[$t] = $p;
    }
    foreach ($offers as &$o) {
        $o['cheapest'] = isset($minByTld[$o['domain']])
            && $o['registration_price'] !== null
            && abs($o['registration_price'] - $minByTld[$o['domain']]) < 0.0001;
    }
    unset($o);
}

if (!is_dir(dirname(OUTPUT_FILE))) mkdir(dirname(OUTPUT_FILE), 0777, true);
file_put_contents(OUTPUT_FILE, json_encode($offers, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

echo "==> Wrote " . count($offers) . " offers to " . OUTPUT_FILE . "\n";
echo "Done.\n";
