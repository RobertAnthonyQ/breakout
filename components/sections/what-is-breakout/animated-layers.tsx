import React from "react";

interface AnimatedLayersProps {
  titleRef: React.RefObject<HTMLDivElement | null>;
  layerOneRef: React.RefObject<HTMLDivElement | null>;
  layerTwoRef: React.RefObject<HTMLDivElement | null>;
}

// White register: ink text, key words in solid cobalt (no glow, no gradients)
export default function AnimatedLayers({
  titleRef,
  layerOneRef,
  layerTwoRef,
}: AnimatedLayersProps) {
  return (
    <div className="relative h-[40vh] md:h-[48vh]">
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <h2
          id="what-is-breakout-heading"
          className="font-display text-7xl sm:text-8xl md:text-[9rem] lg:text-[11rem] leading-[0.88] text-center"
        >
          <span className="block text-outline">What is</span>
          <span className="block text-[var(--bo-cobalt)]">Breakout?</span>
        </h2>
      </div>

      <div
        ref={layerOneRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-6xl leading-tight font-medium text-[var(--bo-ink)]">
          <span className="font-bold">Breakout</span> connects talented founders
          with{" "}
          <span className="font-bold text-[var(--bo-cobalt)]">
            world-class opportunities
          </span>
          .
        </p>
      </div>

      <div
        ref={layerTwoRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-6xl leading-tight font-medium text-[var(--bo-ink)]">
          From exclusive programs to{" "}
          <span className="font-bold text-[var(--bo-cobalt)]">powerful fellowships</span>.
        </p>
      </div>
    </div>
  );
}
