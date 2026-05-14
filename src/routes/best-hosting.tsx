import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchHosting } from "@/services/api";
import { HostingCard } from "@/components/HostingCard";
import { PageHero } from "@/components/PageHero";

export const Route = createFileRoute("/best-hosting")({
  head: () => ({
    meta: [
      { title: "Best Hosting Deals — Top Rated | DomainDeals" },
      { name: "description", content: "The highest rated, biggest discount hosting plans available right now." },
    ],
    links: [{ rel: "canonical", href: "/best-hosting" }],
  }),
  component: Page,
});

function Page() {
  const { data, isLoading } = useQuery({ queryKey: ["hosting"], queryFn: fetchHosting });
  const best = [...(data || [])].sort((a, b) => b.rating - a.rating);
  return (
    <>
      <PageHero
        eyebrow="Best Hosting"
        title="Top-rated hosting plans, ranked by users"
        subtitle="Editor's pick of the best price-to-performance hosting plans of the year."
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
            {best.map((h) => <HostingCard key={h.id} o={h} />)}
          </div>
        )}
      </div>
    </>
  );
}
