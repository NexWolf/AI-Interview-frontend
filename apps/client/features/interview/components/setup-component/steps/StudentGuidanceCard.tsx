import React from "react";
import {
  GraduationCap,
  Sparkles,
  Lightbulb,
  Rocket,
  Target,
  Code2,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";

export const StudentGuidanceCard: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const steps = [
    {
      step: "01",
      icon: Target,
      title: isAr ? "التعريف بالذات والمهارات" : "Introduce Yourself & Tools",
      desc: isAr
        ? "تحدث بعفوية وصراحة عن مستواك، شغفك، وأي لغات أو أدوات برمجية اطلعت عليها حتى لو كانت مجرد أساسيات."
        : "Speak openly about your current skills, passion, and any tools or languages you've experimented with.",
      badge: isAr ? "انطلاقة مريحة" : "Comfortable Start",
      gradient: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-500",
    },
    {
      step: "02",
      icon: Sparkles,
      title: isAr ? "تحليل الذكاء الاصطناعي" : "AI Readiness Analysis",
      desc: isAr
        ? "سيتفاعل معك المحاور الذكي بلباقة لتشخيص أسلوب تفكيرك البرمجي ونقاط قوتك بدون أي تعقيد أو أسئلة تعجيزية."
        : "The AI agent analyzes your problem-solving style and foundational strengths without tricky or punitive questions.",
      badge: isAr ? "تشخيص ودّي" : "Friendly Assessment",
      gradient: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-500",
    },
    {
      step: "03",
      icon: Rocket,
      title: isAr ? "مشروع تطبيقي على قدّك 🚀" : "Tailored Project for You 🚀",
      desc: isAr
        ? "بناءً على حديثك، سيقوم الوكيل الذكي بتصميم مشروع عملي ومهام تفاعلية تناسب مستواك وتبني بورتفوليو احترافي."
        : "Based on your talk, the AI agent builds a hands-on project and structured roadmap matched precisely to your tier.",
      badge: isAr ? "الهدف النهائي" : "The Core Goal",
      gradient: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-500",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-b from-card/90 via-card to-background p-5 sm:p-7 shadow-xl shadow-primary/5 space-y-6">
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-1/4 w-72 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute -bottom-10 left-10 w-60 h-28 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Banner */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 shrink-0">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
                {isAr ? "مسار الطالب والبداية البرمجية" : "Student & Beginner Pathway"}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isAr ? "بدون متطلبات مسبقة" : "Zero Prerequisites"}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground mt-1">
              {isAr ? "أهلاً بك في مسار التوجيه والمشاريع الذكية 🧭" : "Welcome to the Guided Student Pathway 🧭"}
            </h2>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-xl border border-border/50">
          <Code2 className="w-3.5 h-3.5 text-primary" />
          <span>{isAr ? "جلسة استكشافية مخصصة" : "Personalized Session"}</span>
        </div>
      </div>

      {/* The 3-Step Journey Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {steps.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.step}
              className={`relative overflow-hidden rounded-2xl border p-4.5 bg-gradient-to-br ${item.gradient} transition-all duration-200 hover:scale-[1.01] flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-background/80 backdrop-blur-xs flex items-center justify-center shadow-xs">
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-background/60 backdrop-blur-xs text-foreground/80 border border-border/40">
                      {item.badge}
                    </span>
                    <span className="text-xs font-black opacity-40">
                      {item.step}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-foreground">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-border/20 flex items-center gap-1.5 text-[11px] font-medium text-foreground/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span>{isAr ? "خطوة أساسية في التقييم" : "Core Step"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Golden Highlight Card: The Prompt Secret */}
      <div className="relative z-10 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-4 sm:p-5">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
            <Lightbulb className="w-5 h-5 animate-bounce" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-500">
                {isAr ? "💡 النصيحة الذهبية للمقابلة" : "💡 Golden Advice"}
              </span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed">
              {isAr ? (
                <>
                  عندما يطلب منك المحاور الذكي:{" "}
                  <span className="underline decoration-amber-500 decoration-2 font-bold text-amber-400">
                    &quot;عرفني عن نفسك وخلفيتك البرمجية&quot;
                  </span>
                  ، تحدث بكل أريحية عن كل ما تعرفه، الأدوات التي جربتها، وشغفك الحالي
                  (حتى لو كانت مجرد معلومات أساسية). الهدف هو أن يصمم لك الذكاء الاصطناعي{" "}
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                    مشروعاً تطبيقياً على قدّك تماماً 🚀
                  </span>{" "}
                  تبدأ به مسيرتك وتتطور من خلاله خطوة بخطوة.
                </>
              ) : (
                <>
                  When the AI interviewer asks you:{" "}
                  <span className="underline decoration-amber-500 decoration-2 font-bold text-amber-400">
                    &quot;Introduce yourself and your programming background&quot;
                  </span>
                  , speak freely about whatever you know, any tools you tried, and what you enjoy
                  learning. The goal is for the AI agent to tailor a{" "}
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md border border-emerald-500/20">
                    project matched exactly to your level 🚀
                  </span>{" "}
                  so you can grow with confidence.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentGuidanceCard;
