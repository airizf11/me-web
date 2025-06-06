// src/components/marketing/SectionDivider.tsx
import React from "react";

type SectionDividerProps = {
  topColor: string;
  bottomColor: string;
  type?: "wave" | "slant";
};

export function SectionDivider({
  topColor,
  bottomColor,
  type = "wave",
}: SectionDividerProps) {
  const getHexColor = (tailwindClass: string) => {
    switch (tailwindClass) {
      case "bg-light-cream":
        return "#EFE9E4";
      case "bg-warm-brown":
        return "#A1887F";
      case "bg-deep-mocha":
        return "#6D4C41";
      case "bg-clay-pink":
        return "#DAB5A3";
      default:
        return "#FFFFFF";
    }
  };

  const topHex = getHexColor(topColor);
  const bottomHex = getHexColor(bottomColor);

  return (
    <div className="relative w-full h-16 md:h-24 overflow-hidden">
      {type === "wave" && (
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill={bottomHex}
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,149,864,154.7C960,160,1056,171,1152,165.3C1248,160,1344,139,1392,128L1440,117.3L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
          <path
            fill={topHex}
            fillOpacity="1"
            d="M0,160L48,170.7C96,181,192,203,288,202.7C384,203,480,181,576,165.3C672,149,768,149,864,154.7C960,160,1056,171,1152,165.3C1248,160,1344,139,1392,128L1440,117.3L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            transform="translate(0, -10)"
            className="opacity-50"
          ></path>
        </svg>
      )}

      {type === "slant" && (
        <svg
          className="absolute bottom-0 w-full"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <polygon fill={bottomHex} points="0,100 100,100 100,0"></polygon>
        </svg>
      )}
      <svg
        className="absolute bottom-0 w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <polygon fill={bottomHex} points="0,0 100,100 0,100"></polygon>
      </svg>
    </div>
  );
}
