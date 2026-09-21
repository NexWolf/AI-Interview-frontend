"use client";

import React from "react";
import {
  Sparkles,
  CheckCircle2,
  User,
  FileText,
  Award,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface OnboardingSidebarProps {
  currentStep?: number;
  totalSteps?: number;
  className?: string;
}

interface StepMeta {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

const STEP_DETAILS: StepMeta[] = [
  {
    id: 1,
    title: "Basic Information",
    subtitle: "Name, username & contact details",
    icon: User,
  },
  {
    id: 2,
    title: "Bio & Identity",
    subtitle: "Avatar, about you & social presence",
    icon: FileText,
  },
  {
    id: 3,
    title: "Skills & Expertise",
    subtitle: "Highlight your key capabilities",
    icon: Award,
  },
  {
    id: 4,
    title: "Education History",
    subtitle: "Degrees, institutions & academic path",
    icon: GraduationCap,
  },
];

const VALUE_PROPOSITIONS = [
  {
    title: "Stand Out to the Community",
    desc: "Complete profiles receive up to 3x more visibility.",
  },
  {
    title: "Tailored Opportunities",
    desc: "Matching projects and peers based on your skills.",
  },
  {
    title: "Verified Credentials",
    desc: "Showcase your academic journey with pride.",
  },
];

export const OnboardingSidebar: React.FC<OnboardingSidebarProps> = ({
  currentStep = 1,
  totalSteps = 4,
  className = "",
}) => {
  return (
    <div
      className={`relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/70 dark:border-border/40 bg-card/80 dark:bg-card/40 p-6 sm:p-7 backdrop-blur-2xl shadow-xl dark:shadow-2xl dark:shadow-primary/5 transition-all ${className}`}
    >
      {/* إضاءة خلفية ناعمة متناسقة مع ألوان الوضعين */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-primary/10 dark:bg-primary/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-6">
        {/* ================= 1. ترويسة مدمجة ورسالة القيمة ================= */}
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Profile Setup</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Build your professional identity
          </h2>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Complete these {totalSteps} quick steps to unlock full access,
            personalized recommendations, and connect with peers.
          </p>
        </div>

        {/* ================= 2. متتبع الخطوات المصغر (Milestones) ================= */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Milestones
            </h4>
            <span className="text-[11px] font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-md">
              Step {currentStep} of {totalSteps}
            </span>
          </div>

          <div className="space-y-1.5">
            {STEP_DETAILS.map((stepItem) => {
              const Icon = stepItem.icon;
              const isCompleted = currentStep > stepItem.id;
              const isCurrent = currentStep === stepItem.id;

              return (
                <div
                  key={stepItem.id}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                    isCurrent
                      ? "bg-primary/10 dark:bg-primary/15 border border-primary/30 text-foreground font-medium shadow-2xs"
                      : isCompleted
                        ? "bg-card/60 dark:bg-card/20 border border-border/50 dark:border-border/30 text-muted-foreground"
                        : "opacity-50 text-muted-foreground border border-transparent"
                  }`}
                >
                  {/* أيقونة الخطوة */}
                  <div
                    className={`h-6 w-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isCompleted
                        ? "bg-emerald-500/15 text-emerald-500"
                        : isCurrent
                          ? "bg-primary text-primary-foreground shadow-xs"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Icon className="h-3 w-3" />
                    )}
                  </div>

                  {/* نصوص وتفاصيل الخطوة */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-medium text-foreground">
                        {stepItem.title}
                      </p>

                      {/* شارة In progress الأنيقة المضبوطة */}
                      {isCurrent && (
                        <span className="shrink-0 inline-flex items-center gap-1.5 text-[10px] font-medium text-primary bg-primary/10 dark:bg-primary/20 border border-primary/25 px-2 py-0.5 rounded-full leading-none">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <span>In progress</span>
                        </span>
                      )}
                    </div>

                    <p className="text-[10px] text-muted-foreground truncate">
                      {stepItem.subtitle}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 3. قائمة المزايا المختصرة ================= */}
        <div className="space-y-4 pt-5 border-t border-border/50 dark:border-border/30">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Why complete your profile?
          </h4>

          <div className="space-y-3.5">
            {VALUE_PROPOSITIONS.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                {/* أيقونة الصح مع مساحة داخلية متوازنة */}
                <div className="mt-0.5 shrink-0 rounded-full bg-primary/10 dark:bg-primary/15 p-1 text-primary">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>

                {/* النصوص مع مسافة مريحة بين العنوان والوصف */}
                <div className="space-y-1 min-w-0">
                  <p className="font-semibold text-foreground text-xs">
                    {item.title}
                  </p>
                  <p className="text-muted-foreground text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= 4. شريط الثقة السفلي المصغر ================= */}
      <div className="relative z-10 mt-6 pt-3.5 border-t border-border/50 dark:border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
          <span>Encrypted & Private</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-foreground">
          <TrendingUp className="h-3 w-3 text-primary" />
          <span>85% completion rate</span>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSidebar;
