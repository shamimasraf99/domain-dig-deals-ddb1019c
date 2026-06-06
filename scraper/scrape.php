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
const COMPARE_PER_PAGE  = 100;
const TLD_PER_PAGE      = 100;
const CONCURRENCY       = 8;
const REQUEST_TIMEOUT   = 60;
const USER_AGENT        = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
const OUTPUT_FILE       = __DIR__ . '/../public/domains.json';

$quick = in_array('--quick', $argv, true);

/* ---------------------- HTTP helpers (direct, no API) ---------------------- */

function http_get(string $url): ?string {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => REQUEST_TIMEOUT,
        CURLOPT_USERAGENT      => USER_AGENT,
        CURLOPT_HTTPHEADER     => [
            'Accept: text/html,application/xhtml+xml',
            'Accept-Language: en-US,en;q=0.9',
        ],
    ]);
    $body = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($body === false || $code >= 400) return null;
    return is_string($body) ? $body : null;
}

/**
 * Parallel direct HTTP GET. $urls: assoc [key => url]. Returns [key => htmlOrNull].
 */
function http_get_many(array $urls, int $concurrency = CONCURRENCY): array {
    $results = [];
    $keys    = array_keys($urls);
    $chunks  = array_chunk($keys, $concurrency);
    foreach ($chunks as $chunk) {
        $mh = curl_multi_init();
        $hs = [];
        foreach ($chunk as $k) {
            $ch = curl_init($urls[$k]);
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => true,
                CURLOPT_TIMEOUT        => REQUEST_TIMEOUT,
                CURLOPT_USERAGENT      => USER_AGENT,
                CURLOPT_HTTPHEADER     => [
                    'Accept: text/html,application/xhtml+xml',
                    'Accept-Language: en-US,en;q=0.9',
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
            $results[$k] = ($body !== false && $code < 400 && is_string($body)) ? $body : null;
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
 * Parse /tld/{tld} page rows.
 * Coupon codes live in separate "top-deal" promotional blocks and are mapped by registrar.
 */
function parse_tld_page(string $html): array {
    $xp   = load_dom($html);

    // Build registrar => coupon map from top-deal promotional blocks
    $coupons = [];

foreach ($xp->query('//div[contains(@class,"top-deal-info") or contains(@class,"top-deal")]') as $blk) {

    $regNode = $xp->query('.//*[contains(@class,"top-deal-registrar")]', $blk)->item(0);

    if (!$regNode) {
        continue;
    }

    $k = strtolower(
        preg_replace('/[^a-z0-9]/i', '', text($regNode))
    );

    if ($k === '') {
        continue;
    }

    if (!isset($coupons[$k])) {
        $coupons[$k] = [];
    }

    foreach ($xp->query('.//*[contains(@class,"couponCode")]', $blk) as $couponNode) {

        $coupon = trim(text($couponNode));

        if (
            $coupon !== '' &&
            !in_array($coupon, $coupons[$k], true)
        ) {
            $coupons[$k][] = $coupon;
        }
    }
}

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
        $regName = text($reg);
        $k = strtolower(preg_replace('/[^a-z0-9]/i', '', $regName));
        $out[] = [
            'registrar'          => $regName,
            'registration_price' => $new ? parse_price(text($new)) : null,
            'icann_fee'          => $icann ? parse_price(text($icann)) : null,
            'renewal_price'      => $renew ? parse_price(text($renew)) : null,
            'transfer_price'     => $transfer ? parse_price(text($transfer)) : null,
            'offer_url'          => $offerLink ? $offerLink->getAttribute('href') : null,
            'coupon_code'        => $coupons[$k] ?? []'',
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

echo "==> Fetching /price-compare (scan until empty)\n";

$compareRows = [];
$seenTlds    = [];
$maxPages    = 400; // safety cap (site reports ~335 pages)
$batchSize   = CONCURRENCY;
$nextPage    = 1;
$stop        = false;

while (!$stop && $nextPage <= $maxPages) {
    $urls = [];
    for ($i = 0; $i < $batchSize && ($nextPage + $i) <= $maxPages; $i++) {
        $p = $nextPage + $i;
        $urls[$p] = BASE_URL . '/price-compare?page=' . $p;
    }
    $pages = http_get_many($urls);
    ksort($pages);
    foreach ($pages as $p => $html) {
        if ($html === null) { echo "    !! page $p failed\n"; continue; }
        $rows = parse_compare_page($html);
        $newRows = [];
        foreach ($rows as $r) {
            $key = $r['tld'] . '|' . ($r['cheapest_registrar'] ?? '');
            if ($r['tld'] === '' || isset($seenTlds[$key])) continue;
            $seenTlds[$key] = true;
            $newRows[] = $r;
        }
        if (!$newRows) { $stop = true; break; }
        $compareRows = array_merge($compareRows, $newRows);
    }
    echo "    pages " . $nextPage . "-" . ($nextPage + $batchSize - 1) . " — total TLDs so far: " . count($compareRows) . "\n";
    $nextPage += $batchSize;
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
    echo "==> Full mode: fetching every registrar per TLD (walking pages)\n";
    $tlds = array_values(array_filter(array_map(fn($r) => $r['tld'], $compareRows)));
    $MAX_PAGES_PER_TLD = 30;

    foreach (array_chunk($tlds, 25) as $batchIdx => $batch) {
        $remaining = [];
        foreach ($batch as $tld) $remaining[$tld] = 1; // next page to fetch

        $seenPerTld = []; // tld => set of "registrar|price"
        while ($remaining) {
            $urls = [];
            foreach ($remaining as $tld => $page) {
                $slug = ltrim($tld, '.');
                $urls["$tld|$page"] = BASE_URL . '/tld/' . rawurlencode($slug) . '?page=' . $page;
            }
            $pages = http_get_many($urls);
            $next = [];
            foreach ($pages as $key => $html) {
                [$tld, $pageStr] = explode('|', $key, 2);
                $page = (int)$pageStr;
                if ($html === null) continue;
                $rows = parse_tld_page($html);
                $freshCount = 0;
                foreach ($rows as $row) {
                    $k = $row['registrar'] . '|' . ($row['registration_price'] ?? '');
                    if (isset($seenPerTld[$tld][$k])) continue;
                    $seenPerTld[$tld][$k] = true;
                    $freshCount++;
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
                        'coupon_code'        => $row['coupon_codes'] ?? [],
                        'category'           => 'domain-offer',
                        'buy_link'           => $row['offer_url'] ?: '#',
                        'rating'             => null,
                    ];
                }
                // Stop walking this TLD when a page returns no new rows or hits max.
                if ($freshCount > 0 && $page < $MAX_PAGES_PER_TLD) {
                    $next[$tld] = $page + 1;
                }
            }
            $remaining = $next;
        }

        echo "    batch " . ($batchIdx + 1) . "/" . ceil(count($tlds) / 25)
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
