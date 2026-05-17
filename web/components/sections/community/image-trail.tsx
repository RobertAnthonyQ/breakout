import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Desktop mouse-following image stamp effect.
 * Spawns images along the cursor trail when the user moves across the section.
 */
export function useImageTrail(
  sectionRef: React.RefObject<HTMLElement | null>,
  layerRef: React.RefObject<HTMLDivElement | null>,
  images: string[],
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const section = sectionRef.current as HTMLElement | null;
    const layer = layerRef.current as HTMLDivElement | null;
    if (!section || !layer) return;

    let lastX = -10000;
    let lastY = -10000;
    const thresholdPx = 180; // más distancia requerida entre sellos
    const minIntervalMs = 160; // tiempo mínimo entre sellos
    const maxNodes = 7; // menos elementos simultáneos
    let lastSpawnAt = 0;

    function spawnStamp(x: number, y: number) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = `${x}px`;
      wrapper.style.top = `${y}px`;
      wrapper.style.transform = "translate(-50%, -50%)";
      wrapper.style.pointerEvents = "none";
      wrapper.style.width = "260px";
      wrapper.style.height = "auto";
      wrapper.style.borderRadius = "0px";
      wrapper.style.overflow = "visible";

      const img = document.createElement("img");
      img.src = encodeURI(
        images[Math.floor(Math.random() * images.length)]
      );
      img.alt = "Community";
      img.style.display = "block";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.filter = "brightness(1.1) contrast(1.05)";
      wrapper.appendChild(img);

      layer!.appendChild(wrapper);

      gsap.set(wrapper, {
        opacity: 0,
        scale: 0.8,
        rotate: Math.random() * 12 - 6,
      });
      gsap.to(wrapper, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "power2.out",
      });

      const lifespan = 1.5;
      gsap.to(wrapper, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.inOut",
        delay: lifespan,
        onComplete: () => {
          if (wrapper.parentNode === layer) layer!.removeChild(wrapper);
        },
      });

      while (layer!.children.length > maxNodes) {
        layer!.removeChild(layer!.firstChild as Node);
      }
    }

    function handleMouseMove(e: MouseEvent) {
      const rect = section!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = x - lastX;
      const dy = y - lastY;
      const dist = Math.hypot(dx, dy);
      const now = performance.now();
      if (dist >= thresholdPx && now - lastSpawnAt >= minIntervalMs) {
        lastX = x;
        lastY = y;
        lastSpawnAt = now;
        spawnStamp(x, y);
      }
    }

    function handleMouseLeave() {
      lastX = -10000;
      lastY = -10000;
    }

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [sectionRef, layerRef, images, enabled]);
}
