import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { DomainOffer } from "@/services/api";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Props {
  offers: DomainOffer[];
  loading?: boolean;
}

const FEATURED_TLDS = [".com", ".net", ".org", ".ai", ".io"];

export function DomainTldTable({ offers, loading }: Props) {
  const { format } = useCurrency();

  const rows = useMemo(() => {
    return FEATURED_TLDS.map((tld) => {
      const all = offers.filter((o) => o.domain === tld);
      if (all.length === 0) return null;
      const cheapest = [...all].sort(
        (a, b) => a.registration_price - b.registration_price
      )[0];
      return { tld, cheapest, more: all.length - 1 };
    }).filter(Boolean) as {
      tld: string;
      cheapest: DomainOffer;
      more: number;
    }[];
  }, [offers]);

  return (
    <div className="glass rounded-2xl overflow-hidden shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-base">
          <thead className="bg-muted/40 text-sm tracking-wide text-muted-foreground">
            <tr>
              <th className="px-6 py-5 text-left font-semibold">Domain</th>
              <th className="px-6 py-5 text-left font-semibold">Price</th>
              <th className="px-6 py-5 text-left font-semibold">Registrar</th>
              <th className="px-6 py-5 text-right font-semibold">Compare</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-border">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <td key={j} className="px-6 py-6">
                      <div className="h-5 bg-muted/60 rounded animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              rows.map((r, i) => (
                <tr
                  key={r.tld}
                  className={`border-t border-border transition-base hover:bg-primary/[0.04] ${
                    i % 2 === 1 ? "bg-muted/20" : ""
                  }`}
                >
                  <td className="px-6 py-6">
                    <Link
                      to="/domains"
                      search={{ tld: r.tld }}
                      className="font-display text-xl md:text-2xl font-bold text-gradient hover:opacity-80"
                    >
                      {r.tld}
                    </Link>
                  </td>
                  <td className="px-6 py-6 font-display text-lg md:text-xl font-semibold">
                    {format(r.cheapest.registration_price)}
                  </td>
                  <td className="px-6 py-6 text-base md:text-lg text-foreground/90">
                    {r.cheapest.registrar}
                  </td>
                  <td className="px-6 py-6 text-right">
                    <Link
                      to="/domains"
                      search={{ tld: r.tld }}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full gradient-primary text-primary-foreground text-sm font-semibold shadow-soft hover:shadow-glow transition-base"
                    >
                      + {r.more} more
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center py-6 border-t border-border bg-muted/20">
        <Link
          to="/domains"
          className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full glass border border-border text-base font-semibold hover:shadow-glow transition-base"
        >
          Compare All TLDs Prices
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
