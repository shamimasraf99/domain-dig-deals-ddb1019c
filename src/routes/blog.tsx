import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";

const POSTS = [
  { slug: "1", title: "How to Choose the Cheapest Domain Registrar in 2026", excerpt: "A practical guide to comparing registration, transfer, and renewal pricing.", date: "May 8, 2026", read: "6 min" },
  { slug: "2", title: "Shared vs VPS Hosting: Which One Should You Pick?", excerpt: "Performance, cost, and scalability — explained without the jargon.", date: "May 2, 2026", read: "8 min" },
  { slug: "3", title: "10 Hidden Fees Domain Registrars Don't Tell You About", excerpt: "Watch out for these costs before buying your next domain.", date: "Apr 24, 2026", read: "5 min" },
  { slug: "4", title: "The Best .ai Domain Deals Right Now", excerpt: "Where to register .ai domains for the lowest price.", date: "Apr 15, 2026", read: "4 min" },
  { slug: "5", title: "Why .com Renewal Prices Keep Rising", excerpt: "And what you can do to lock in lower long-term costs.", date: "Apr 7, 2026", read: "5 min" },
  { slug: "6", title: "Top 5 Free Domain Hosting Bundles in 2026", excerpt: "Get a domain free for the first year with these hosts.", date: "Mar 28, 2026", read: "6 min" },
];

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Domain & Hosting Guides | DomainDeals" },
      { name: "description", content: "Expert guides, comparisons, and deal alerts for domains, hosting, and VPS." },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Blog" title="Domain & hosting insights" subtitle="Guides, comparisons, and money-saving tips from our editors." />
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {POSTS.map((p) => (
            <Link key={p.slug} to="/blog">
              <Card className="glass p-6 h-full hover:shadow-elegant hover:-translate-y-1 transition-base">
                <div className="aspect-video rounded-xl gradient-primary mb-4 opacity-90" />
                <h3 className="font-display font-bold text-lg leading-snug mb-2">{p.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{p.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Calendar className="h-3 w-3" />{p.date}</span>
                  <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" />{p.read}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
