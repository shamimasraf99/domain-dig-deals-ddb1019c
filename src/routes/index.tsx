import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  ArrowRight,
  Search,
  Shield,
  Sparkles,
  Zap,
  Globe2,
  CheckCircle2,
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
import { fetchDomains } from "@/services/api";
import { DomainTldTable } from "@/components/DomainTldTable";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DomainDeals — Compare Domain Offers from Top Registrars" },
      {
        name: "description",
        content:
          "Compare domain prices from 100+ registrars. Verified, real-time prices and the best domain deals on the web.",
      },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const POPULAR_TLD_LIST = [".com", ".net", ".org", ".io", ".dev", ".ai", ".xyz", ".co"];


function Home() {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const domainsQ = useQuery({ queryKey: ["domains"], queryFn: fetchDomains });

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
              Compare domain prices{" "}
              <span className="text-gradient">in one place</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Find the cheapest registrar for every TLD — register, transfer, and renew with confidence.
            </p>

            <div className="glass rounded-2xl p-2 max-w-2xl mx-auto flex gap-2 shadow-elegant">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search a TLD or registrar..."
                  className="pl-11 h-12 bg-transparent border-0 focus-visible:ring-0 text-base"
                />
              </div>
              <Button asChild size="lg" className="gradient-primary border-0 h-12 px-6 shadow-glow">
                <Link to="/domains">
                  Search
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
      <Section title="Popular extensions" subtitle="Find your perfect TLD">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {POPULAR_TLD_LIST.map((tld) => {
            const offers = (domainsQ.data || []).filter((o) => o.domain === tld);
            const cheapest = offers.length
              ? offers.reduce((a, b) =>
                  (a.registration_price ?? Infinity) < (b.registration_price ?? Infinity) ? a : b,
                )
              : null;
            return (
              <Link
                key={tld}
                to="/domains"
                search={{ tld }}
                className="glass rounded-xl p-4 text-center hover:shadow-glow hover:-translate-y-1 transition-base group"
              >
                <div className="font-display text-2xl font-bold text-gradient">{tld}</div>
                <div className="text-xs text-muted-foreground mt-1">from</div>
                <div className="text-sm font-semibold">
                  {cheapest ? format(cheapest.registration_price) : "—"}

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

      {/* FAQ */}
      <Section title="Frequently asked questions" subtitle="Everything you need to know">
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="glass rounded-2xl px-6">
            {[
              {
                q: "How do you keep prices accurate?",
                a: "We track prices from 100+ registrars in real time and refresh data hourly.",
              },
              {
                q: "Are the prices in my local currency?",
                a: "Yes — switch currencies in the header. We support BDT, INR, USD, GBP, and EUR with live conversion.",
              },
              {
                q: "Do you charge anything?",
                a: "No, DomainDeals is 100% free for users. We may earn a small affiliate commission when you buy through our links — at no extra cost to you.",
              },
              {
                q: "Why is there a price difference between renewal and registration?",
                a: "Many registrars offer big introductory discounts. We always show transfer and renewal prices so you can plan long-term costs.",
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
