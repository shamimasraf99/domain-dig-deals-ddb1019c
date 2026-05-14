import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Zap,
  Globe2,
  CheckCircle2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useI18n } from "@/contexts/I18nContext";
import { fetchDomains, fetchHosting, fetchVps, fetchCoupons } from "@/services/api";
import { ComparisonTable } from "@/components/ComparisonTable";
import { DomainTldTable } from "@/components/DomainTldTable";
import { HostingCard } from "@/components/HostingCard";
import { VpsCard } from "@/components/VpsCard";
import { CouponCard } from "@/components/CouponCard";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DomainDeals — Compare Domain, Hosting & VPS Offers" },
      {
        name: "description",
        content:
          "Compare prices from 100+ domain registrars and hosting providers. Verified coupons, real-time prices, and the best deals on the web.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const POPULAR_TLDS = [
  { tld: ".com", from: 199 },
  { tld: ".net", from: 299 },
  { tld: ".org", from: 350 },
  { tld: ".io", from: 4500 },
  { tld: ".dev", from: 1599 },
  { tld: ".ai", from: 6900 },
  { tld: ".xyz", from: 99 },
  { tld: ".co", from: 999 },
];

function Home() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const domainsQ = useQuery({ queryKey: ["domains"], queryFn: fetchDomains });
  const hostingQ = useQuery({ queryKey: ["hosting"], queryFn: fetchHosting });
  const vpsQ = useQuery({ queryKey: ["vps"], queryFn: fetchVps });
  const couponsQ = useQuery({ queryKey: ["coupons"], queryFn: fetchCoupons });

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="relative gradient-mesh">
        <div className="container mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-28">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-6 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{t("hero_badge")}</span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              {t("hero_title_1")}{" "}
              <span className="text-gradient">{t("hero_title_2")}</span>
              <br />
              {t("hero_title_3")}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              {t("hero_subtitle")}
            </p>

            <div className="glass rounded-2xl p-2 max-w-2xl mx-auto flex gap-2 shadow-elegant">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t("search_placeholder")}
                  className="pl-11 h-12 bg-transparent border-0 focus-visible:ring-0 text-base"
                />
              </div>
              <Button asChild size="lg" className="gradient-primary border-0 h-12 px-6 shadow-glow">
                <Link to="/domains">
                  {t("search_btn")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm text-muted-foreground">
              {[
                { icon: Shield, label: "Verified prices" },
                { icon: Zap, label: "Updated hourly" },
                { icon: Globe2, label: "100+ registrars" },
                { icon: CheckCircle2, label: "No hidden fees" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-1.5">
                  <s.icon className="h-4 w-4 text-success" />
                  {s.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR EXTENSIONS */}
      <Section title={t("popular_extensions")} subtitle="Find your perfect TLD">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {POPULAR_TLDS.map((p) => (
            <Link
              key={p.tld}
              to="/domains"
              search={{ tld: p.tld }}
              className="glass rounded-xl p-4 text-center hover:shadow-glow hover:-translate-y-1 transition-base group"
            >
              <div className="font-display text-2xl font-bold text-gradient">
                {p.tld}
              </div>
              <div className="text-xs text-muted-foreground mt-1">from</div>
              <div className="text-sm font-semibold">৳{p.from}</div>
            </Link>
          ))}
        </div>
      </Section>

      {/* DOMAIN COMPARISON */}
      <Section
        title="Domain Price Comparison"
        subtitle="Cheapest registrar per extension — click to see all offers"
        action={{ label: "Compare All TLDs Prices", to: "/domains" }}
      >
        <DomainTldTable offers={domainsQ.data || []} loading={domainsQ.isLoading} />
      </Section>

      {/* FEATURED HOSTING */}
      <Section
        title={t("featured_hosting")}
        subtitle="Hand-picked hosting plans with massive savings"
        action={{ label: t("view_all"), to: "/hosting" }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(hostingQ.data || []).slice(0, 3).map((h) => (
            <HostingCard key={h.id} o={h} />
          ))}
        </div>
      </Section>

      {/* COUPONS */}
      <Section
        title={t("latest_coupons")}
        subtitle="Verified discount codes you can use today"
        action={{ label: t("view_all"), to: "/coupons" }}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {(couponsQ.data || []).slice(0, 4).map((c) => (
            <CouponCard key={c.id} c={c} />
          ))}
        </div>
      </Section>

      {/* TRENDING / VPS */}
      <Section
        title={t("top_vps")}
        subtitle="Powerful cloud servers at unbeatable prices"
        action={{ label: t("view_all"), to: "/vps" }}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {(vpsQ.data || []).slice(0, 3).map((v) => (
            <VpsCard key={v.id} o={v} />
          ))}
        </div>
      </Section>

      {/* TRUST STATS */}
      <section className="container mx-auto px-4 py-16">
        <div className="glass rounded-3xl p-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center shadow-soft">
          {[
            { v: "100+", l: "Registrars" },
            { v: "2.4M", l: "Prices Tracked" },
            { v: "$18M", l: "Saved by Users" },
            { v: "4.9/5", l: "User Rating" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl md:text-4xl font-bold text-gradient">
                {s.v}
              </div>
              <div className="text-sm text-muted-foreground mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <Section title={t("faq")} subtitle="Everything you need to know">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="glass rounded-2xl px-6">
            {[
              {
                q: "How do you keep prices accurate?",
                a: "We track prices from 100+ registrars and hosting providers in real time. Coupons are verified weekly by our editorial team.",
              },
              {
                q: "Are the prices in my local currency?",
                a: "Yes — switch currencies in the header. We support BDT, INR, USD, GBP, and EUR with live conversion across the entire site.",
              },
              {
                q: "Do you charge anything?",
                a: "No, DomainDeals is 100% free for users. We may earn a small affiliate commission when you buy through our links — at no extra cost to you.",
              },
              {
                q: "Why is there a price difference between renewal and registration?",
                a: "Many registrars offer big introductory discounts. We always show transfer and renewal prices so you can plan long-term costs.",
              },
              {
                q: "Can I get a free domain?",
                a: "Yes — many hosting providers include a free domain for the first year. Check our Free Domain Offers page.",
              },
            ].map((f, i) => (
              <AccordionItem key={i} value={`q${i}`} className="border-border/50">
                <AccordionTrigger className="text-left font-display font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Section>

      {/* NEWSLETTER */}
      <section className="container mx-auto px-4 py-16">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 md:p-14 text-center text-primary-foreground shadow-elegant">
          <div className="absolute inset-0 gradient-mesh opacity-30" />
          <div className="relative max-w-2xl mx-auto">
            <Mail className="h-10 w-10 mx-auto mb-4 opacity-90" />
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
              {t("newsletter_title")}
            </h2>
            <p className="opacity-90 mb-6">{t("newsletter_sub")}</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Subscribed! Welcome aboard.");
              }}
              className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto"
            >
              <Input
                type="email"
                required
                placeholder={t("your_email")}
                className="bg-background/95 text-foreground border-0 h-12"
              />
              <Button type="submit" size="lg" variant="secondary" className="h-12">
                {t("subscribe")}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: { label: string; to: string };
  children: React.ReactNode;
}) {
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-display text-2xl md:text-4xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground mt-2">{subtitle}</p>
          )}
        </div>
        {action && (
          <Link
            to={action.to}
            className="text-sm font-semibold text-primary hover:underline shrink-0 inline-flex items-center gap-1"
          >
            {action.label} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
