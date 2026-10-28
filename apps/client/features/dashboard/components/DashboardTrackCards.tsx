"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Layers,
  Compass,
  FolderGit2,
  GitBranch,
} from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { useLanguage } from "@/shared/context/LanguageContext";
import { Button } from "@/components/ui/button";
import CareerDiscoveryModal from "./CareerDiscoveryModal";
import LearningTrackPreviewModal from "./LearningTrackPreviewModal";
import { useProfileProjects } from "@/features/profile/hook/useProfileProjects";
import { ProjectDialog } from "@/features/profile/components/projects/ProjectDialog";

// =========================================================================
// TYPES & THEME DEFINITIONS
// =========================================================================
type TrackTheme = "cyan" | "purple" | "amber";

interface TrackAction {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

interface TrackCardData {
  id: string;
  theme: TrackTheme;
  headerIcon: React.ReactNode;
  badgeIcon?: React.ReactNode;
  badgeText: string;
  title: string;
  description: string;
  highlights: Array<{
    icon: React.ReactNode;
    text: string;
  }>;
  tagsLabel: string;
  tags: string[];
  primaryAction: TrackAction;
  secondaryAction: TrackAction;
}

const THEME_STYLES: Record<
  TrackTheme,
  {
    border: string;
    glow: string;
    bgGradient: string;
    iconBg: string;
    badge: string;
    titleHover: string;
    pillBg: string;
    tagBorder: string;
    primaryBtn: string;
    secondaryBtn: string;
  }
> = {
  cyan: {
    border:
      "border-cyan-500/35 dark:border-cyan-500/25 hover:border-cyan-500/60 dark:hover:border-cyan-500/40",
    glow: "bg-cyan-500/10 dark:bg-cyan-500/15 group-hover:bg-cyan-500/20 dark:group-hover:bg-cyan-500/25",
    bgGradient:
      "bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/30 dark:from-card/95 dark:via-card/70 dark:to-cyan-950/20 shadow-lg shadow-cyan-950/5 dark:shadow-xl dark:shadow-cyan-950/10",
    iconBg:
      "bg-gradient-to-tr from-cyan-600 to-emerald-500 text-white shadow-cyan-500/25",
    badge: "border-cyan-500/40 bg-cyan-500/15 text-cyan-800 dark:text-cyan-300",
    titleHover: "group-hover:text-cyan-700 dark:group-hover:text-cyan-400",
    pillBg: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-400",
    tagBorder:
      "border-cyan-500/30 bg-cyan-100/60 text-cyan-900 dark:border-cyan-500/20 dark:bg-cyan-500/5 dark:text-cyan-300",
    primaryBtn:
      "bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white shadow-cyan-950/20",
    secondaryBtn:
      "border-cyan-500/40 bg-cyan-50/80 text-cyan-800 hover:bg-cyan-100 dark:border-cyan-500/35 dark:bg-cyan-500/5 dark:text-cyan-300 dark:hover:bg-cyan-500/15 dark:hover:border-cyan-500/60",
  },
  purple: {
    border:
      "border-purple-500/30 dark:border-primary/30 hover:border-purple-500/60 dark:hover:border-primary/60",
    glow: "bg-purple-500/10 dark:bg-primary/20 group-hover:bg-purple-500/20 dark:group-hover:bg-primary/35",
    bgGradient:
      "bg-gradient-to-br from-white via-purple-50/50 to-indigo-50/30 dark:from-card/95 dark:via-card/70 dark:to-[#6136BF]/20 shadow-lg shadow-purple-950/5 dark:shadow-xl dark:shadow-primary/10",
    iconBg:
      "bg-gradient-to-tr from-[#6136BF] to-[#9F84D9] text-white shadow-primary/30",
    badge:
      "border-purple-500/40 bg-purple-500/15 text-purple-800 dark:text-primary-foreground/90",
    titleHover: "group-hover:text-purple-700 dark:group-hover:text-primary",
    pillBg: "bg-purple-100 text-purple-700 dark:bg-primary/20 dark:text-[#C4B5FD]",
    tagBorder:
      "border-purple-500/30 bg-purple-100/60 text-purple-900 dark:border-primary/20 dark:bg-primary/10 dark:text-[#C4B5FD]",
    primaryBtn:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/25",
    secondaryBtn:
      "border-purple-500/40 bg-purple-50/80 text-purple-800 hover:bg-purple-100 dark:border-primary/35 dark:bg-primary/5 dark:text-primary-foreground/90 dark:hover:bg-primary/15 dark:hover:border-primary/60",
  },
  amber: {
    border:
      "border-amber-500/35 dark:border-amber-500/25 hover:border-amber-500/60 dark:hover:border-amber-500/40",
    glow: "bg-amber-500/10 dark:bg-amber-500/15 group-hover:bg-amber-500/20 dark:group-hover:bg-amber-500/25",
    bgGradient:
      "bg-gradient-to-br from-white via-amber-50/50 to-orange-50/30 dark:from-card/95 dark:via-card/70 dark:to-amber-950/20 shadow-lg shadow-amber-950/5 dark:shadow-xl dark:shadow-amber-950/10",
    iconBg:
      "bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-amber-500/25",
    badge: "border-amber-500/40 bg-amber-500/15 text-amber-800 dark:text-amber-300",
    titleHover: "group-hover:text-amber-700 dark:group-hover:text-amber-400",
    pillBg: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
    tagBorder:
      "border-amber-500/30 bg-amber-100/60 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/5 dark:text-amber-300",
    primaryBtn:
      "bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-950/20",
    secondaryBtn:
      "border-amber-500/40 bg-amber-50/80 text-amber-800 hover:bg-amber-100 dark:border-amber-500/35 dark:bg-amber-500/5 dark:text-amber-300 dark:hover:bg-amber-500/15 dark:hover:border-amber-500/60",
  },
};

// =========================================================================
// REUSABLE ACTION BUTTON (LINK OR BUTTON)
// =========================================================================
function ActionButton({
  action,
  className,
}: {
  action: TrackAction;
  className: string;
}) {
  if (action.href) {
    return (
      <Button asChild className={className}>
        <Link href={action.href}>
          {action.icon}
          <span>{action.label}</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={action.onClick}
      className={`${className} cursor-pointer`}
    >
      {action.icon}
      <span>{action.label}</span>
      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1 rtl:rotate-180 rtl:group-hover/btn:-translate-x-1" />
    </Button>
  );
}

// =========================================================================
// REUSABLE DYNAMIC TRACK CARD
// =========================================================================
function TrackCard({ data }: { data: TrackCardData }) {
  const styles = THEME_STYLES[data.theme];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${styles.border} ${styles.bgGradient} p-6 sm:p-7 transition-all duration-300 flex flex-col justify-between group`}
    >
      {/* Top ambient glow */}
      <div
        className={`absolute -top-20 -right-20 h-44 w-44 rounded-full ${styles.glow} blur-3xl pointer-events-none transition-all`}
      />

      <div>
        {/* Header: Icon + Badge */}
        <div className="flex items-center justify-between mb-5">
          <div
            className={`flex h-13 w-13 items-center justify-center rounded-2xl ${styles.iconBg} shadow-lg`}
          >
            {data.headerIcon}
          </div>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles.badge}`}
          >
            {data.badgeIcon}
            {data.badgeText}
          </span>
        </div>

        {/* Title & Description */}
        <h2
          className={`text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-foreground ${styles.titleHover} transition-colors`}
        >
          {data.title}
        </h2>

        <p className="mt-2.5 text-sm leading-relaxed text-slate-600 dark:text-muted-foreground">
          {data.description}
        </p>

        {/* Highlights Pills */}
        <div className="mt-5 space-y-2">
          {data.highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-800 dark:text-foreground/85"
            >
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md ${styles.pillBg}`}
              >
                {item.icon}
              </div>
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Micro Tags */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5 pt-4 border-t border-border/50">
          <span className="text-[11px] font-medium text-slate-500 dark:text-muted-foreground">
            {data.tagsLabel}
          </span>
          {data.tags.map((tag) => (
            <span
              key={tag}
              className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${styles.tagBorder}`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-2 space-y-2.5">
        <ActionButton
          action={data.primaryAction}
          className={`group/btn w-full rounded-xl ${styles.primaryBtn} font-semibold shadow-lg flex items-center justify-center gap-2 py-5 transition-all`}
        />
        <ActionButton
          action={data.secondaryAction}
          className={`group/btn w-full rounded-xl border ${styles.secondaryBtn} transition-all flex items-center justify-center gap-2 py-4`}
        />
      </div>
    </div>
  );
}

// =========================================================================
// MAIN DASHBOARD TRACK CARDS CONTAINER
// =========================================================================
export default function DashboardTrackCards() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const isAr = language === "ar";
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDiscoveryOpen, setIsDiscoveryOpen] = useState(false);

  // Reuse existing profile project hook & dialog
  const {
    dialogOpen,
    editingProject,
    formData,
    isAnalyzing,
    handleOpenAdd,
    handleCloseDialog,
    handleFieldChange,
    handleSubmit,
  } = useProfileProjects({
    onProjectCreated: (project) => {
      if (project.codebaseProjectId) {
        router.push(
          `/interview/setup?projectId=${encodeURIComponent(project.codebaseProjectId)}`
        );
      } else {
        router.push("/dashboard/profile");
      }
    },
  });

  // Track configurations array (easily extensible)
  const tracks: TrackCardData[] = useMemo(
    () => [
      {
        id: "learn-track",
        theme: "cyan",
        headerIcon: <Code2 className="h-6 w-6" />,
        badgeIcon: <Terminal className="h-3 w-3" />,
        badgeText: t("dashboard.tracks.learn.badge"),
        title: t("dashboard.tracks.learn.title"),
        description: t("dashboard.tracks.learn.desc"),
        highlights: [
          {
            icon: <BookOpen className="h-3.5 w-3.5" />,
            text: t("dashboard.tracks.learn.tag1"),
          },
          {
            icon: <Cpu className="h-3.5 w-3.5" />,
            text: t("dashboard.tracks.learn.tag2"),
          },
          {
            icon: <Terminal className="h-3.5 w-3.5" />,
            text: t("dashboard.tracks.learn.tag3"),
          },
        ],
        tagsLabel: isAr ? "التقنيات المتاحة:" : "Tracks:",
        tags: ["HTML & CSS", "JavaScript", "Python & AI", "React"],
        primaryAction: {
          label: t("dashboard.tracks.learn.discoveryBtn"),
          icon: (
            <Compass className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-45" />
          ),
          href: "/interview/setup?mode=career_discovery",
        },
        secondaryAction: {
          label: t("dashboard.tracks.learn.cta"),
          onClick: () => setIsPreviewOpen(true),
        },
      },
      {
        id: "interview-track",
        theme: "purple",
        headerIcon: <Bot className="h-6 w-6" />,
        badgeIcon: (
          <Sparkles className="h-3 w-3 text-purple-600 dark:text-[#C4B5FD]" />
        ),
        badgeText: t("dashboard.tracks.interview.badge"),
        title: t("dashboard.tracks.interview.title"),
        description: t("dashboard.tracks.interview.desc"),
        highlights: [
          {
            icon: <Video className="h-3.5 w-3.5" />,
            text: t("dashboard.tracks.interview.tag1"),
          },
          {
            icon: <Target className="h-3.5 w-3.5" />,
            text: t("dashboard.tracks.interview.tag2"),
          },
          {
            icon: <Sparkles className="h-3.5 w-3.5" />,
            text: t("dashboard.tracks.interview.tag3"),
          },
        ],
        tagsLabel: isAr ? "أنماط المقابلات:" : "Simulation Modes:",
        tags: [
          isAr ? "صوت وميكروفون" : "Voice Live",
          isAr ? "كاميرا ومراقبة" : "Vision AI",
          isAr ? "تحليل الكود" : "Live Coding",
        ],
        primaryAction: {
          label: t("dashboard.tracks.interview.cta"),
          href: "/interview/setup",
        },
        secondaryAction: {
          label: isAr ? "سجل مقابلاتي السابقة" : "View Past Interviews",
          href: "/dashboard/interviewDetails",
        },
      },
      {
        id: "github-codebase-track",
        theme: "amber",
        headerIcon: <FolderGit2 className="h-6 w-6" />,
        badgeIcon: <FaGithub className="h-3.5 w-3.5" />,
        badgeText: isAr ? "اختبار كود المشروع" : "Project Code Defense",
        title: isAr
          ? "اختبر نفسك في مشروعك البرمجي"
          : "GitHub Project Interview",
        description: isAr
          ? "اربط مستودع مشروعك على GitHub ليحلل الذكاء الاصطناعي بنية مشروعك، ويختبرك في دوالك الفعلية وقراراتك البرمجية."
          : "Link your GitHub repository to let AI inspect your codebase architecture and interview you directly on your real code.",
        highlights: [
          {
            icon: <GitBranch className="h-3.5 w-3.5" />,
            text: isAr
              ? "تحليل شامل لملفات ودوال الـ Codebase"
              : "Complete Code AST & Structure Parsing",
          },
          {
            icon: <CheckCircle2 className="h-3.5 w-3.5" />,
            text: isAr
              ? "أسئلة مخصصة لكودك وحلولك البرمجية"
              : "Personalized Questions on Your Own Logic",
          },
          {
            icon: <Layers className="h-3.5 w-3.5" />,
            text: isAr
              ? "يُحفظ المشروع وتقييمه في ملفك الشخصي"
              : "Saved & Evaluated in Your Profile",
          },
        ],
        tagsLabel: isAr ? "التقنيات المدعومة:" : "Supported:",
        tags: [
          "React & Next.js",
          "Node.js & Python",
          "Clean Code",
          "GitHub Repos",
        ],
        primaryAction: {
          label: isAr ? "اختبر مشروعك الآن" : "Test Your Project Now",
          icon: <FaGithub className="h-4 w-4" />,
          onClick: handleOpenAdd,
        },
        secondaryAction: {
          label: isAr ? "عرض مشاريعك في البروفايل" : "Manage Profile Projects",
          href: "/dashboard/profile",
        },
      },
    ],
    [t, isAr, handleOpenAdd]
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <TrackCard key={track.id} data={track} />
        ))}
      </div>

      {/* Reused Project Dialog directly on Dashboard */}
      <ProjectDialog
        isOpen={dialogOpen}
        isEditing={Boolean(editingProject)}
        isAnalyzing={isAnalyzing}
        formData={formData}
        onChangeField={handleFieldChange}
        onSubmit={handleSubmit}
        onClose={handleCloseDialog}
      />

      {/* Standalone Learning Track Preview Dialog */}
      <LearningTrackPreviewModal
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        onStartDiscovery={() => {
          setIsPreviewOpen(false);
          setIsDiscoveryOpen(true);
        }}
      />

      {/* Standalone Career Discovery Modal */}
      <CareerDiscoveryModal
        open={isDiscoveryOpen}
        onOpenChange={setIsDiscoveryOpen}
      />
    </>
  );
}
