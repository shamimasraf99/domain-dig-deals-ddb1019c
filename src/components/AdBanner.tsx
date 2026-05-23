import { useEffect, useRef } from "react";

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear any existing content
    container.innerHTML = "";

    // Set global atOptions
    (window as unknown as Record<string, unknown>).atOptions = {
      key: "4709225f9efc135429789e98eada611b",
      format: "iframe",
      height: 90,
      width: 728,
      params: {},
    };

    // Create and append the invoke script
    const script = document.createElement("script");
    script.src =
      "https://www.highperformanceformat.com/4709225f9efc135429789e98eada611b/invoke.js";
    script.async = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="w-full flex justify-center py-4 px-2 overflow-hidden">
      <div className="ad-banner-scale">
        <div
          ref={containerRef}
          style={{ width: 728, height: 90 }}
        />
      </div>
      <style>{`
        .ad-banner-scale { width: 728px; height: 90px; }
        @media (max-width: 768px) {
          .ad-banner-scale {
            transform: scale(calc((100vw - 16px) / 728));
            transform-origin: top center;
            height: calc(90px * ((100vw - 16px) / 728));
          }
          .ad-banner-scale > div { transform-origin: top center; }
        }
      `}</style>
    </div>
  );
}
