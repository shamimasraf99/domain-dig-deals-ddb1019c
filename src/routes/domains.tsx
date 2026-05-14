import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchDomains } from "@/services/api";
import { ComparisonTable } from "@/components/ComparisonTable";
import { PageHero } from "@/components/PageHero";

type DomainsSearch = { tld?: string };

export const Route = createFileRoute("/domains")({
  validateSearch: (s: Record<string, unknown>): DomainsSearch => ({
    tld: typeof s.tld === "string" ? s.tld : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Domain Offers — Compare Registrar Prices | DomainDeals" },
      { name: "description", content: "Compare domain registration, transfer, and renewal prices from top registrars worldwide." },
    ],
    links: [{ rel: "canonical", href: "/domains" }],
  }),
  component: DomainsPage,
});

function DomainsPage() {
  const { tld } = Route.useSearch();
  const { data, isLoading } = useQuery({ queryKey: ["domains"], queryFn: fetchDomains });
  return (
    <>
      <PageHero
        eyebrow="Domain Offers"
        title={tld ? `Best ${tld} domain prices` : "Compare every domain price in one place"}
        subtitle="Filter, sort, and compare registration, transfer, and renewal prices from leading registrars."
      />
      <div className="container mx-auto px-4 pb-16">
        <ComparisonTable offers={data || []} loading={isLoading} initialSearch={tld ?? ""} />
      </div>
    </>
  );
}
