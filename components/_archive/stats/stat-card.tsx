import React from "react";
import type { Stat } from "./stats.data";

interface StatCardProps {
  stat: Stat;
  index: number;
}

// Big Bebas numbers: white on cobalt, cobalt once the page flips to white (see globals.css)
const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ stat }, ref) => {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center text-center gap-2"
      >
        <div className="stat-value font-display text-7xl sm:text-8xl md:text-9xl leading-none flex items-center justify-center">
          <span className="stat-number">0</span>
          <span>{stat.suffix}</span>
        </div>

        <p className="stat-label text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-white/80">
          {stat.label}
        </p>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;
