import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, MapPin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Get in Touch | DomainDeals" },
      { name: "description", content: "Have a question or partnership idea? Reach out to the DomainDeals team." },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Contact" title="We'd love to hear from you" subtitle="Questions, feedback, partnerships — we usually reply within 24 hours." />
      <div className="container mx-auto px-4 pb-16 grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {[
            { icon: Mail, title: "Email us", value: "hello@domaindeals.io" },
            { icon: MessageSquare, title: "Live chat", value: "Mon–Fri, 9am–6pm" },
            { icon: MapPin, title: "Office", value: "Remote, worldwide" },
          ].map((c) => (
            <Card key={c.title} className="glass p-5 flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                <c.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-muted-foreground">{c.value}</div>
              </div>
            </Card>
          ))}
        </div>
        <Card className="glass p-6 lg:col-span-2">
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              toast.success("Message sent! We'll be in touch soon.");
              (e.target as HTMLFormElement).reset();
            }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Your name</Label>
                <Input id="name" required className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required className="mt-1.5" />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" required className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={6} required className="mt-1.5" />
            </div>
            <Button type="submit" size="lg" className="gradient-primary border-0 shadow-glow">
              Send message
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}
