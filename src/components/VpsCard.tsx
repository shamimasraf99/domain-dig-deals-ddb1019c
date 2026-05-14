import { VpsOffer } from "@/services/api";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, MemoryStick, Network, Star, ExternalLink } from "lucide-react";

export function VpsCard({ o }: { o: VpsOffer }) {
  const { format } = useCurrency();
  return (
    <Card className="glass relative overflow-hidden p-6 hover:shadow-elegant transition-base hover:-translate-y-1 border-border/50">
      {o.badge && (
        <Badge className="absolute top-4 right-4 bg-accent/20 text-accent-foreground border border-accent/30">
          {o.badge}
        </Badge>
      )}
      <div className="mb-4">
        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
          {o.provider}
        </div>
        <h3 className="font-display font-bold text-xl">{o.name}</h3>
        <div className="flex items-center gap-1 text-xs mt-1 text-muted-foreground">
          <Star className="h-3 w-3 fill-warning text-warning" />
          <span className="font-semibold text-foreground">{o.rating}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5 p-4 rounded-xl bg-muted/30">
        <Spec icon={Cpu} label={o.cpu} />
        <Spec icon={MemoryStick} label={o.ram} />
        <Spec icon={HardDrive} label={o.storage} />
        <Spec icon={Network} label={o.bandwidth} />
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="font-display text-3xl font-bold text-gradient">
          {format(o.price)}
        </span>
        <span className="text-xs text-muted-foreground">/ {o.period}</span>
      </div>

      <Button asChild className="w-full gradient-primary border-0">
        <a href={o.buy_link} target="_blank" rel="noopener noreferrer">
          Deploy Now <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </Button>
    </Card>
  );
}

function Spec({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <Icon className="h-3.5 w-3.5 text-primary" />
      <span className="font-medium">{label}</span>
    </div>
  );
}
