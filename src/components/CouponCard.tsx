import { useState } from "react";
import { Coupon } from "@/services/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, Copy, ExternalLink, Tag } from "lucide-react";
import { toast } from "sonner";

export function CouponCard({ c }: { c: Coupon }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(c.code);
    setCopied(true);
    toast.success("Coupon copied!");
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Card className="glass p-5 hover:shadow-elegant transition-base group border-border/50">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">
            {c.provider}
          </div>
          <h3 className="font-display font-semibold leading-snug">{c.title}</h3>
        </div>
        <Badge className="gradient-primary border-0 text-primary-foreground shrink-0 ml-2">
          <Tag className="h-3 w-3 mr-1" />
          {c.discount}
        </Badge>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={copy}
          className="flex-1 flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 hover:bg-primary/10 transition-base"
        >
          <span className="font-mono font-bold text-primary text-sm">{c.code}</span>
          {copied ? (
            <Check className="h-4 w-4 text-success" />
          ) : (
            <Copy className="h-4 w-4 text-primary" />
          )}
        </button>
        <Button asChild size="icon" className="gradient-primary border-0 shrink-0">
          <a href={c.buy_link} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3">
        Expires {new Date(c.expires).toLocaleDateString()}
      </p>
    </Card>
  );
}
