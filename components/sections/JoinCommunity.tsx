"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

gsap.registerPlugin(ScrollTrigger);

// Sin nombres hardcodeados: se llenará solo desde la API
const defaultMemberNames: string[] = [];

export default function JoinCommunity() {
  const sectionRef = useRef<HTMLElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [names, setNames] = useState<string[]>(defaultMemberNames);
  const [loadingNames, setLoadingNames] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animación de entrada de la sección y esfera
  useEffect(() => {
    if (!mounted || shouldReduceMotion) return;

    const section = sectionRef.current;
    const sphere = sphereRef.current;
    const form = formRef.current;
    const title = titleRef.current;

    if (!section || !sphere || !form || !title) return;

    const ctx = gsap.context(() => {
      // Desactivar partículas cuando esta sección entra
      ScrollTrigger.create({
        trigger: section,
        start: "top 90%",
        end: "bottom top",
        onEnter: () => document.body.classList.add("disable-particles"),
        onEnterBack: () => document.body.classList.add("disable-particles"),
        onLeave: () => document.body.classList.remove("disable-particles"),
        onLeaveBack: () => document.body.classList.remove("disable-particles"),
      });
      // Animación del título
      gsap.from(title, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        },
        opacity: 0,
        y: 50,
        scale: 0.9,
      });

      // Animación de la esfera
      gsap.from(sphere, {
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "top 40%",
          scrub: 1,
        },
        opacity: 0,
        scale: 0.7,
      });

      // Animación del formulario
      gsap.from(form, {
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          end: "top 30%",
          scrub: 1,
        },
        opacity: 0,
        y: 30,
      });
    }, section);

    return () => ctx.revert();
  }, [mounted, shouldReduceMotion]);

  // Cargar nombres desde la API (Airtable)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        setLoadingNames(true);
        const res = await fetch("/api/contacts", { cache: "no-store" });
        if (!res.ok) {
          const { error } = await res.json().catch(() => ({ error: "" }));
          throw new Error(error || "Error cargando nombres");
        }
        const data = await res.json();
        const fetched: string[] = Array.isArray(data?.names) ? data.names : [];
        if (!cancelled) {
          setNames(fetched.map((n) => n.toUpperCase())); // reemplaza completamente
        }
      } catch {
        // Silencioso: no mostramos errores al usuario
      } finally {
        if (!cancelled) setLoadingNames(false);
      }
    }
    if (mounted) load();
    return () => {
      cancelled = true;
    };
  }, [mounted]);

  // Configurar la esfera con nombres distribuidos esféricamente
  useEffect(() => {
    if (!mounted || !sphereRef.current) return;

    const sphere = sphereRef.current;
    const wordElements = sphere.querySelectorAll(".sphere-word");
    const radius = 280;
    const total = wordElements.length;

    wordElements.forEach((el, i) => {
      // Distribución esférica uniforme usando el algoritmo de Fibonacci
      const phi = Math.acos(-1 + (2 * i + 1) / total);
      const theta = Math.sqrt(total * Math.PI) * phi;

      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);

      gsap.set(el, {
        x,
        y,
        z,
        opacity: 0.5 + (z / radius + 1) * 0.25, // Profundidad
        scale: 0.7 + (z / radius + 1) * 0.15,
      });
    });

    if (shouldReduceMotion) return;

    // Interacción con mouse para rotación dinámica + billboarding
    let targetRotationX = 15;
    let rotationX = 15;
    let rotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sphere.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const mouseX = (e.clientX - centerX) / rect.width;
      const mouseY = (e.clientY - centerY) / rect.height;

      targetRotationX = 15 + mouseY * 20;
      rotationY += mouseX * 0.5; // ligero delta adicional según mouse
    };

    const updateRotation = () => {
      // avance suave
      rotationX += (targetRotationX - rotationX) * 0.06;
      rotationY += 0.2;

      // aplicar rotación del grupo
      gsap.set(sphere, { rotationX, rotationY });

      // billboarding: cada palabra mira al frente (inversa del grupo)
      wordElements.forEach((el) => {
        gsap.set(el, { rotationX: -rotationX, rotationY: -rotationY });
      });

      animationFrameId = requestAnimationFrame(updateRotation);
    };

    let animationFrameId = requestAnimationFrame(updateRotation);

    window.addEventListener("mousemove", handleMouseMove);

    // Hover en palabras individuales
    wordElements.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        gsap.to(el, {
          scale: 1.4,
          color: "#214fdd",
          duration: 0.3,
          ease: "power2.out",
        });
      });

      el.addEventListener("mouseleave", () => {
        const z = gsap.getProperty(el, "z") as number;
        const baseScale = 0.7 + (z / radius + 1) * 0.15;
        gsap.to(el, {
          scale: baseScale,
          color: "#ffffff",
          duration: 0.3,
          ease: "power2.out",
        });
      });
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mounted, shouldReduceMotion, names]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameUpper = (formData.name || "").toString().trim().toUpperCase();
    if (!nameUpper) return;

    setIsSubmitting(true);
    // Agregar de inmediato al estado para que aparezca en la esfera
    setNames((prev) => [nameUpper, ...prev]);

    // Animación de agregado
    requestAnimationFrame(() => {
      const sphere = sphereRef.current;
      if (!sphere) return;
      const nodes = Array.from(
        sphere.querySelectorAll(".sphere-word")
      ) as HTMLElement[];
      const target = nodes.find((el) => el.innerText === nameUpper);
      if (target) {
        gsap.fromTo(
          target,
          { scale: 0.4, opacity: 0 },
          { scale: 1.4, opacity: 1, duration: 0.5, ease: "back.out(1.6)" }
        );
      }
    });

    // Enviar a Airtable (no bloquea la UI)
    fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: nameUpper,
        email: formData.email,
        phone: formData.phone,
      }),
    })
      .catch(() => {})
      .finally(() => {
        setIsSubmitting(false);
        setHasSubmitted(true);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="join"
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-20"
      style={{
        backgroundColor: "#000000",
      }}
      aria-label="Únete a la Comunidad"
    >
      <div className="container mx-auto px-4 relative z-10">
        <div
          ref={formRef}
          className="max-w-7xl mx-auto p-8 md:p-12 rounded-2xl"
          style={{
            background: "rgba(15, 15, 15, 0.75)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            boxShadow: "0 8px 32px rgba(33, 79, 221, 0.12)",
          }}
        >
          <h2
            ref={titleRef}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-white text-center mb-4 tracking-tight whitespace-nowrap"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              letterSpacing: "-0.02em",
            }}
          >
            ÚNETE A LA{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#214fdd] to-[#4a6fff]">
              COMUNIDAD
            </span>
          </h2>
          <p className="text-center text-gray-400 mb-10">
            Llena el formulario para que tu nombre aparezca en la esfera.
          </p>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Columna izquierda: Esfera de nombres */}
            <div className="flex flex-col items-center justify-center">
              {/* Esfera 3D con nombres */}
              <div
                className="relative w-full max-w-[600px] h-[600px] flex items-center justify-center"
                style={{
                  perspective: "1200px",
                }}
              >
                <div
                  ref={sphereRef}
                  className="relative w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: "rotateX(15deg)",
                  }}
                >
                  {names.map((name, index) => (
                    <div
                      key={index}
                      className="sphere-word absolute left-1/2 top-1/2 text-white font-bold cursor-pointer select-none whitespace-nowrap transition-colors duration-300 will-change-transform"
                      style={{
                        fontSize: `${1.2 + Math.random() * 0.6}rem`,
                        transform: "translate(-50%, -50%)",
                        transformStyle: "preserve-3d",
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                      }}
                    >
                      {name}
                    </div>
                  ))}
                  {names.length === 0 && !loadingNames && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-500">
                      Sin nombres aún
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha: Formulario */}
            <div className="w-full max-w-md mx-auto lg:mx-0">
              <h3 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
                <span role="img" aria-label="apunta a la izquierda">
                  👈
                </span>
                Únete Ahora
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Campo Nombre */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Primer Nombre
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan"
                    className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300"
                    style={{
                      height: "48px",
                      fontSize: "16px",
                    }}
                  />
                </div>

                {/* Campo Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Correo Electrónico
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="tu@email.com"
                    className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300"
                    style={{
                      height: "48px",
                      fontSize: "16px",
                    }}
                  />
                </div>

                {/* Campo Teléfono */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Número de Teléfono
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+51 976 543 210"
                    className="w-full bg-black/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-[#214fdd] focus:ring-[#214fdd] transition-all duration-300"
                    style={{
                      height: "48px",
                      fontSize: "16px",
                    }}
                  />
                </div>

                {/* Botón Submit */}
                <Button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    hasSubmitted ||
                    !formData.name.trim() ||
                    !formData.email.trim() ||
                    !formData.phone.trim()
                  }
                  className="w-full bg-[#214fdd] disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#1a3fb8] text-white font-bold py-6 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    boxShadow: "0 4px 20px rgba(33, 79, 221, 0.4)",
                  }}
                >
                  {isSubmitting
                    ? "Enviando…"
                    : hasSubmitted
                    ? "Enviado"
                    : "Unirme a la Comunidad"}
                </Button>
              </form>

              {/* Texto adicional */}
              <p className="text-gray-500 text-xs text-center mt-6">
                Al unirte, aceptas formar parte de una comunidad de innovadores
                y emprendedores
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sin partículas ni efectos extra: fondo liso negro */}
    </section>
  );
}
