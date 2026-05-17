"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, Engine } from "@tsparticles/engine";
import { particlesOptions } from "./particles-config";

export default function ParticlesBackground() {
  const [init, setInit] = useState(false);
  const containerRef = useRef<Container | undefined>(undefined);

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
      options={particlesOptions}
    />
  );
}
