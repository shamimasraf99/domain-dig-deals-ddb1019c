import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchCoupons } from "@/services/api";
import { CouponCard } from "@/components/CouponCard";
import { PageHero } from "@/components/PageHero";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const CATS = ["all", "domain", "hosting", "vps"];

export const Route = createFileRoute("/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons & Promo Codes — DomainDeals" },
      { name: "description", content: "Verified discount codes for domains, hosting, and VPS providers updated daily." },
    ],
    links: [{ rel: "canonical", href: "/coupons" }],
  }),
  component: Page,
});

function Page() {
  const [cat, setCat] = useState("all");
  const { data, isLoading } = useQuery({ queryKey: ["coupons"], queryFn: fetchCoupons });
  const filtered = (data || []).filter((c) => cat === "all" || c.category === cat);
  return (
    <>
      <PageHero
        eyebrow="Coupons & Promos"
        title="Verified discount codes you can use today"
        subtitle="Hand-tested promo codes from your favorite domain and hosting providers."
      />
      <div className="container mx-auto px-4 pb-16">
        <div className="flex gap-2 mb-6 flex-wrap">
          {CATS.map((c) => (
            <Button
              key={c}
              variant={cat === c ? "default" : "outline"}
              size="sm"
              onClick={() => setCat(c)}
              className={cat === c ? "gradient-primary border-0" : ""}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </Button>
          ))}
        </div>
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-44 glass rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((c) => <CouponCard key={c.id} c={c} />)}
          </div>
        )}
      </div>
    </>
  );
}
