import React from "react";
import type { Stat } from "./stats.data";

interface StatCardProps {
  stat: Stat;
  index: number;
}

const gradientStyle = {
  background: "linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
  filter: "drop-shadow(0 0 20px rgba(59, 130, 246, 0.6))",
} as const;

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ stat }, ref) => {
    return (
      <div
        ref={ref}
        className="flex flex-col items-center justify-center text-center space-y-3"
      >
        {/* Number with glow effect */}
        <div className="relative">
          <div className="text-5xl sm:text-6xl md:text-7xl font-black flex items-center justify-center gap-1">
            <span className="stat-number" style={gradientStyle}>
              0
            </span>
            <span style={gradientStyle}>{stat.suffix}</span>
          </div>
        </div>

        {/* Label */}
        <p
          className="stat-label text-lg sm:text-xl md:text-2xl font-medium text-white/80 tracking-wide"
          style={{
            transition: "color 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {stat.label}
        </p>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";

export default StatCard;
