"use client";

import { useEffect, useState } from "react";

/**
 * Sections flip the page between the two brand registers by toggling a class on <body>:
 * cobalt by default, white while one of these is present. Returns true on white sections.
 */
export const LIGHT_SECTION_CLASSES = ["about-light", "events-light", "join-light"] as const;

export function useLightSection(): boolean {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const body = document.body;
    const update = () => setIsLight(LIGHT_SECTION_CLASSES.some((name) => body.classList.contains(name)));
    update();
    const observer = new MutationObserver(update);
    observer.observe(body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return isLight;
}
