import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDomains } from "@/services/api";
import { ComparisonTable } from "@/components/ComparisonTable";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/cheapest-domains")({
  head: () => ({
    meta: [
      { title: "Cheapest Domains — Lowest Registration Prices | DomainDeals" },
      { name: "description", content: "The absolute cheapest domain prices available right now, sorted by registration price." },
    ],
    links: [{ rel: "canonical", href: "/cheapest-domains" }],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["domains"], queryFn: fetchDomains });
  const cheapest = (data || []).filter((d) => d.cheapest);
  return (
    <>
      <PageHero
        eyebrow="Cheapest Domains"
        title="The absolute lowest domain prices online"
        subtitle="Curated list of unbeatable registration deals. Watch out for higher renewal prices."
      />
      <div className="container mx-auto px-4 pb-16">
        <ComparisonTable offers={cheapest.length ? cheapest : data || []} loading={isLoading} />
      </div>
    </>
  );
}
