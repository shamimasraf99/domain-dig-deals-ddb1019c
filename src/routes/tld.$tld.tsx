import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { getTldOffers } from "@/lib/tld.functions";
import { useCurrency } from "@/contexts/CurrencyContext";
import { AdSlot } from "@/components/AdSlot";

export const Route = createFileRoute("/tld/$tld")({
  head: ({ params }) => {
    const tld = `.${params.tld}`;
    return {
      meta: [
        { title: `${tld} Domain Price Comparison — Compare Registrars | DomainDeals` },
        {
          name: "description",
          content: `Compare ${tld} domain prices across every major registrar. Find the cheapest place to register, renew, or transfer a ${tld} domain.`,
        },
      ],
      links: [{ rel: "canonical", href: `/tld/${params.tld}` }],
    };
  },
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold mb-2">Failed to load TLD</h1>
        <p className="text-muted-foreground mb-6">{error.message}</p>
        <button
          onClick={() => {
            reset();
            router.invalidate();
          }}
          className="px-4 py-2 rounded-full gradient-primary text-primary-foreground font-semibold"
        >
          Retry
        </button>
      </div>
    );
  },
  notFoundComponent: () => (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="font-display text-2xl font-bold">TLD not found</h1>
    </div>
  ),
  component: TldPage,
});

function TldPage() {
  const { tld } = Route.useParams();
  const { format } = useCurrency();
  const fetchOffers = useServerFn(getTldOffers);
  const q = useQuery({
    queryKey: ["tld-offers", tld],
    queryFn: () => fetchOffers({ data: { tld } }),
    staleTime: 1000 * 60 * 10,
  });

  const displayTld = `.${tld}`;
  const offers = q.data?.offers ?? [];

  return (
    <div className="container mx-auto px-4 py-10 md:py-14 max-w-5xl">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to home
      </Link>

      <header className="mb-8">
        <h1 className="font-display text-3xl md:text-5xl font-bold">
          <span className="text-gradient">{displayTld}</span> Price Comparison
        </h1>
        <p className="text-muted-foreground mt-2">
          Compare {displayTld} domain prices across all registrars. Sorted by cheapest first.
        </p>
      </header>

      <AdSlot label="TLD Page Top 728x90" heightClass="min-h-[90px] md:min-h-[100px]" className="!my-4 !px-0" />



      {q.isLoading && (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin" />
          Loading live prices for {displayTld}…
        </div>
      )}

      {!q.isLoading && offers.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center text-muted-foreground">
          No registrar offers found for {displayTld}.
        </div>
      )}

      {offers.length > 0 && (
        <div className="glass rounded-2xl overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm md:text-base">
              <thead className="bg-muted/40 text-xs md:text-sm tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">Registrar</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">Registration</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">ICANN Fee</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">Renewal</th>
                  <th className="px-4 md:px-6 py-4 text-left font-semibold">Transfer</th>
                  <th className="px-4 md:px-6 py-4 text-right font-semibold">Visit</th>
                </tr>
              </thead>
              <tbody>
                {offers.map((o, i) => (
                  <tr
                    key={`${o.registrar}-${i}`}
                    className={`border-t border-border transition-base hover:bg-primary/[0.04] ${
                      i % 2 === 1 ? "bg-muted/20" : ""
                    } ${i === 0 ? "bg-success/5" : ""}`}
                  >
                    <td className="px-4 md:px-6 py-4 font-semibold">
                      {o.registrar}
                      {i === 0 && (
                        <span className="ml-2 text-[10px] uppercase font-bold text-success">
                          Cheapest
                        </span>
                      )}
                    </td>
                    <td className="px-4 md:px-6 py-4 font-display font-bold text-foreground">
                      {o.registration_price != null ? format(o.registration_price) : "—"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-muted-foreground">
                      {o.icann_fee != null ? format(o.icann_fee) : "—"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-muted-foreground">
                      {o.renewal_price != null ? format(o.renewal_price) : "—"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-muted-foreground">
                      {o.transfer_price != null ? format(o.transfer_price) : "—"}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <a
                        href={
                          o.offer_url
                            ? o.offer_url.startsWith("http")
                              ? o.offer_url
                              : `https://domainoffer.net${o.offer_url}`
                            : "#"
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full gradient-primary text-primary-foreground text-xs md:text-sm font-semibold shadow-soft hover:shadow-glow transition-base"
                      >
                        Visit <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
