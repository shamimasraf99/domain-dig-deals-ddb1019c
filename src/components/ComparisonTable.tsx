import { useMemo, useState } from "react";
import { Search, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DomainOffer } from "@/services/api";
import { useCurrency } from "@/contexts/CurrencyContext";

interface Props {
  offers: DomainOffer[];
  loading?: boolean;
  initialSearch?: string;
}

export function ComparisonTable({ offers, loading, initialSearch = "" }: Props) {
  const { format } = useCurrency();
  const [q, setQ] = useState(initialSearch);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = needle
      ? offers.filter(
          (o) =>
            o.domain.toLowerCase().includes(needle) ||
            o.registrar.toLowerCase().includes(needle)
        )
      : offers;
    return [...list].sort((a, b) => a.registration_price - b.registration_price);
  }, [offers, q]);

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-2 flex gap-2 shadow-soft">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search TLD or registrar (e.g. .com, Namecheap)"
            className="pl-11 h-11 bg-transparent border-0 focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-4 text-left font-semibold">TLD</th>
                <th className="px-5 py-4 text-left font-semibold">Registrar</th>
                <th className="px-5 py-4 text-left font-semibold">Register</th>
                <th className="px-5 py-4 text-left font-semibold">Transfer</th>
                <th className="px-5 py-4 text-left font-semibold">Renewal</th>
                <th className="px-5 py-4 text-right font-semibold">Buy</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j} className="px-5 py-5">
                        <div className="h-4 bg-muted/60 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">
                    No offers found.
                  </td>
                </tr>
              ) : (
                filtered.map((o, i) => (
                  <tr
                    key={o.id}
                    className={`border-t border-border transition-base hover:bg-primary/[0.04] ${
                      i % 2 === 1 ? "bg-muted/20" : ""
                    }`}
                  >
                    <td className="px-5 py-4 font-display text-base font-bold text-gradient">
                      {o.domain}
                    </td>
                    <td className="px-5 py-4">{o.registrar}</td>
                    <td className="px-5 py-4 font-semibold">
                      {format(o.registration_price)}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {format(o.transfer_price)}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {format(o.renewal_price)}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Button asChild size="sm" className="gradient-primary border-0">
                        <a
                          href={
                            o.buy_link && o.buy_link !== "#"
                              ? o.buy_link.startsWith("http")
                                ? o.buy_link
                                : `https://domainoffer.net${o.buy_link.startsWith("/") ? "" : "/"}${o.buy_link}`
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                        >
                          Buy
                          <ExternalLink className="ml-1 h-3.5 w-3.5" />
                        </a>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
