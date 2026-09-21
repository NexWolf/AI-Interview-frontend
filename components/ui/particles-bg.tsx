"use client";

import { useEffect, useCallback, useRef } from "react";

declare global {
  interface Window {
    particlesJS: any;
    pJSDom: any[];
  }
}

export default function ParticlesComponent() {
  const containerRef = useRef<HTMLDivElement>(null);

  const initParticles = useCallback(() => {
    if (!containerRef.current || !window.particlesJS) return;

    // 1. تنظيف الـ Canvas والأحداث القديمة المربوطة بالحاوية الحالية
    const container = containerRef.current;
    const oldCanvas = container.querySelector("canvas");
    if (oldCanvas) oldCanvas.remove();

    if (Array.isArray(window.pJSDom)) {
      window.pJSDom = window.pJSDom.filter((p) => {
        if (p?.pJS?.canvas?.el?.parentNode === container) {
          try {
            p.pJS.fn.vendors.destroypJS();
          } catch {}
          return false;
        }
        return true;
      });
    }

    // 2. ضمان وجود ID مؤقت للربط مع المكتبة
    if (!container.id) {
      container.id = `particles-${Math.random().toString(36).substring(2, 9)}`;
    }

    // 3. تشغيل particles.js
    window.particlesJS(container.id, {
      particles: {
        number: {
          value: 90,
          density: { enable: true, value_area: 900 },
        },
        color: { value: "#A36AF6" },
        shape: {
          type: "circle",
          stroke: { width: 0.5, color: "#7D5BA6" },
        },
        opacity: {
          value: 0.45,
          random: true,
          anim: { enable: true, speed: 0.8, opacity_min: 0.15 },
        },
        size: {
          value: 2,
          random: true,
          anim: { enable: true, speed: 1.5, size_min: 0.8 },
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: "#7D5BA6",
          opacity: 0.22,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1,
          random: true,
          out_mode: "bounce",
        },
      },
      interactivity: {
        detect_on: "canvas",
        events: {
          onhover: { enable: true, mode: "grab" },
          onclick: { enable: true, mode: "push" },
          resize: true,
        },
        modes: {
          grab: { distance: 200, line_linked: { opacity: 0.5 } },
          push: { particles_nb: 3 },
          repulse: { distance: 150, duration: 0.4 },
        },
      },
      retina_detect: true,
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let scriptElement: HTMLScriptElement | null = null;

    if (window.particlesJS) {
      initParticles();
    } else {
      scriptElement = document.createElement("script");
      scriptElement.src =
        "https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
      scriptElement.async = true;
      document.body.appendChild(scriptElement);

      scriptElement.onload = () => {
        initParticles();
      };
    }

    // التنظيف الكامل عند الـ Unmount
    return () => {
      if (containerRef.current && Array.isArray(window.pJSDom)) {
        window.pJSDom = window.pJSDom.filter((p) => {
          if (p?.pJS?.canvas?.el?.parentNode === containerRef.current) {
            try {
              p.pJS.fn.vendors.destroypJS();
            } catch {}
            return false;
          }
          return true;
        });
      }
    };
  }, [initParticles]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 h-full w-full pointer-events-none"
    />
  );
}