import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Facebook, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24 bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-gradient">
                DomainDeals
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The world's most trusted marketplace for comparing domain, hosting, and VPS deals.
            </p>
            <div className="flex gap-2 mt-4">
              {[Twitter, Facebook, Github, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-lg flex items-center justify-center bg-background border border-border hover:border-primary hover:text-primary transition-base"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Compare"
            links={[
              { to: "/domains", label: "Domain Offers" },
              { to: "/hosting", label: "Hosting Offers" },
              { to: "/vps", label: "VPS Offers" },
              { to: "/free-domains", label: "Free Domains" },
            ]}
          />
          <FooterCol
            title="Resources"
            links={[
              { to: "/coupons", label: "Coupons" },
              { to: "/cheapest-domains", label: "Cheapest Domains" },
              { to: "/best-hosting", label: "Best Hosting" },
              { to: "/registrars", label: "Registrar Comparison" },
            ]}
          />
          <FooterCol
            title="Company"
            links={[
              { to: "/blog", label: "Blog" },
              { to: "/contact", label: "Contact" },
              { to: "/", label: "About" },
              { to: "/", label: "Privacy" },
            ]}
          />
        </div>
        <div className="border-t border-border pt-6 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} DomainDeals. All rights reserved.</p>
          <p>Prices update in real time. We may earn a commission at no extra cost to you.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { to: string; label: string }[];
}) {
  return (
    <div>
      <h4 className="font-display font-semibold mb-4">{title}</h4>
      <ul className="space-y-2 text-sm">
        {links.map((l, i) => (
          <li key={i}>
            <Link to={l.to} className="text-muted-foreground hover:text-primary transition-base">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
