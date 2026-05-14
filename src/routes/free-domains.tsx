import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, ExternalLink, Check } from "lucide-react";

const FREE = [
  { provider: "Bluehost", offer: "Free .com with any 12-month plan", value: "$12.99 value", buy_link: "#" },
  { provider: "Hostinger", offer: "Free domain for 1st year on Premium", value: "$9.99 value", buy_link: "#" },
  { provider: "DreamHost", offer: "Free domain & SSL on annual plan", value: "$15.99 value", buy_link: "#" },
  { provider: "GreenGeeks", offer: "Free domain registration on Pro", value: "$13.95 value", buy_link: "#" },
  { provider: "InMotion", offer: "Free domain transfer & registration", value: "$15 value", buy_link: "#" },
  { provider: "A2 Hosting", offer: "Free domain on Drive plan annual", value: "$14.99 value", buy_link: "#" },
];

export const Route = createFileRoute("/free-domains")({
  head: () => ({
    meta: [
      { title: "Free Domain Offers — Get a Domain Free | DomainDeals" },
      { name: "description", content: "Hosting plans that include a free domain registration." },
    ],
    links: [{ rel: "canonical", href: "/free-domains" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero
        eyebrow="Free Domain Offers"
        title="Get a domain absolutely free"
        subtitle="Hosting providers that bundle a free domain when you sign up."
      />
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FREE.map((f) => (
            <Card key={f.provider} className="glass p-6 hover:shadow-elegant transition-base hover:-translate-y-1">
              <div className="flex items-start justify-between mb-4">
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Gift className="h-6 w-6 text-primary-foreground" />
                </div>
                <Badge className="bg-success/15 text-success border-0">FREE</Badge>
              </div>
              <h3 className="font-display font-bold text-lg mb-1">{f.provider}</h3>
              <p className="text-sm text-muted-foreground mb-3">{f.offer}</p>
              <div className="flex items-center gap-1 text-xs mb-4">
                <Check className="h-3 w-3 text-success" />
                <span className="font-semibold">{f.value}</span>
              </div>
              <Button asChild className="w-full gradient-primary border-0">
                <a href={f.buy_link}>Claim Offer <ExternalLink className="h-3 w-3 ml-1" /></a>
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
