"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

type AuthSwitchProps = {
  isSigninActive?: boolean;
  onSwitch?: (next: boolean) => void;
  signUpSlot: ReactNode;
  signInSlot: ReactNode;
  /** صورة واحدة فقط، بالـ DOM مرة وحدة، ثابتة تمامًا — ما بتتحرك ولا بتتكرر أبدًا */
  handshakeImage: string;
  brandLabel?: string;
  className?: string;
};

const ANIM_MS = 1200;
const CARD_W = 900;
const CARD_H = 550;
const LAYER_W = 1600;

/* المنحنى المحلي (نفس الشكل بالضبط للطبقتين): عريض من فوق، رفيع من تحت */
const TOP_X = 700;
const BOT_X = 900;
const CTRL_X = 720;

// طبقة اليمين: التلوين البنفسجي بيسكّر ناحية يمين الطبقة (1600)، والقناع الأبيض بيسكّر ناحية يسارها (0)
const RIGHT_TINT_PATH = `path('M ${TOP_X} 0 Q ${CTRL_X} ${CARD_H / 2}, ${BOT_X} ${CARD_H} L ${LAYER_W} ${CARD_H} L ${LAYER_W} 0 Z')`;
const RIGHT_MASK_PATH = `path('M ${TOP_X} 0 Q ${CTRL_X} ${CARD_H / 2}, ${BOT_X} ${CARD_H} L 0 ${CARD_H} L 0 0 Z')`;
const RIGHT_START_LEFT = -305; // وضع الراحة (Sign up): منحنى عند ~46%/69%
const RIGHT_END_LEFT = -1400; // نهاية مستمرة (بدون تجميد) بعيدة كفاية تخلي الطبقة تختفي تمامًا

// طبقة الشمال: نفس المنحنى بالضبط بس مقلوب — التلوين بيسكّر ناحية يسار الطبقة، والقناع ناحية يمينها
const LEFT_TOP_X = 900;
const LEFT_BOT_X = 700;
const LEFT_CTRL_X = 880;
const LEFT_TINT_PATH = `path('M ${LEFT_TOP_X} 0 Q ${LEFT_CTRL_X} ${CARD_H / 2}, ${LEFT_BOT_X} ${CARD_H} L -1000 ${CARD_H} L -1000 0 Z')`;
const LEFT_MASK_PATH = `path('M ${LEFT_TOP_X} 0 Q ${LEFT_CTRL_X} ${CARD_H / 2}, ${LEFT_BOT_X} ${CARD_H} L ${LAYER_W} ${CARD_H} L ${LAYER_W} 0 Z')`;
const LEFT_START_LEFT = 1400; // بداية مستمرة (بعيدة يمين، بدون تجميد) — مخبية لحد نص الحركة
const LEFT_END_LEFT = -435; // وضع الراحة (Sign in): نفس زاوية 46%/69% بس من الشمال

export default function AuthSwitch({
  isSigninActive: controlledValue,
  onSwitch,
  signUpSlot,
  signInSlot,
  handshakeImage,
  brandLabel = "AI INTERVIEW",
  className,
}: AuthSwitchProps) {
  const [internalActive, setInternalActive] = useState(false);
  const isSigninActive = controlledValue ?? internalActive;

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [flashKey, setFlashKey] = useState(0);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => resetTimer.current && clearTimeout(resetTimer.current), []);

  const handleSwitch = (next: boolean) => {
    if (next === isSigninActive) return;
    setInternalActive(next);
    onSwitch?.(next);
    setFlashKey((k) => k + 1);
    setIsTransitioning(true);
    resetTimer.current && clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setIsTransitioning(false), ANIM_MS);
  };

  const dir = isSigninActive ? "" : "reverse";

  return (
    <div
      className={`min-h-screen w-full flex items-center justify-center p-4 ${className ?? ""}`}
      style={{
        background:
          "linear-gradient(135deg, #E2D7FC 0%, #D8C7F8 50%, #CBB5F5 100%)",
      }}
    >
      <style>{`
        :root {
          --primary: #7C3AED;
          --accent: #9333EA;
          --foreground: #111827;
          --muted-foreground: #9CA3AF;
          --card: #FFFFFF;
          --shadow-elegant: 0 25px 60px -15px rgba(124, 58, 237, 0.25);
        }
        .font-display { font-family: "Sora", ui-sans-serif, system-ui, sans-serif; }

        /* الحركة مستمرة بالكامل من 0% لـ 100%، بدون أي تجميد بالموقع — بس الشفافية هي يلي بتتلاشى بفترة متراكبة */
        @keyframes right-wrap {
          0%   { left: ${RIGHT_START_LEFT}px; opacity: 1; }
          40%  { opacity: 1; }
          60%  { opacity: 0; }
          100% { left: ${RIGHT_END_LEFT}px; opacity: 0; }
        }
        @keyframes left-wrap {
          0%   { left: ${LEFT_START_LEFT}px; opacity: 0; }
          40%  { opacity: 0; }
          60%  { opacity: 1; }
          100% { left: ${LEFT_END_LEFT}px; opacity: 1; }
        }
        .right-animate { animation: right-wrap ${ANIM_MS}ms linear forwards; }
        .right-animate.reverse { animation-direction: reverse; }
        .left-animate { animation: left-wrap ${ANIM_MS}ms linear forwards; }
        .left-animate.reverse { animation-direction: reverse; }

        @keyframes touch-spark {
          0%, 38%  { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          50%      { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
          70%      { opacity: 0.35; transform: translate(-50%, -50%) scale(1.4); }
          100%     { opacity: 0; transform: translate(-50%, -50%) scale(1.8); }
        }
        .touch-spark { animation: touch-spark ${ANIM_MS}ms ease-out forwards; }
        @media (prefers-reduced-motion: reduce) {
          .right-animate, .left-animate, .touch-spark { animation: none; }
        }
      `}</style>

      {/* ===================== سطح المكتب (900×550) ===================== */}
      <div
        className="relative hidden overflow-hidden rounded-[32px] bg-card shadow-[var(--shadow-elegant)] md:block"
        style={{ width: CARD_W, height: CARD_H, isolation: "isolate" }}
      >
        {/* الصورة — عنصر وحيد، ثابت 100%، تحت كل شي، بدون أي حركة أو تكرار */}
        <img
          src={handshakeImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          style={{ zIndex: 1 }}
        />

        {/* طبقة اليمين: قناع أبيض + تلوين بنفسجي — بتتحرك هي بس، الصورة تحتها ثابتة */}
        <div
          key={isTransitioning ? `right-${flashKey}` : "right-idle"}
          className={isTransitioning ? `right-animate ${dir}` : ""}
          style={{
            position: "absolute",
            top: 0,
            left: isTransitioning ? undefined : (isSigninActive ? RIGHT_END_LEFT : RIGHT_START_LEFT),
            opacity: isTransitioning ? undefined : (isSigninActive ? 0 : 1),
            width: LAYER_W,
            height: CARD_H,
            zIndex: 2,
          }}
        >
          <div className="absolute inset-0" style={{ background: "var(--card)", clipPath: RIGHT_MASK_PATH }} />
          <div
            className="absolute inset-0"
            style={{
              clipPath: RIGHT_TINT_PATH,
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, transparent) 0%, color-mix(in oklab, var(--accent) 70%, transparent) 100%)",
            }}
          />
        </div>

        {/* طبقة الشمال: نفس الفكرة بس معكوسة */}
        <div
          key={isTransitioning ? `left-${flashKey}` : "left-idle"}
          className={isTransitioning ? `left-animate ${dir}` : ""}
          style={{
            position: "absolute",
            top: 0,
            left: isTransitioning ? undefined : (isSigninActive ? LEFT_END_LEFT : LEFT_START_LEFT),
            opacity: isTransitioning ? undefined : (isSigninActive ? 1 : 0),
            width: LAYER_W,
            height: CARD_H,
            zIndex: 2,
          }}
        >
          <div className="absolute inset-0" style={{ background: "var(--card)", clipPath: LEFT_MASK_PATH }} />
          <div
            className="absolute inset-0"
            style={{
              clipPath: LEFT_TINT_PATH,
              background:
                "linear-gradient(135deg, color-mix(in oklab, var(--primary) 55%, transparent) 0%, color-mix(in oklab, var(--accent) 70%, transparent) 100%)",
            }}
          />
        </div>

        {/* ومضة "لحظة التلامس" بمنتصف الأنيميشن */}
        {isTransitioning && (
          <div
            key={flashKey}
            className="touch-spark pointer-events-none absolute h-48 w-48 rounded-full"
            style={{
              left: "50%",
              top: "50%",
              zIndex: 4,
              background:
                "radial-gradient(circle, oklch(0.98 0.02 300 / 0.85) 0%, color-mix(in oklab, var(--accent) 55%, transparent) 40%, transparent 70%)",
            }}
          />
        )}

        {/* الفورمات */}
        <div
          className="absolute top-1/2 grid w-[320px]"
          style={{
            left: isSigninActive ? "77%" : "23%",
            transform: "translate(-50%, -50%)",
            transition: `left ${ANIM_MS}ms cubic-bezier(0.65,0,0.35,1)`,
            zIndex: 5,
          }}
        >
          <div
            className="flex flex-col items-center justify-center w-full"
            style={{
              gridColumn: "1 / 2",
              gridRow: "1 / 2",
              opacity: isSigninActive ? 1 : 0,
              zIndex: isSigninActive ? 2 : 1,
              pointerEvents: isSigninActive ? "auto" : "none",
              transition: "opacity 0.4s ease-in-out",
              transitionDelay: isSigninActive ? `${ANIM_MS * 0.6}ms` : "0ms",
            }}
          >
            {signInSlot}
          </div>
          <div
            className="flex flex-col items-center justify-center w-full"
            style={{
              gridColumn: "1 / 2",
              gridRow: "1 / 2",
              opacity: isSigninActive ? 0 : 1,
              zIndex: isSigninActive ? 1 : 2,
              pointerEvents: isSigninActive ? "none" : "auto",
              transition: "opacity 0.4s ease-in-out",
              transitionDelay: isSigninActive ? "0ms" : `${ANIM_MS * 0.6}ms`,
            }}
          >
            {signUpSlot}
          </div>
        </div>

        {/* نصوص + أزرار التبديل */}
        <div className="absolute inset-0 grid grid-cols-2">
          <div
            className="flex flex-col justify-center text-center"
            style={{ alignItems: "flex-end", padding: "3rem 14% 2rem 8%", zIndex: 6, pointerEvents: isSigninActive ? "auto" : "none" }}
          >
            <div
              className="text-white flex flex-col items-center"
              style={{
                opacity: isSigninActive ? 1 : 0,
                transform: isSigninActive ? "translateX(0)" : "translateX(-40px)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: isSigninActive ? `${ANIM_MS * 0.55}ms` : "0ms",
              }}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">{brandLabel}</p>
              <h3 className="mb-2 font-display text-3xl font-bold text-white">New here?</h3>
              <p className="mb-5 text-xs leading-relaxed text-white/90 max-w-[240px]">
                Create your account and let our AI interviewer get to know you.
              </p>
              <button
                type="button"
                onClick={() => handleSwitch(false)}
                className="rounded-full border-2 border-white px-8 py-2 text-xs font-semibold tracking-wider text-white transition-all hover:bg-white hover:text-[var(--primary)] uppercase cursor-pointer"
              >
                SIGN UP
              </button>
            </div>
          </div>
          <div
            className="flex flex-col justify-center text-center"
            style={{ alignItems: "flex-start", padding: "3rem 8% 2rem 14%", zIndex: 6, pointerEvents: isSigninActive ? "none" : "auto" }}
          >
            <div
              className="text-white flex flex-col items-center"
              style={{
                opacity: isSigninActive ? 0 : 1,
                transform: isSigninActive ? "translateX(40px)" : "translateX(0)",
                transition: "opacity 0.5s ease, transform 0.5s ease",
                transitionDelay: isSigninActive ? "0ms" : `${ANIM_MS * 0.55}ms`,
              }}
            >
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/80">{brandLabel}</p>
              <h3 className="mb-2 font-display text-3xl font-bold text-white">One of us?</h3>
              <p className="mb-5 text-xs leading-relaxed text-white/90 max-w-[240px]">
                Welcome back. Sign in and continue your interview practice.
              </p>
              <button
                type="button"
                onClick={() => handleSwitch(true)}
                className="rounded-full border-2 border-white px-8 py-2 text-xs font-semibold tracking-wider text-white transition-all hover:bg-white hover:text-[var(--primary)] uppercase cursor-pointer"
              >
                SIGN IN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================== موبايل ===================== */}
      <div className="w-full max-w-sm overflow-hidden rounded-3xl bg-card shadow-[var(--shadow-elegant)] md:hidden">
        <div className="relative h-40 w-full overflow-hidden">
          <img src={handshakeImage} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(-45deg, color-mix(in oklab, var(--primary) 55%, transparent) 0%, color-mix(in oklab, var(--accent) 45%, transparent) 100%)",
            }}
          />
        </div>
        <div className="p-7">
          {isSigninActive ? signInSlot : signUpSlot}
          <button
            type="button"
            onClick={() => handleSwitch(!isSigninActive)}
            className="mt-6 w-full text-center text-sm font-medium text-primary"
          >
            {isSigninActive ? "New here? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}