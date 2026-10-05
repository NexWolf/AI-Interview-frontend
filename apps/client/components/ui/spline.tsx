"use client";

import { useEffect, useRef, useState } from "react";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let isMounted = true;

    if (customElements.get("spline-viewer")) {
      setIsLoaded(true);
      return;
    }

    // تفادي تكرار تحميل نفس السكريبت لو موجود مسبقًا بالصفحة
    const existingScript = document.querySelector(
      'script[src*="spline-viewer.js"]'
    );

    if (existingScript) {
      customElements.whenDefined("spline-viewer").then(() => {
        if (isMounted) setIsLoaded(true);
      });
      return () => {
        isMounted = false;
      };
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js";

    script.onload = () => {
      customElements.whenDefined("spline-viewer").then(() => {
        if (isMounted) setIsLoaded(true);
      });
    };

    document.body.appendChild(script);

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const viewer = viewerRef.current;
    if (!viewer) return;

    const hideLogo = () => {
      if (!viewer.shadowRoot) return;

      const logo = viewer.shadowRoot.querySelector("#logo");
      if (logo) {
        logo.remove();
      }

      if (!viewer.shadowRoot.querySelector("#hide-spline-logo-style")) {
        const style = document.createElement("style");
        style.id = "hide-spline-logo-style";
        style.textContent = `
          #logo, a[href*="spline.design"] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
            visibility: hidden !important;
          }
        `;
        viewer.shadowRoot.appendChild(style);
      }
    };

    hideLogo();

    const applyHideLogo = () => {
      hideLogo();
    };

    viewer.addEventListener("load-complete", applyHideLogo);

    // Use MutationObserver on shadowRoot when available instead of setInterval
    let observer: MutationObserver | null = null;
    if (viewer.shadowRoot) {
      hideLogo();
      observer = new MutationObserver(() => hideLogo());
      observer.observe(viewer.shadowRoot, { childList: true, subtree: true });
    } else {
      // Fallback check once on next tick
      const timer = setTimeout(() => {
        if (viewer.shadowRoot) {
          hideLogo();
          observer = new MutationObserver(() => hideLogo());
          observer.observe(viewer.shadowRoot, { childList: true, subtree: true });
        }
      }, 500);
      return () => {
        clearTimeout(timer);
        observer?.disconnect();
        viewer.removeEventListener("load-complete", applyHideLogo);
      };
    }

    return () => {
      observer?.disconnect();
      viewer.removeEventListener("load-complete", applyHideLogo);
    };
  }, [isLoaded]);

  return (
    <div
      className={`relative w-full h-full min-h-[300px] ${className || ""}`}
    >
      {isLoaded && (
        <spline-viewer
          ref={viewerRef}
          url={scene}
          style={{ width: "100%", height: "100%" }}
        ></spline-viewer>
      )}
    </div>
  );
}