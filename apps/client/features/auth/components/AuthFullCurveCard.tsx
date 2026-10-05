"use client";

import { ReactNode } from "react";

type AuthFullCurveCardProps = {
  /** نفس صورة اليد يلي مستخدمة بصفحات Sign in / Sign up — عنصر وحيد، ثابت */
  handshakeImage: string;
  brandLabel?: string;
  /** محتوى الكارد (الفورم/الحالة) بيندخل هون */
  children: ReactNode;
};

/**
 * الخلفية (الصورة + المنحنى البنفسجي) بتعبّي الشاشة كاملة (full-screen)،
 * وكارد المحتوى بيطفو بالمنتصف كـ Modal/Popup فوقها.
 */
export default function AuthFullCurveCard({
  handshakeImage,
  brandLabel = "AI INTERVIEW",
  children,
}: AuthFullCurveCardProps) {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <style>{`
        :root {
          --primary: oklch(52% 0.21 295);
          --accent: oklch(62% 0.19 320);
          --foreground: oklch(22% 0.05 295);
          --card: oklch(100% 0 0);
          --shadow-elegant: 0 30px 60px -20px color-mix(in oklab, var(--primary) 35%, transparent);
        }
        .font-display { font-family: "Sora", ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      {/* الخلفية الاحتياطية (لو الصورة ما تحمّلت) */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, oklch(58% 0.19 290) 0%, oklch(40% 0.2 300) 100%)",
        }}
      />

      {/* الصورة — تغطي الشاشة كاملة */}
      <img
        src={handshakeImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* التلوين البنفسجي فوق الصورة، الشاشة كاملة */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 60%, transparent) 0%, color-mix(in oklab, var(--accent) 75%, transparent) 100%)",
        }}
      />

      {/* طبقة تعتيم إضافية خفيفة تساعد الـ Modal يبين وكأنه فوق popup حقيقي */}
      <div className="absolute inset-0 bg-black/20" />

      {/* العلامة فوق الشاشة (اختياري) */}
      {/* <p className="absolute left-1/2 top-8 -translate-x-1/2 text-xs font-semibold uppercase tracking-[0.35em] text-white/80">
        {brandLabel}
      </p> */}

      {/* كارد المحتوى — Modal عايم بمنتصف الشاشة */}
      <div className="absolute inset-0 z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-[500px] rounded-[24px] bg-white/30 backdrop-blur-sm p-8">
          {children}
        </div>
      </div>
    </div>
  );
}