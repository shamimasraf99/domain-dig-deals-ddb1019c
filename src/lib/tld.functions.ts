import { createServerFn } from "@tanstack/react-start";
import Firecrawl from "@mendable/firecrawl-js";
import * as cheerio from "cheerio";

export type TldRegistrarOffer = {
  registrar: string;
  registration_price: number | null;
  icann_fee: number | null;
  renewal_price: number | null;
  transfer_price: number | null;
  offer_url: string | null;
};

function parsePrice(raw: string): number | null {
  if (!raw) return null;
  if (/n\/a/i.test(raw)) return null;
  const m = raw.match(/([0-9]+(?:\.[0-9]+)?)/);
  return m ? parseFloat(m[1]) : null;
}

function parseTldHtml(html: string): TldRegistrarOffer[] {
  const $ = cheerio.load(html);
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
    });
  });
  return rows;
}

export const getTldOffers = createServerFn({ method: "GET" })
  .inputValidator((data: { tld: string }) => {
    const tld = String(data.tld || "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    if (!tld) throw new Error("Invalid TLD");
    return { tld };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) throw new Error("FIRECRAWL_API_KEY not configured");
    const firecrawl = new Firecrawl({ apiKey });
    const url = `https://domainoffer.net/tld/${encodeURIComponent(data.tld)}?per_page=100&page=1`;

    const all: TldRegistrarOffer[] = [];
    let page = 1;
    const seen = new Set<string>();
    while (page <= 10) {
      const pageUrl = `https://domainoffer.net/tld/${encodeURIComponent(data.tld)}?per_page=100&page=${page}`;
      const res = await firecrawl.scrape(pageUrl, {
        formats: ["html"],
        onlyMainContent: false,
        waitFor: 1500,
      });
      const html =
        (res as { html?: string }).html ??
        (res as { rawHtml?: string }).rawHtml ??
        "";
      if (!html) break;
      const rows = parseTldHtml(html);
      const fresh = rows.filter((r) => {
        const k = r.registrar + "|" + (r.registration_price ?? "");
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
      if (fresh.length === 0) break;
      all.push(...fresh);
      if (rows.length < 100) break;
      page++;
    }
    void url;
    all.sort((a, b) => {
      const ap = a.registration_price ?? Infinity;
      const bp = b.registration_price ?? Infinity;
      return ap - bp;
    });
    return { tld: `.${data.tld}`, offers: all };
  });
