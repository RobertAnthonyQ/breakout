"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);
  const containerRef = useRef<Container | undefined>();

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = useCallback(async (container?: Container) => {
    containerRef.current = container;
  }, []);

  // Pausar/Reanudar según clase en body
  useEffect(() => {
    if (!init) return;
    const body = document.body;

    const applyState = () => {
      const disabled = body.classList.contains("disable-particles");
      const c = containerRef.current;
      if (!c) return;
      if (disabled) c.pause();
      else c.play();
    };

    applyState();
    const observer = new MutationObserver(applyState);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [init]);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
      particlesLoaded={particlesLoaded}
      style={{ pointerEvents: "none", position: "absolute", inset: 0 }}
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 120,
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        interactivity: {
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            onHover: {
              enable: true,
              // Otros modos disponibles son: "grab", "bubble", "repulse", "attract", "push", "remove", "slow", etc.
              // Puedes combinar varios así:
              mode: "attract",
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            push: {
              quantity: 4,
            },
            repulse: {
              distance: 200,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#214fdd", "#94a3b8", "#1a3a8a"],
          },
          links: {
            color: "#ffffff",
            distance: 200,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              width: 1920,
              height: 1080,
            },
            value: 100,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
