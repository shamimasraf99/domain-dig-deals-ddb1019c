import { HostingOffer } from "@/services/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Star, ExternalLink } from "lucide-react";

export function HostingCard({ o }: { o: HostingOffer }) {
  const { format } = useCurrency();
  return (
    <Card className="glass relative overflow-hidden p-6 group hover:shadow-elegant transition-base hover:-translate-y-1 border-border/50">
      {o.badge && (
        <div className="absolute top-4 right-4">
          <Badge className="gradient-primary border-0 text-primary-foreground shadow-glow">
            {o.badge}
          </Badge>
        </div>
      )}
      <div className="flex items-start gap-3 mb-4">
        <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-soft">
          {o.provider.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h3 className="font-display font-bold text-lg leading-tight">{o.name}</h3>
          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span className="font-semibold text-foreground">{o.rating}</span>
            <span>· {o.provider}</span>
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-display text-3xl font-bold text-gradient">
          {format(o.price)}
        </span>
        <span className="text-xs text-muted-foreground">/ {o.period}</span>
      </div>
      <div className="flex items-center gap-2 mb-5 text-xs">
        <span className="line-through text-muted-foreground">{format(o.original_price)}</span>
        <Badge variant="secondary" className="bg-success/15 text-success border-0">
          -{o.discount}%
        </Badge>
      </div>

      <ul className="space-y-2 mb-5 text-sm">
        {o.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-success/15 flex items-center justify-center shrink-0">
              <Check className="h-2.5 w-2.5 text-success" />
            </div>
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>

      <Button asChild className="w-full gradient-primary border-0 shadow-soft group-hover:shadow-glow transition-base">
        <a href={o.buy_link} target="_blank" rel="noopener noreferrer">
          Get Deal <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </Button>
    </Card>
  );
}
