// src/components/marketing/GradientDivider.tsx
import React from "react";

const colorMap: { [key: string]: string } = {
  "bg-light-cream": "#EFE9E4",
  "bg-warm-brown": "#A1887F",
  "bg-deep-mocha": "#6D4C41",
  "bg-clay-pink": "#DAB5A3",
};

type GradientDividerProps = {
  topColorClass: keyof typeof colorMap;
  bottomColorClass: keyof typeof colorMap;
};

export function GradientDivider({
  topColorClass,
  bottomColorClass,
}: GradientDividerProps) {
  const topHex = colorMap[topColorClass] || "#FFFFFF";
  const bottomHex = colorMap[bottomColorClass] || "#FFFFFF";

  return (
    <div
      className="w-full h-16 md:h-24 -mt-16 md:-mt-24 relative z-0"
      style={{
        background: `linear-gradient(to bottom, ${topHex}, ${bottomHex})`,
      }}
      aria-hidden="true"
    ></div>
  );
}
