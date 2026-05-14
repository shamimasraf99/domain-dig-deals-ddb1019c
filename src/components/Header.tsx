import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, Menu, Moon, Sun, X, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useI18n, LANGS } from "@/contexts/I18nContext";
import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, toggle } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const links = [
    { to: "/domains", label: t("nav_domains") },
    { to: "/hosting", label: t("nav_hosting") },
    { to: "/vps", label: t("nav_vps") },
    { to: "/free-domains", label: t("nav_free") },
    { to: "/coupons", label: t("nav_coupons") },
    { to: "/cheapest-domains", label: t("nav_cheapest") },
    { to: "/best-hosting", label: t("nav_best_hosting") },
    { to: "/registrars", label: t("nav_registrars") },
    { to: "/blog", label: t("nav_blog") },
    { to: "/contact", label: t("nav_contact") },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl gradient-primary shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-gradient">
              DomainDeals
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1 text-sm">
            {links.slice(0, 7).map((l) => {
              const active = pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`px-3 py-2 rounded-lg transition-base font-medium hover:text-primary hover:bg-primary/5 ${
                    active ? "text-primary bg-primary/10" : "text-foreground/80"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
            <DropdownMenu>
              <DropdownMenuTrigger className="px-3 py-2 rounded-lg font-medium text-foreground/80 hover:text-primary hover:bg-primary/5">
                More
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {links.slice(7).map((l) => (
                  <DropdownMenuItem key={l.to} asChild>
                    <Link to={l.to}>{l.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          <div className="flex items-center gap-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs font-semibold">
                    {LANGS.find((l) => l.code === lang)?.flag}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LANGS.map((l) => (
                  <DropdownMenuItem key={l.code} onClick={() => setLang(l.code)}>
                    <span className="mr-2">{l.flag}</span>
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-xs font-semibold">
                  {currency}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {CURRENCIES.map((c) => (
                  <DropdownMenuItem key={c} onClick={() => setCurrency(c)}>
                    {c}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="xl:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {open && (
          <nav className="xl:hidden pb-4 grid grid-cols-2 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 text-foreground/80 hover:text-primary"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
