import { useEffect } from "react";
import { gsap } from "gsap";

/**
 * Mobile floating images effect.
 * Spawns subtle floating community images in the background.
 */
export function useFloatingImages(
  layerRef: React.RefObject<HTMLDivElement | null>,
  images: string[],
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;

    const layer = layerRef.current as HTMLDivElement | null;
    if (!layer) return;

    const wrappers: HTMLDivElement[] = [];
    const num = 7; // cantidad de fotos flotantes

    for (let i = 0; i < num; i++) {
      const wrapper = document.createElement("div");
      wrapper.style.position = "absolute";
      wrapper.style.left = `${Math.random() * 100}%`;
      wrapper.style.top = `${Math.random() * 100}%`;
      wrapper.style.transform = "translate(-50%, -50%)";
      wrapper.style.pointerEvents = "none";
      wrapper.style.width = `${160 + Math.random() * 60}px`;
      wrapper.style.borderRadius = "16px";
      wrapper.style.overflow = "hidden";
      wrapper.style.boxShadow = "0 8px 24px rgba(0,0,0,0.35)";

      const img = document.createElement("img");
      img.src = encodeURI(
        images[Math.floor(Math.random() * images.length)]
      );
      img.alt = "Community";
      img.style.display = "block";
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.filter = "brightness(1.05) contrast(1.05)";

      wrapper.appendChild(img);
      layer.appendChild(wrapper);
      wrappers.push(wrapper);

      gsap.set(wrapper, {
        opacity: 0.6,
        scale: 0.95,
        rotate: (Math.random() - 0.5) * 8,
      });
      // Animación sutil de vaivén más amplia y más rápida
      gsap.to(wrapper, {
        x: (Math.random() - 0.5) * 160,
        y: (Math.random() - 0.5) * 160,
        duration: 3 + Math.random() * 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }

    return () => {
      wrappers.forEach((w) => w.remove());
    };
  }, [layerRef, images, enabled]);
}
