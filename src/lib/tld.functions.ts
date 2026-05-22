import { createServerFn } from "@tanstack/react-start";
import * as cheerio from "cheerio";

export type TldRegistrarOffer = {
  registrar: string;
  registration_price: number | null;
  icann_fee: number | null;
  renewal_price: number | null;
  transfer_price: number | null;
  offer_url: string | null;
  coupon_code: string | null;
};

function parsePrice(raw: string): number | null {
  if (!raw) return null;
  if (/n\/a/i.test(raw)) return null;
  const m = raw.match(/([0-9]+(?:\.[0-9]+)?)/);
  return m ? parseFloat(m[1]) : null;
}

function normalizeRegistrar(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function parseTldHtml(html: string): {
  rows: TldRegistrarOffer[];
  coupons: Record<string, string>;
} {
  const $ = cheerio.load(html);

  // Coupons live in "top-deal" promotional blocks. Map registrar => coupon code.
  const coupons: Record<string, string> = {};
  $(".top-deal-info, .top-deal").each((_, el) => {
    const $el = $(el);
    const reg = $el.find(".top-deal-registrar").first().text().trim();
    const code = $el.find(".couponCode").first().text().trim();
    if (reg && code) coupons[normalizeRegistrar(reg)] = code;
  });
  // Fallback: any couponCode in document, paired with closest preceding registrar-name
  $(".couponCode").each((_, el) => {
    const code = $(el).text().trim();
    if (!code) return;
    const reg = $(el).closest(".top-deal-info, .top-deal, tr").find(".top-deal-registrar, .registrar-name").first().text().trim();
    if (reg && !coupons[normalizeRegistrar(reg)]) coupons[normalizeRegistrar(reg)] = code;
  });

  const rows: TldRegistrarOffer[] = [];
  $("tbody#domain-table-body tr").each((_, tr) => {
    const $tr = $(tr);
    const tds = $tr.find("> td");
    if (tds.length < 5) return;
    const registrar = $tr.find(".registrar-name").first().text().trim();
    if (!registrar) return;
    const offerUrl = $tr.find("a.table-tld-link").first().attr("href") || null;
    const reg = parsePrice($(tds[1]).find(".price-text").text().trim());
    const icann = parsePrice($(tds[2]).find(".icann-fee-text").text().trim());
    const renew = parsePrice($(tds[3]).find(".price-text").text().trim());
    const transfer = parsePrice($(tds[4]).find(".price-text").text().trim());
    rows.push({
      registrar,
      registration_price: reg,
      icann_fee: icann,
      renewal_price: renew,
      transfer_price: transfer,
      offer_url: offerUrl,
      coupon_code: coupons[normalizeRegistrar(registrar)] ?? null,
    });
  });

  return { rows, coupons };
}

export const getTldOffers = createServerFn({ method: "GET" })
  .inputValidator((data: { tld: string }) => {
    const tld = String(data.tld || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!tld) throw new Error("Invalid TLD");
    return { tld };
  })
  .handler(async ({ data }) => {
    const all: TldRegistrarOffer[] = [];
    const allCoupons: Record<string, string> = {};
    const seen = new Set<string>();
    const MAX_PAGES = 20;

    for (let page = 1; page <= MAX_PAGES; page++) {
      const pageUrl = `https://domainoffer.net/tld/${encodeURIComponent(data.tld)}?page=${page}`;
      let html = "";
      try {
        const res = await fetch(pageUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml",
            "Accept-Language": "en-US,en;q=0.9",
          },
        });
        if (!res.ok) break;
        html = await res.text();
      } catch (e) {
        console.error("fetch failed", pageUrl, e);
        break;
      }
      if (!html) break;
      const { rows, coupons } = parseTldHtml(html);
      Object.assign(allCoupons, coupons);
      const fresh = rows.filter((r) => {
        const k = r.registrar + "|" + (r.registration_price ?? "");
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (fresh.length === 0) break;
      all.push(...fresh);
    }


    // Final pass: ensure coupons gathered later attach to earlier rows
    for (const r of all) {
      if (!r.coupon_code) {
        const c = allCoupons[normalizeRegistrar(r.registrar)];
        if (c) r.coupon_code = c;
      }
    }

    all.sort((a, b) => {
      const ap = a.registration_price ?? Infinity;
      const bp = b.registration_price ?? Infinity;
      return ap - bp;
    });
    return { tld: `.${data.tld}`, offers: all };
  });
