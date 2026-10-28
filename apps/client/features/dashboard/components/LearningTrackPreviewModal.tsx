"use client";

import {
  Code2,
  Cpu,
  Terminal,
  Clock,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/shared/context/LanguageContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface LearningTrackPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartDiscovery?: () => void;
}

export default function LearningTrackPreviewModal({
  open,
  onOpenChange,
  onStartDiscovery,
}: LearningTrackPreviewModalProps) {
  const { t, language } = useLanguage();
  const isAr = language === "ar";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden bg-card border border-cyan-500/35 text-foreground rounded-3xl shadow-2xl shadow-cyan-950/40">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/60 bg-muted/30 shrink-0">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                {t("dashboard.tracks.learn.previewBadge")}
              </span>
              <span className="text-xs text-muted-foreground">• 3 مسارات تعليمية</span>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
              {isAr
                ? "مسارات التعلّم البرمجي من الصفر 🚀"
                : "Learn to Code from Scratch Roadmaps 🚀"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs sm:text-sm mt-1">
              {isAr
                ? "خارطة طريق مدروسة ومقسمة إلى مستويات عملية لتنقلك من الصفر حتى الجاهزية لسوق العمل والمقابلات:"
                : "Structured step-by-step tracks taking you from complete beginner to job-ready candidate:"}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(88vh-140px)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Track 1: Full-stack Web */}
            <div className="rounded-2xl border border-cyan-500/20 bg-card/70 p-5 flex flex-col justify-between transition-all hover:border-cyan-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-cyan-950/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                    {isAr ? "مبتدئ -> متقدم" : "Beginner -> Pro"}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base leading-snug">
                  {isAr
                    ? "مسار تطوير الويب الشامل"
                    : "Full-Stack Web Development"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {isAr
                    ? "تعلّم بناء واجهات وتطبيقات الويب التفاعلية من الصفر وحتى الاحتراف."
                    : "Build modern, responsive web apps from scratch to deployment."}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {["HTML/CSS", "JavaScript", "React", "Node.js"].map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:text-cyan-300"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {isAr ? "12 أسبوع" : "12 Weeks"}
                </span>
                <span>{isAr ? "4 مشاريع عملية" : "4 Projects"}</span>
              </div>
            </div>

            {/* Track 2: Python & AI */}
            <div className="rounded-2xl border border-cyan-500/20 bg-card/70 p-5 flex flex-col justify-between transition-all hover:border-cyan-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-cyan-950/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                    {isAr ? "الأكثر طلباً" : "High Demand"}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base leading-snug">
                  {isAr ? "بايثون والذكاء الاصطناعي" : "Python & AI Engineering"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {isAr
                    ? "أساسيات لغة بايثون، هياكل البيانات، ودمج نماذج الذكاء الاصطناعي التوليدي."
                    : "Master Python fundamentals, data structures, and LLM API integrations."}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {["Python", "FastAPI", "Data Structures", "OpenAI/Gemini"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:text-cyan-300"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {isAr ? "10 أسابيع" : "10 Weeks"}
                </span>
                <span>{isAr ? "3 تطبيقات ذكاء اصطناعي" : "3 AI Apps"}</span>
              </div>
            </div>

            {/* Track 3: Algorithms & Problem Solving */}
            <div className="rounded-2xl border border-cyan-500/20 bg-card/70 p-5 flex flex-col justify-between transition-all hover:border-cyan-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-cyan-950/20">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                    {isAr ? "أساسيات قوية" : "Core Foundations"}
                  </span>
                </div>

                <h3 className="font-bold text-foreground text-base leading-snug">
                  {isAr
                    ? "الخوارزميات وحل المشكلات"
                    : "Algorithms & Problem Solving"}
                </h3>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                  {isAr
                    ? "بناء التفكير المنطقي لاجتياز اختبارات LeetCode والمقابلات التقنية الكبرى."
                    : "Master problem-solving patterns, Big-O notation, and technical interview puzzles."}
                </p>

                <div className="mt-4 flex flex-wrap gap-1">
                  {["Problem Solving", "Big-O", "Recursion", "LeetCode Prep"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-medium text-cyan-700 dark:text-cyan-300"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1 text-cyan-700 dark:text-cyan-400 font-medium">
                  <Clock className="h-3.5 w-3.5" />
                  {isAr ? "8 أسابيع" : "8 Weeks"}
                </span>
                <span>{isAr ? "50+ تحدي برمجي" : "50+ Challenges"}</span>
              </div>
            </div>
          </div>

          {/* AI Assistant Callout */}
          <div className="rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-center sm:text-start">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-700 dark:text-cyan-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">
                  {isAr
                    ? "هل أنت محتار من أين تبدأ؟"
                    : "Not sure which track fits you best?"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isAr
                    ? "تحدث مع مستشارك الذكي لمطابقة اهتماماتك بالمسار الأنسب لمستقبلك."
                    : "Let our AI advisor match your passions with the most lucrative career path."}
                </p>
              </div>
            </div>

            {onStartDiscovery && (
              <Button
                type="button"
                onClick={onStartDiscovery}
                className="shrink-0 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs py-2 px-4 shadow-md shadow-cyan-950/20 cursor-pointer"
              >
                <span>{isAr ? "ابدأ الاستشارة الذكية 🧭" : "Start AI Assessment 🧭"}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-border/60 bg-muted/20 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>
              {isAr
                ? "جميع المسارات تتضمن مدرب ذكاء اصطناعي تفاعلي يصحح كودك في الوقت الفعلي."
                : "All tracks include real-time AI code review and personalized learning milestones."}
            </span>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto rounded-xl border-border hover:bg-muted text-xs cursor-pointer"
          >
            {isAr ? "إغلاق المعاينة" : "Close Preview"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
