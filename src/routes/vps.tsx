import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchVps } from "@/services/api";
import { VpsCard } from "@/components/VpsCard";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/vps")({
  head: () => ({
    meta: [
      { title: "VPS Offers — Cheap Cloud Servers | DomainDeals" },
      { name: "description", content: "Compare VPS and cloud server plans from top providers including Vultr, DigitalOcean, Linode and more." },
    ],
    links: [{ rel: "canonical", href: "/vps" }],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["vps"], queryFn: fetchVps });
  return (
    <>
      <PageHero
        eyebrow="VPS Offers"
        title="Powerful cloud servers from $3/mo"
        subtitle="Compare VPS specs, bandwidth, and prices across leading cloud providers."
      />
      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-72 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data || []).map((v) => <VpsCard key={v.id} o={v} />)}
          </div>
        )}
      </div>
    </>
  );
}
