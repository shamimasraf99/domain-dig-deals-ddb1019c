import { Link } from "@tanstack/react-router";
import { Sparkles, Twitter, Facebook, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 mt-24 bg-secondary/30">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 mb-10">
          <div className="max-w-sm">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-gradient">
                DomainDeals
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Compare domain prices from leading registrars worldwide.
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

          <div>
            <h4 className="font-display font-semibold mb-4">Compare</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/domains" className="text-muted-foreground hover:text-primary transition-base">
                  Domain Offers
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-sm text-muted-foreground flex flex-col sm:flex-row justify-between gap-2">
          <p>© {new Date().getFullYear()} DomainDeals. All rights reserved.</p>
          <p>Prices update in real time. We may earn a commission at no extra cost to you.</p>
        </div>
      </div>
    </footer>
  );
}
