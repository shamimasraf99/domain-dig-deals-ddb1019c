import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const REG = [
  { name: "Namecheap", logo: "NC", rating: 4.7, com: 1199, support: "24/7 chat", whois: "Free", years: 24 },
  { name: "Porkbun", logo: "PB", rating: 4.9, com: 1099, support: "Email", whois: "Free", years: 9 },
  { name: "Cloudflare", logo: "CF", rating: 4.9, com: 999, support: "Tickets", whois: "Free", years: 14 },
  { name: "GoDaddy", logo: "GD", rating: 4.3, com: 1499, support: "24/7 phone", whois: "Paid", years: 27 },
  { name: "Google Domains", logo: "GO", rating: 4.7, com: 1299, support: "Email", whois: "Free", years: 9 },
  { name: "Dynadot", logo: "DY", rating: 4.5, com: 1299, support: "Email", whois: "Free", years: 21 },
];

export const Route = createFileRoute("/registrars")({
  head: () => ({
    meta: [
      { title: "Registrar Comparison — Side-by-Side | DomainDeals" },
      { name: "description", content: "Compare features, pricing, and support across the world's leading domain registrars." },
    ],
    links: [{ rel: "canonical", href: "/registrars" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Registrar Comparison" title="Compare top domain registrars" subtitle="Pricing, support, WHOIS privacy, and trust at a glance." />
      <div className="container mx-auto px-4 pb-16">
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-4 text-left">Registrar</th>
                <th className="px-4 py-4 text-left">Rating</th>
                <th className="px-4 py-4 text-left">.com from</th>
                <th className="px-4 py-4 text-left">Support</th>
                <th className="px-4 py-4 text-left">WHOIS Privacy</th>
                <th className="px-4 py-4 text-left">Years</th>
              </tr>
            </thead>
            <tbody>
              {REG.map((r) => (
                <tr key={r.name} className="border-t border-border hover:bg-primary/[0.03]">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">{r.logo}</div>
                      <span className="font-semibold">{r.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4"><div className="inline-flex items-center gap-1"><Star className="h-3 w-3 fill-warning text-warning" />{r.rating}</div></td>
                  <td className="px-4 py-4 font-semibold text-gradient">৳{r.com}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.support}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.whois}</td>
                  <td className="px-4 py-4 text-muted-foreground">{r.years} yrs</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
