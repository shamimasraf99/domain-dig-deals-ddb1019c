export function PageHero({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="gradient-mesh border-b border-border/50">
      <div className="container mx-auto px-4 py-12 md:py-16 text-center">
        {eyebrow && (
          <div className="inline-flex items-center px-3 py-1 rounded-full glass text-xs font-semibold mb-4 text-primary">
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-3xl md:text-5xl font-bold max-w-3xl mx-auto leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
