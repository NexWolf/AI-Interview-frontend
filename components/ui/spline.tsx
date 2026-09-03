"use client";

import { useEffect, useState } from "react";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (customElements.get("spline-viewer")) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = "https://unpkg.com/@splinetool/viewer@1.9.28/build/spline-viewer.js";

    script.onload = () => {
      customElements.whenDefined("spline-viewer").then(() => {
        setIsLoaded(true);
      });
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[300px] ${className || ""}`}>
      {isLoaded && (
        <spline-viewer
          url={scene}
          style={{ width: "100%", height: "100%" }}
        ></spline-viewer>
      )}
    </div>
  );
}