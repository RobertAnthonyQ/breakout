import React from "react";

interface AnimatedLayersProps {
  titleRef: React.RefObject<HTMLDivElement | null>;
  layerOneRef: React.RefObject<HTMLDivElement | null>;
  layerTwoRef: React.RefObject<HTMLDivElement | null>;
}

export default function AnimatedLayers({
  titleRef,
  layerOneRef,
  layerTwoRef,
}: AnimatedLayersProps) {
  return (
    <div className="relative h-[40vh] md:h-[48vh]">
      {/* Title */}
      <div
        ref={titleRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <h2
          id="what-is-breakout-heading"
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
          style={{
            color: "currentColor",
            textShadow:
              "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
          }}
        >
          What is Breakout?
        </h2>
      </div>

      {/* Line 1 - diagonal entrance with rotation, clean type */}
      <div
        ref={layerOneRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-6xl leading-tight font-medium"
          style={{ color: "currentColor" }}
        >
          <span className="font-bold">Breakout</span> connects talented
          founders with{" "}
          <span className="font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            world-class opportunities
          </span>
          .
        </p>
      </div>

      {/* Line 2 - bottom entrance with bounce, glowing blue accent */}
      <div
        ref={layerTwoRef}
        className="absolute inset-0 flex items-center justify-center"
      >
        <p
          className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-center max-w-6xl leading-tight font-medium"
          style={{ color: "currentColor" }}
        >
          <span className="align-middle"> From exclusive programs</span>
          <span
            className="mx-3 align-middle"
            style={{ color: "currentColor", opacity: 0.8 }}
          >
            to
          </span>
          <span
            className="align-middle font-black"
            style={{
              color: "#214fdd",
              textShadow:
                "0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(59, 130, 246, 0.4), 0 0 90px rgba(59, 130, 246, 0.2)",
              filter: "brightness(1.2)",
            }}
          >
            powerful fellowships
          </span>
          <span className="align-middle text-white">.</span>
        </p>
      </div>
    </div>
  );
}
