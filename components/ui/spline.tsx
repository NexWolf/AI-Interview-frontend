"use client";

import { useEffect, useState } from "react";

interface SplineSceneProps {
  scene: string;
  className?: string;
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

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

  return (
    <div
      className={`relative w-full h-full min-h-[300px] ${className || ""}`}
    >
      {isLoaded && (
        <spline-viewer
          url={scene}
          style={{ width: "100%", height: "100%" }}
        ></spline-viewer>
      )}
    </div>
  );
}