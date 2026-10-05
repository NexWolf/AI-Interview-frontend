"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* =========================================================
   Utility
========================================================= */

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/* =========================================================
   Theme Tokens
========================================================= */

const MOTIQ_TOKENS = `
@layer motiq {
  :root {
    --motiq-accent: #8B5CF6;
    --motiq-accent-text: #A36AF6;

    --motiq-bg: #0B0710;

    --motiq-border: #312442;
    --motiq-border-strong: #7D5BA6;

    --motiq-fg: #FAFFFD;
    --motiq-fg-secondary: #D1C7DD;
    --motiq-muted: #8E829D;

    --motiq-secondary-accent: #A36AF6;
    --motiq-signature: #C4B5FD;

    --motiq-surface: #141019;
    --motiq-surface-2: #1A1422;
  }
}
`;

/* =========================================================
   Reduced Motion
========================================================= */

function useReducedMotion(): boolean {
  const [reduced, setReduced] = React.useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  React.useEffect(() => {
    const mq = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    setReduced(mq.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setReduced(event.matches);
    };

    mq.addEventListener("change", onChange);

    return () => {
      mq.removeEventListener("change", onChange);
    };
  }, []);

  return reduced;
}

/* =========================================================
   Visibility Pause
========================================================= */

function useVisibilityPause<T extends Element>(
  ref: React.RefObject<T | null>,
  { threshold = 0.1 }: { threshold?: number } = {}
): boolean {
  const [onScreen, setOnScreen] = React.useState(true);
  const [tabVisible, setTabVisible] = React.useState(true);

  React.useEffect(() => {
    const element = ref.current;

    if (
      !element ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        setOnScreen(
          entries.some((entry) => entry.isIntersecting)
        );
      },
      { threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref, threshold]);

  React.useEffect(() => {
    const checkVisibility = () => {
      setTabVisible(
        document.visibilityState !== "hidden"
      );
    };

    checkVisibility();

    document.addEventListener(
      "visibilitychange",
      checkVisibility
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        checkVisibility
      );
    };
  }, []);

  return onScreen && tabVisible;
}

/* =========================================================
   Types
========================================================= */

export interface BorderBeamPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;

  beams?: 1 | 2;

  colors?: [string, string?];

  thickness?: number;

  idleSpeed?: number;

  hoverSpeed?: number;

  glow?: boolean;

  radius?: number;

  spring?: {
    stiffness?: number;
    damping?: number;
  };

  seed?: number;

  pauseWhenHidden?: boolean;

  reducedMotion?: boolean;
}

/* =========================================================
   Spring
========================================================= */

class Spring {
  x: number;
  v = 0;
  target: number;
  k: number;
  d: number;

  constructor(
    value: number,
    stiffness: number,
    damping: number
  ) {
    this.x = value;
    this.target = value;
    this.k = stiffness;
    this.d = damping;
  }

  step(dt: number) {
    const acceleration =
      this.k * (this.target - this.x) -
      this.d * this.v;

    this.v += acceleration * dt;
    this.x += this.v * dt;

    return this.x;
  }
}

/* =========================================================
   Helpers
========================================================= */

const clamp = (
  value: number,
  min: number,
  max: number
) => Math.min(max, Math.max(min, value));

const PARKED_ANGLE = 40;

/* =========================================================
   Comet Gradient
========================================================= */

function comet(
  tail: string,
  head: string,
  tip: string,
  midAlpha: number,
  start: number
) {
  return [
    `color-mix(in srgb, ${tail} 4%, transparent) ${
      start + 18
    }deg`,

    `color-mix(in srgb, ${tail} ${midAlpha}%, transparent) ${
      start + 46
    }deg`,

    `${head} ${start + 56}deg`,

    `${tip} ${start + 60}deg`,

    `transparent ${start + 63}deg`,
  ].join(", ");
}

/* =========================================================
   Ring Gradient
========================================================= */

function ringGradient(
  beams: 1 | 2,
  colors?: [string, string?]
) {
  const tail0 =
    colors?.[0] ?? "#7D5BA6";

  const head0 =
    colors?.[0] ?? "#A36AF6";

  const stops = [
    "transparent 0deg",

    comet(
      tail0,
      head0,
      `color-mix(in srgb, ${head0} 25%, #ffffff)`,
      55,
      0
    ),
  ];

  if (beams === 2) {
    const color2 =
      colors?.[1] ?? "#FFFFFF";

    stops.push(
      "transparent 198deg",

      comet(
        color2,
        color2,
        `color-mix(in srgb, ${color2} 30%, #A36AF6)`,
        50,
        198
      )
    );
  }

  stops.push("transparent 360deg");

  return `
    conic-gradient(
      from var(--mk-beam-a, 0deg),
      ${stops.join(", ")}
    )
  `;
}

/* =========================================================
   Main Component
========================================================= */

function BorderBeamPanelBase({
  children,
  beams = 2,
  colors,
  thickness = 2,
  idleSpeed = 42,
  hoverSpeed = 240,
  glow = true,
  radius = 18,
  spring,
  seed = 1,
  pauseWhenHidden = true,
  reducedMotion,
  className,
  style,
  ...props
}: BorderBeamPanelProps) {
  const uid = React.useId().replace(
    /[^a-zA-Z0-9]/g,
    ""
  );

  const cls = `mk-beam-${uid}`;

  const rootRef =
    React.useRef<HTMLDivElement | null>(null);

  const systemReduced = useReducedMotion();

  const [hydrated, setHydrated] =
    React.useState(false);

  React.useEffect(() => {
    setHydrated(true);
  }, []);

  const staticMode =
    reducedMotion === true ||
    (hydrated && systemReduced);

  const onScreen = useVisibilityPause(
    rootRef,
    {
      threshold: 0.05,
    }
  );

  const paused =
    pauseWhenHidden && !onScreen;

  const animate =
    !staticMode && !paused;

  const stiffness =
    spring?.stiffness ?? 30;

  const damping =
    spring?.damping ?? 11;

  const startAngle = React.useMemo(
    () =>
      ((seed * 137.508) % 360 + 360) %
      360,
    [seed]
  );

  const speedRef = React.useRef(
    new Spring(
      idleSpeed,
      stiffness,
      damping
    )
  );

  const angleRef =
    React.useRef(startAngle);

  const liveRef = React.useRef({
    idleSpeed,
    hoverSpeed,
  });

  liveRef.current = {
    idleSpeed,
    hoverSpeed,
  };

  React.useEffect(() => {
    speedRef.current.k = stiffness;
    speedRef.current.d = damping;
  }, [stiffness, damping]);

  const paint = React.useCallback(
    (angle: number) => {
      rootRef.current?.style.setProperty(
        "--mk-beam-a",
        `${(
          ((angle % 360) + 360) %
          360
        ).toFixed(2)}deg`
      );
    },
    []
  );

  React.useEffect(() => {
    if (!animate) return;

    let animationFrame = 0;
    let lastTime = 0;

    const frame = (now: number) => {
      if (!lastTime) {
        lastTime = now;
      }

      const dt = clamp(
        (now - lastTime) / 1000,
        0,
        0.05
      );

      lastTime = now;

      angleRef.current +=
        speedRef.current.step(dt) * dt;

      paint(angleRef.current);

      animationFrame =
        requestAnimationFrame(frame);
    };

    animationFrame =
      requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [animate, paint]);

  React.useEffect(() => {
    if (!staticMode) return;

    angleRef.current =
      PARKED_ANGLE;

    speedRef.current.x =
      speedRef.current.target =
        liveRef.current.idleSpeed;

    speedRef.current.v = 0;

    paint(PARKED_ANGLE);
  }, [staticMode, paint]);

  const surge = React.useCallback(() => {
    speedRef.current.target =
      liveRef.current.hoverSpeed;
  }, []);

  const settle = React.useCallback(() => {
    speedRef.current.target =
      liveRef.current.idleSpeed;
  }, []);

  const gradient = React.useMemo(
    () => ringGradient(beams, colors),
    [beams, colors]
  );

  const css = `
    .${cls} .mk-beam-ring,
    .${cls} .mk-beam-glow {
      position: absolute;
      inset: -1px;

      border-radius: ${radius}px;

      pointer-events: none;

      background: ${gradient};
    }

    .${cls} .mk-beam-ring {
      padding: ${Math.max(
        1,
        thickness
      )}px;

      -webkit-mask:
        linear-gradient(#fff 0 0)
          content-box,
        linear-gradient(#fff 0 0);

      -webkit-mask-composite: xor;

      mask:
        linear-gradient(#fff 0 0)
          content-box,
        linear-gradient(#fff 0 0);

      mask-composite: exclude;
    }

    .${cls} .mk-beam-glow {
      filter: blur(14px);
      opacity: 0.32;
      z-index: -1;
    }

    @media (forced-colors: active) {
      .${cls} .mk-beam-ring,
      .${cls} .mk-beam-glow {
        display: none;
      }

      .${cls} {
        border-color: CanvasText;
      }
    }
  `.trim();

  return (
    <div
      ref={rootRef}
      data-motion={
        staticMode
          ? "static"
          : "animated"
      }
      data-paused={
        paused ? "true" : "false"
      }
      onPointerEnter={surge}
      onPointerLeave={settle}
      onFocus={surge}
      onBlur={settle}
      className={cn(
        `
          relative
          w-full
          border
          border-[var(--motiq-border,#312442)]
          bg-[var(--motiq-surface,#141019)]
        `,
        cls,
        className
      )}
      style={{
        borderRadius: `${radius}px`,
        isolation: "isolate",
        ["--mk-beam-a" as string]:
          `${startAngle.toFixed(2)}deg`,
        ...style,
      }}
      {...props}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: css,
        }}
      />

      {glow && (
        <div
          aria-hidden="true"
          className="mk-beam-glow"
        />
      )}

      <div
        aria-hidden="true"
        className="mk-beam-ring"
      />

      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   Export
========================================================= */

export function BorderBeamPanel(
  props: BorderBeamPanelProps
) {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: MOTIQ_TOKENS,
        }}
      />

      <BorderBeamPanelBase {...props} />
    </>
  );
}

export default BorderBeamPanel;