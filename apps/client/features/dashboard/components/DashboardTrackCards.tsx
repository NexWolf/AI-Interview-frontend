"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Code2,
  Sparkles,
  Bot,
  Video,
  BookOpen,
  ArrowRight,
  Terminal,
  Cpu,
  Target,
  CheckCircle2,
  Clock,
  Layers,
  Compass,
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
import CareerDiscoveryModal from "./CareerDiscoveryModal";

export default function DashboardTrackCards() {
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* =========================================================
            CARD 1: LEARN PROGRAMMING FROM SCRATCH
        ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl border border-cyan-500/25 bg-gradient-to-br from-card/95 via-card/70 to-cyan-950/20 p-6 sm:p-7 shadow-xl shadow-cyan-950/10 hover:border-cyan-500/40 transition-all duration-300 flex flex-col justify-between group">
          {/* Top ambient glow */}
          <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none group-hover:bg-cyan-500/25 transition-all" />

          <div>
            {/* Header: Icon + Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white shadow-lg shadow-cyan-500/25">
                <Code2 className="h-6 w-6" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-400">
                <Terminal className="h-3 w-3" />
                {t("dashboard.tracks.learn.badge")}
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-cyan-400 transition-colors">
              {t("dashboard.tracks.learn.title")}
            </h2>

            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {t("dashboard.tracks.learn.desc")}
            </p>

            {/* Highlights Pills */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/85">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400">
                  <BookOpen className="h-3.5 w-3.5" />
                </div>
                <span>{t("dashboard.tracks.learn.tag1")}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/85">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400">
                  <Cpu className="h-3.5 w-3.5" />
                </div>
                <span>{t("dashboard.tracks.learn.tag2")}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/85">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-500/15 text-cyan-400">
                  <Terminal className="h-3.5 w-3.5" />
                </div>
                <span>{t("dashboard.tracks.learn.tag3")}</span>
              </div>
            </div>

            {/* Micro Roadmap Tags */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/50">
              <span className="text-[11px] font-medium text-muted-foreground">
                {isAr ? "التقنيات المتاحة:" : "Tracks:"}
              </span>
              {["HTML & CSS", "JavaScript", "Python & AI", "React"].map(
                (skill) => (
                  <span
                    key={skill}
                    className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[11px] font-medium text-cyan-300"
                  >
                    {skill}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-2 space-y-2.5">
            <Button
              asChild
              className="group/btn w-full rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold shadow-lg shadow-cyan-950/30 flex items-center justify-center gap-2 py-5 transition-all"
            >
              <Link href="/interview/setup?mode=career_discovery">
                <Compass className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
                <span>{t("dashboard.tracks.learn.discoveryBtn")}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
              </Link>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="group/btn w-full rounded-xl border border-cyan-500/35 bg-cyan-500/5 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/60 transition-all flex items-center justify-center gap-2 py-4"
            >
              <span className="font-medium text-xs sm:text-sm">
                {t("dashboard.tracks.learn.cta")}
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
            </Button>
          </div>
        </div>

        {/* =========================================================
            CARD 2: AI MOCK INTERVIEW TRACK (EXISTING CORE FEATURE)
        ========================================================= */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card/95 via-card/70 to-[#6136BF]/20 p-6 sm:p-7 shadow-xl shadow-primary/10 hover:border-primary/60 transition-all duration-300 flex flex-col justify-between group">
          {/* Top ambient glow */}
          <div className="absolute -top-20 -right-20 h-44 w-44 rounded-full bg-primary/20 blur-3xl pointer-events-none group-hover:bg-primary/35 transition-all" />

          <div>
            {/* Header: Icon + Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#6136BF] to-[#9F84D9] text-white shadow-lg shadow-primary/30">
                <Bot className="h-6 w-6" />
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1 text-xs font-semibold text-primary-foreground/90">
                <Sparkles className="h-3 w-3 text-[#C4B5FD]" />
                {t("dashboard.tracks.interview.badge")}
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
              {t("dashboard.tracks.interview.title")}
            </h2>

            <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
              {t("dashboard.tracks.interview.desc")}
            </p>

            {/* Highlights Pills */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/85">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/20 text-[#C4B5FD]">
                  <Video className="h-3.5 w-3.5" />
                </div>
                <span>{t("dashboard.tracks.interview.tag1")}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/85">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/20 text-[#C4B5FD]">
                  <Target className="h-3.5 w-3.5" />
                </div>
                <span>{t("dashboard.tracks.interview.tag2")}</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs sm:text-sm text-foreground/85">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-primary/20 text-[#C4B5FD]">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <span>{t("dashboard.tracks.interview.tag3")}</span>
              </div>
            </div>

            {/* Quick Readiness Badge */}
            <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/50">
              <span className="text-[11px] font-medium text-muted-foreground">
                {isAr ? "أنماط المقابلات:" : "Simulation Modes:"}
              </span>
              {[
                isAr ? "صوت وميكروفون" : "Voice Live",
                isAr ? "كاميرا ومراقبة" : "Vision AI",
                isAr ? "تحليل الكود" : "Live Coding",
              ].map((mode) => (
                <span
                  key={mode}
                  className="rounded-md border border-primary/20 bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-[#C4B5FD]"
                >
                  {mode}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-2 space-y-2.5">
            <Button
              asChild
              className="group/btn w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 py-5"
            >
              <Link href="/interview/setup">
                <span className="font-semibold text-sm">
                  {t("dashboard.tracks.interview.cta")}
                </span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="group/btn w-full rounded-xl border border-primary/35 bg-primary/5 text-primary-foreground/90 hover:bg-primary/15 hover:border-primary/60 transition-all flex items-center justify-center gap-2 py-4"
            >
              <Link href="/dashboard/interviewDetails">
                <span className="font-medium text-xs sm:text-sm">
                  {isAr ? "سجل مقابلاتي السابقة" : "View Past Interviews"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* =========================================================
          INTERACTIVE PREVIEW DIALOG FOR LEARNING TRACK
      ========================================================= */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="w-[95vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[88vh] flex flex-col gap-0 p-0 overflow-hidden bg-[#120D17] border border-cyan-500/35 text-foreground rounded-3xl shadow-2xl shadow-cyan-950/40">
          {/* Header */}
          <div className="p-5 sm:p-6 pb-4 border-b border-border/60 bg-[#16101E]/90 shrink-0">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-400">
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
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                      <Code2 className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
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
                        className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2 py-0.5 text-[10px] font-medium text-cyan-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-cyan-400" />
                    {isAr ? "4 مستويات متدرجة" : "4 Levels"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-cyan-400" />
                    {isAr ? "مشاريع عملية" : "Hands-on"}
                  </span>
                </div>
              </div>

              {/* Track 2: Python & AI */}
              <div className="rounded-2xl border border-emerald-500/20 bg-card/70 p-5 flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-emerald-950/20">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                      {isAr ? "مبتدئ -> متوسط" : "Beginner -> Mid"}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-base leading-snug">
                    {isAr
                      ? "مسار بايثون والذكاء الاصطناعي"
                      : "Python & AI Engineering"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {isAr
                      ? "أساسيات لغة بايثون، هياكل البيانات، ودمج وتطوير تطبيقات الذكاء الاصطناعي."
                      : "Master Python fundamentals, OOP, and build modern AI-driven solutions."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {["Python 3", "OOP", "APIs", "GenAI"].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2 py-0.5 text-[10px] font-medium text-emerald-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-emerald-400" />
                    {isAr ? "3 مستويات أساسية" : "3 Core Levels"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    {isAr ? "تطبيقات ذكية" : "AI Apps"}
                  </span>
                </div>
              </div>

              {/* Track 3: Problem Solving */}
              <div className="rounded-2xl border border-purple-500/20 bg-card/70 p-5 flex flex-col justify-between transition-all hover:border-purple-500/50 hover:bg-card/90 hover:shadow-lg hover:shadow-purple-950/20">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      <Target className="h-5 w-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-0.5 rounded-full border border-purple-500/25">
                      {isAr ? "تجهيز للمقابلات" : "Interview Prep"}
                    </span>
                  </div>

                  <h3 className="font-bold text-foreground text-base leading-snug">
                    {isAr
                      ? "مسار حل المشكلات والخوارزميات"
                      : "Algorithms & Problem Solving"}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {isAr
                      ? "بناء التفكير المنطقي وحل المسائل البرمجية الشائعة في مقابلات الشركات الكبرى."
                      : "Sharpen algorithmic thinking to crush technical coding interview rounds."}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {["Logic", "Arrays", "Search & Sort", "Big O"].map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md border border-purple-500/20 bg-purple-500/5 px-2 py-0.5 text-[10px] font-medium text-purple-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5 text-purple-400" />
                    {isAr ? "تحديات متدرجة" : "Graded Tasks"}
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                    {isAr ? "أسئلة المقابلات" : "FAANG-ready"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 sm:px-6 border-t border-border/60 bg-[#140E1B] shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground text-center sm:text-start">
              {isAr
                ? "💡 يتم تجهيز بيئة التمارين التفاعلية حالياً. يمكنك تجربة محاكاة المقابلات الآن!"
                : "💡 Interactive coding environment is being prepared. You can practice mock interviews now!"}
            </p>
            <Button
              type="button"
              onClick={() => setIsPreviewOpen(false)}
              className="w-full sm:w-auto rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-6"
            >
              {isAr ? "حسناً، رائع" : "Got it"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Career Discovery Interactive Modal */}
      <CareerDiscoveryModal
        open={isDiscoveryOpen}
        onOpenChange={setIsDiscoveryOpen}
      />
    </>
  );
}
