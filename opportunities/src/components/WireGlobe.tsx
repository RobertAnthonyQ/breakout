"use client";

import React, { useEffect, useRef } from "react";
import {
  BASE_TILT,
  CARD_HIDE_Z,
  CARD_SHOW_Z,
  GLOBE_PINS,
  MAX_CARDS,
  pinPoint,
  rotator,
  type Vec3,
} from "../lib/globe-pins";

const INITIAL_SPIN = 1.3; // starts with the Americas facing the viewer
const AUTO_SPIN = (2 * Math.PI) / 48; // rad/s: one turn every 48 s
const DRAG_SENSITIVITY = 0.008; // rad per dragged pixel
const EASE = 6; // how fast a fling settles (1/s)
const VIEWBOX_HALF = 1.02;
const PIN_VISIBLE_Z = 0.02; // the needle appears slightly before its card
// Card box relative to its pin point (matches .globe-pin-card offsets in globals.css)
const CARD_OFFSET_X = 10;
const CARD_OFFSET_Y = 30;
const CARD_GAP = 6; // minimum breathing room between two cards

// Geodesic sphere (icosphere) — the Open World campaign globe, drawn in code.
function buildIcosphere(subdivisions: number) {
  const t = (1 + Math.sqrt(5)) / 2;
  let vertices: Vec3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map(normalize);
  let faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  for (let s = 0; s < subdivisions; s++) {
    const midpointCache = new Map<string, number>();
    const midpoint = (a: number, b: number) => {
      const key = a < b ? `${a}-${b}` : `${b}-${a}`;
      const cached = midpointCache.get(key);
      if (cached !== undefined) return cached;
      const [va, vb] = [vertices[a], vertices[b]];
      vertices = [...vertices, normalize([(va[0] + vb[0]) / 2, (va[1] + vb[1]) / 2, (va[2] + vb[2]) / 2])];
      midpointCache.set(key, vertices.length - 1);
      return vertices.length - 1;
    };
    faces = faces.flatMap(([a, b, c]) => {
      const ab = midpoint(a, b);
      const bc = midpoint(b, c);
      const ca = midpoint(c, a);
      return [[a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]] as [number, number, number][];
    });
  }

  const edgeKeys = new Set<string>();
  for (const [a, b, c] of faces) {
    for (const [p, q] of [[a, b], [b, c], [c, a]]) edgeKeys.add(p < q ? `${p}-${q}` : `${q}-${p}`);
  }
  const edges = [...edgeKeys].map((key) => key.split("-").map(Number) as [number, number]);
  return { vertices, edges };
}

function normalize([x, y, z]: Vec3 | number[]): Vec3 {
  const length = Math.hypot(x, y, z);
  return [x / length, y / length, z / length];
}

const GEOMETRY = buildIcosphere(2);

const PIN_POINTS: Vec3[] = GLOBE_PINS.map((_, index) => pinPoint(index));

/** Orthographic projection of the edges; back edges go in a fainter path. */
function projectGlobe(spin: number, tilt: number) {
  const projected = GEOMETRY.vertices.map(rotator(spin, tilt));

  let front = "";
  let back = "";
  for (const [p, q] of GEOMETRY.edges) {
    const [vp, vq] = [projected[p], projected[q]];
    const segment = `M${vp[0].toFixed(3)} ${(-vp[1]).toFixed(3)}L${vq[0].toFixed(3)} ${(-vq[1]).toFixed(3)}`;
    if (vp[2] + vq[2] >= 0) front += segment;
    else back += segment;
  }
  return { front, back };
}

const INITIAL = projectGlobe(INITIAL_SPIN, BASE_TILT);

export function WireGlobe({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<SVGPathElement>(null);
  const backRef = useRef<SVGPathElement>(null);
  const pinRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    let frame = 0;
    let last = performance.now();
    let spin = INITIAL_SPIN;
    let dragTilt = 0;
    let size = wrap.clientWidth;
    const cardShown = GLOBE_PINS.map(() => false);
    const cardSizes = GLOBE_PINS.map(() => ({ width: 0, height: 0 }));
    const measureCards = () => {
      pinRefs.current.forEach((pin, index) => {
        const card = pin?.querySelector<HTMLElement>(".globe-pin-card");
        if (card) cardSizes[index] = { width: card.offsetWidth, height: card.offsetHeight };
      });
    };
    measureCards();
    // Drag: last pointer sample, and the angular velocity (rad/s) left after a fling
    let dragging = false;
    let dragX = 0;
    let dragY = 0;
    let dragTime = 0;
    let flingSpin = 0;
    let flingTilt = 0;

    const drawPins = (rotate: (v: Vec3) => Vec3) => {
      const points = PIN_POINTS.map(rotate);
      const screen = points.map(([x, y]) => ({
        px: ((x + VIEWBOX_HALF) / (2 * VIEWBOX_HALF)) * size,
        py: ((-y + VIEWBOX_HALF) / (2 * VIEWBOX_HALF)) * size,
        opensRight: x < 0, // cards open toward the globe's center, away from the headline
      }));
      const cardBox = (index: number) => {
        const { px, py, opensRight } = screen[index];
        const { width, height } = cardSizes[index];
        const left = opensRight ? px + CARD_OFFSET_X : px - CARD_OFFSET_X - width;
        const bottom = py - CARD_OFFSET_Y;
        return { left, right: left + width, top: bottom - height, bottom };
      };

      // Cards already on screen keep priority (no flicker); new ones only appear where there is room
      const candidates = points
        .map(([, , z], index) => ({ index, z }))
        .filter(({ index, z }) => z > (cardShown[index] ? CARD_HIDE_Z : CARD_SHOW_Z))
        .sort((a, b) => Number(cardShown[b.index]) - Number(cardShown[a.index]) || b.z - a.z);
      const placed: ReturnType<typeof cardBox>[] = [];
      cardShown.fill(false);
      for (const { index } of candidates) {
        if (placed.length >= MAX_CARDS) break;
        const box = cardBox(index);
        const collides = placed.some(
          (other) =>
            box.left < other.right + CARD_GAP &&
            other.left < box.right + CARD_GAP &&
            box.top < other.bottom + CARD_GAP &&
            other.top < box.bottom + CARD_GAP,
        );
        if (collides) continue;
        placed.push(box);
        cardShown[index] = true;
      }

      points.forEach(([, , z], index) => {
        const pin = pinRefs.current[index];
        if (!pin) return;
        const { px, py, opensRight } = screen[index];
        pin.style.transform = `translate3d(${px.toFixed(1)}px, ${py.toFixed(1)}px, 0)`;
        pin.classList.toggle("is-front", z > PIN_VISIBLE_Z);
        pin.classList.toggle("is-featured", cardShown[index]);
        pin.classList.toggle("card-right", opensRight);
      });
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const settle = 1 - Math.exp(-EASE * dt);

      if (!dragging) {
        spin += ((reducedMotion ? 0 : AUTO_SPIN) + flingSpin) * dt;
        dragTilt += flingTilt * dt;
        flingSpin -= flingSpin * settle;
        flingTilt -= flingTilt * settle;
        dragTilt -= dragTilt * settle * 0.25; // drift back to the resting tilt
      }

      const tilt = BASE_TILT + dragTilt;
      const { front, back } = projectGlobe(spin, tilt);
      frontRef.current?.setAttribute("d", front);
      backRef.current?.setAttribute("d", back);
      drawPins(rotator(spin, tilt));

      // With reduced motion, stop once a drag has settled instead of redrawing a still globe
      const settled = !dragging && Math.abs(flingSpin) + Math.abs(flingTilt) + Math.abs(dragTilt) < 1e-3;
      frame = reducedMotion && settled ? 0 : requestAnimationFrame(tick);
    };

    const start = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only animate while the globe is on screen (reduced motion still draws one frame to place the pins)
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) start();
      else stop();
    });
    observer.observe(wrap);
    const resizeObserver = new ResizeObserver(() => {
      size = wrap.clientWidth;
      measureCards();
    });
    resizeObserver.observe(wrap);

    // Grab and fling — mouse/trackpad only, so a finger on the hero still scrolls the page
    const onDown = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      e.preventDefault();
      dragging = true;
      [dragX, dragY, dragTime] = [e.clientX, e.clientY, e.timeStamp];
      flingSpin = 0;
      flingTilt = 0;
      wrap.setPointerCapture(e.pointerId);
      wrap.classList.add("is-dragging");
      start();
    };
    const onDrag = (e: PointerEvent) => {
      if (!dragging) return;
      const [dx, dy] = [e.clientX - dragX, e.clientY - dragY];
      const seconds = Math.max((e.timeStamp - dragTime) / 1000, 1 / 240);
      [dragX, dragY, dragTime] = [e.clientX, e.clientY, e.timeStamp];
      spin += dx * DRAG_SENSITIVITY;
      dragTilt += dy * DRAG_SENSITIVITY;
      flingSpin = (dx * DRAG_SENSITIVITY) / seconds;
      flingTilt = (dy * DRAG_SENSITIVITY) / seconds;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      // A pause before releasing means no fling
      if (e.timeStamp - dragTime > 80) flingSpin = flingTilt = 0;
      wrap.releasePointerCapture(e.pointerId);
      wrap.classList.remove("is-dragging");
    };

    if (finePointer) {
      wrap.classList.add("is-grabbable");
      wrap.addEventListener("pointerdown", onDown);
      wrap.addEventListener("pointermove", onDrag);
      wrap.addEventListener("pointerup", onUp);
      wrap.addEventListener("pointercancel", onUp);
    }

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      stop();
      wrap.removeEventListener("pointerdown", onDown);
      wrap.removeEventListener("pointermove", onDrag);
      wrap.removeEventListener("pointerup", onUp);
      wrap.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <svg className="globe-lines" viewBox="-1.02 -1.02 2.04 2.04" focusable="false">
        <path ref={backRef} d={INITIAL.back} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="0.004" />
        <path ref={frontRef} d={INITIAL.front} fill="none" stroke="currentColor" strokeOpacity="0.55" strokeWidth="0.005" />
      </svg>
      {GLOBE_PINS.map((pin, index) => (
        <div
          key={pin.opportunityId}
          ref={(el) => {
            pinRefs.current[index] = el;
          }}
          className="globe-pin"
        >
          <span className="globe-pin-needle" />
          <span className="globe-pin-head" />
          <div className="globe-pin-card">
            <strong>{pin.headline}</strong>
            <span>{pin.detail}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
