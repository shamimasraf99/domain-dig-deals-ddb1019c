import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchHosting } from "@/services/api";
import { HostingCard } from "@/components/HostingCard";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/hosting")({
  head: () => ({
    meta: [
      { title: "Hosting Offers — Best Web Hosting Deals | DomainDeals" },
      { name: "description", content: "Compare shared and managed hosting plans from top providers with verified discount codes." },
    ],
    links: [{ rel: "canonical", href: "/hosting" }],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["hosting"], queryFn: fetchHosting });
  return (
    <>
      <PageHero
        eyebrow="Hosting Offers"
        title="The best web hosting deals on the planet"
        subtitle="Hand-picked, verified hosting plans from premium providers."
      />
      <div className="container mx-auto px-4 pb-16">
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {(data || []).map((h) => <HostingCard key={h.id} o={h} />)}
          </div>
        )}
      </div>
    </>
  );
}
