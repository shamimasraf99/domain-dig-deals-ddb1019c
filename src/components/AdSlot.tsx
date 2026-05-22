import { useEffect, useRef } from "react";

interface AdSlotProps {
  /** Adstra ad zone/script id — paste from your Adstra dashboard */
  zoneId?: string;
  /** Optional raw Adstra script src (overrides zoneId based template) */
  scriptSrc?: string;
  /** Ad size label shown in placeholder when no zone configured */
  label?: string;
  /** Tailwind height classes, e.g. "h-[90px] md:h-[250px]" */
  heightClass?: string;
  className?: string;
}

/**
 * Adstra Ads slot.
 *
 * Usage:
 *   1. Get your zone/script from https://adstra.com dashboard
 *   2. Either pass `zoneId` (uses default Adstra script template)
 *      or pass full `scriptSrc` URL.
 *   3. Leave empty to render a labeled placeholder during development.
 */
export function AdSlot({
  zoneId,
  scriptSrc,
  label = "Advertisement",
  heightClass = "min-h-[90px] md:min-h-[100px]",
  className = "",
}: AdSlotProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const src = scriptSrc || (zoneId ? `https://adstra.com/ads/${zoneId}.js` : null);
    if (!src) return;

    // Prevent duplicate injection
    if (ref.current.querySelector("script[data-adstra]")) return;

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.adstra = "1";
    ref.current.appendChild(s);
  }, [zoneId, scriptSrc]);

  const isConfigured = Boolean(zoneId || scriptSrc);

  return (
    <div className={`w-full my-6 ${className}`}>
      <div className="container mx-auto px-4">
        <div
          ref={ref}
          className={`flex items-center justify-center w-full ${heightClass} rounded-xl overflow-hidden ${
            isConfigured
              ? ""
              : "glass border border-dashed border-border text-xs uppercase tracking-widest text-muted-foreground"
          }`}
          data-ad-slot={label}
        >
          {!isConfigured && (
            <span>
              {label} · Adstra Ad Slot
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
