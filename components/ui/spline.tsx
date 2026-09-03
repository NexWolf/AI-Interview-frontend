"use client";

import { useEffect } from "react";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  useEffect(() => {
    if (!customElements.get("spline-viewer")) {
      const script = document.createElement("script");
      script.type = "module";
      script.src = "https://unpkg.com/@splinetool/viewer@latest/build/spline-viewer.js";
      document.body.appendChild(script);
    }
  }, []);

  return (
    // @ts-expect-error -- spline-viewer is a custom element not typed by React
    <spline-viewer url={scene} class={className}></spline-viewer>
  );
}