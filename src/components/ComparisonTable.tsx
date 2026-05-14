import { useMemo, useState } from "react";
import { DomainOffer } from "@/services/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Check, Copy, ExternalLink, Search, Star, Tag, TrendingDown } from "lucide-react";

interface Props {
  offers: DomainOffer[];
  loading?: boolean;
}

export function ComparisonTable({ offers, loading }: Props) {
  const { format } = useCurrency();
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [registrar, setRegistrar] = useState("all");
  const [sort, setSort] = useState("registration_price");
  const [cheapestOnly, setCheapestOnly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const registrars = useMemo(
    () => Array.from(new Set(offers.map((o) => o.registrar))),
    [offers]
  );

  const filtered = useMemo(() => {
    let r = offers;
    if (search) r = r.filter((o) => o.domain.toLowerCase().includes(search.toLowerCase()));
    if (registrar !== "all") r = r.filter((o) => o.registrar === registrar);
    if (cheapestOnly) r = r.filter((o) => o.cheapest);
    r = [...r].sort((a, b) => (a as any)[sort] - (b as any)[sort]);
    return r;
  }, [offers, search, registrar, sort, cheapestOnly]);

  const copy = (code: string) => {
    if (!code) return;
    navigator.clipboard?.writeText(code);
    setCopied(code);
    toast.success(t("copied"));
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="glass rounded-2xl p-4 grid gap-3 md:grid-cols-12">
        <div className="md:col-span-5 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-background/50"
          />
        </div>
        <Select value={registrar} onValueChange={setRegistrar}>
          <SelectTrigger className="md:col-span-3 bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("filter_registrar")}</SelectItem>
            {registrars.map((r) => (
              <SelectItem key={r} value={r}>
                {r}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="md:col-span-3 bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="registration_price">{t("sort_reg")}</SelectItem>
            <SelectItem value="renewal_price">{t("sort_renew")}</SelectItem>
            <SelectItem value="transfer_price">Transfer price</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant={cheapestOnly ? "default" : "outline"}
          onClick={() => setCheapestOnly((v) => !v)}
          className="md:col-span-1"
        >
          <TrendingDown className="h-4 w-4" />
        </Button>
      </div>

      <div className="glass rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-4 text-left font-semibold">{t("th_extension")}</th>
                <th className="px-4 py-4 text-left font-semibold">{t("th_registrar")}</th>
                <th className="px-4 py-4 text-left font-semibold">{t("th_registration")}</th>
                <th className="px-4 py-4 text-left font-semibold">{t("th_transfer")}</th>
                <th className="px-4 py-4 text-left font-semibold">{t("th_renewal")}</th>
                <th className="px-4 py-4 text-left font-semibold">{t("th_coupon")}</th>
                <th className="px-4 py-4 text-right font-semibold">{t("th_action")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-border">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-muted/60 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    {t("no_results")}
                  </td>
                </tr>
              ) : (
                filtered.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-border hover:bg-primary/[0.03] transition-base group"
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-display text-lg font-bold text-gradient">
                          {o.domain}
                        </span>
                        {o.cheapest && (
                          <Badge className="bg-success/15 text-success hover:bg-success/20 border-0 text-[10px]">
                            {t("cheapest_badge")}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {o.registrar_logo}
                        </div>
                        <div>
                          <div className="font-medium">{o.registrar}</div>
                          {o.rating && (
                            <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                              <Star className="h-3 w-3 fill-warning text-warning" />
                              {o.rating}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-semibold text-foreground">
                      {format(o.registration_price)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {format(o.transfer_price)}
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {format(o.renewal_price)}
                    </td>
                    <td className="px-4 py-4">
                      {o.coupon_code ? (
                        <button
                          onClick={() => copy(o.coupon_code)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-dashed border-primary/40 bg-primary/5 text-xs font-mono font-semibold text-primary hover:bg-primary/10 transition-base"
                        >
                          {copied === o.coupon_code ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          {o.coupon_code}
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Button asChild size="sm" className="gradient-primary border-0 shadow-soft">
                        <a href={o.buy_link} target="_blank" rel="noopener noreferrer">
                          {t("buy_now")}
                          <ExternalLink className="h-3 w-3 ml-1" />
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

      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <Tag className="h-3 w-3" />
        Showing {filtered.length} of {offers.length} offers — prices auto-converted to your currency.
      </p>
    </div>
  );
}
