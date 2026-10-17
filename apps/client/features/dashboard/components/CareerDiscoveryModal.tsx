"use client";

import { useState } from "react";
import {
  Compass,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Bot,
  Layers,
  Clock,
  Code2,
  Cpu,
  Target,
  Zap,
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

interface CareerDiscoveryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface QuestionOption {
  id: string;
  labelAr: string;
  labelEn: string;
  icon: string;
  pathWeight: "frontend" | "backend" | "ai" | "mobile";
}

interface StepQuestion {
  id: number;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  options: QuestionOption[];
}

const QUESTIONS: StepQuestion[] = [
  {
    id: 1,
    titleAr: "طريقة تفكيرك وشغفك الأساسي",
    titleEn: "Your Core Passion & Mindset",
    descAr: "عندما تفكر في بناء برمجيات وتطبيقات، ما هو الشيء الذي يثير حماسك أكثر؟",
    descEn: "When you imagine building software, what excites you the most?",
    options: [
      {
        id: "visual",
        labelAr: "🎨 رؤية التصاميم والألوان والتفاعل المباشر على الشاشة (واجهات وتجربة المستخدم)",
        labelEn: "🎨 Visual design, animations, and immediate feedback on screen (UI/UX)",
        icon: "🎨",
        pathWeight: "frontend",
      },
      {
        id: "logic",
        labelAr: "🧠 حل المسائل المنطقية المعقدة، بناء الخوارزميات، وإدارة قواعد البيانات والأنظمة",
        labelEn: "🧠 Logical problem solving, data management, and building robust backends",
        icon: "🧠",
        pathWeight: "backend",
      },
      {
        id: "ai",
        labelAr: "🤖 بناء أنظمة ذكية، تحليل كميات ضخمة من البيانات، وتعليم الآلة للأتمتة",
        labelEn: "🤖 Intelligent systems, data science, and training AI models",
        icon: "🤖",
        pathWeight: "ai",
      },
      {
        id: "mobile",
        labelAr: "📱 بناء تطبيقات عملية تعمل مباشرة في أيدي الناس على هواتفهم الذكية",
        labelEn: "📱 Practical mobile applications running on smartphones",
        icon: "📱",
        pathWeight: "frontend",
      },
    ],
  },
  {
    id: 2,
    titleAr: "مشروع أحلامك الأول",
    titleEn: "Your Dream First Project",
    descAr: "إذا كان بإمكانك بناء تطبيقك الأول بعد إنهاء فترة التعلم، ماذا تختار؟",
    descEn: "If you could launch your first project after learning, what would it be?",
    options: [
      {
        id: "web_platform",
        labelAr: "🌐 منصة ويب تفاعلية حديثة وجذابة مثل متجر إلكتروني أو لوحة تحكم ذكية",
        labelEn: "🌐 A sleek interactive web application, like a dashboard or e-commerce store",
        icon: "🌐",
        pathWeight: "frontend",
      },
      {
        id: "api_system",
        labelAr: "⚡ محرك خلفي فائق السرعة يعالج ملايين العمليات والبيانات الحساسة بأمان",
        labelEn: "⚡ High-speed API and data infrastructure handling secure transactions",
        icon: "⚡",
        pathWeight: "backend",
      },
      {
        id: "ai_bot",
        labelAr: "🔮 مساعد ذكاء اصطناعي تفاعلي أو أداة تحليل ذكية لتوليد المحتوى والبيانات",
        labelEn: "🔮 An AI-powered assistant or predictive machine learning tool",
        icon: "🔮",
        pathWeight: "ai",
      },
    ],
  },
  {
    id: 3,
    titleAr: "خلفيتك الحالية في عالم البرمجة",
    titleEn: "Your Current Programming Background",
    descAr: "ما هو مستواك الحقيقي الآن لنعرف من أي نقطة نبدأ خارطة طريقك؟",
    descEn: "Where are you starting from so we customize the roadmap pace?",
    options: [
      {
        id: "zero",
        labelAr: "🐣 أبدأ من نقطة الصفر تماماً، لم أكتب سطراً برمجياً من قبل وأريد تعلماً مبسطاً",
        labelEn: "🐣 Complete beginner, starting from absolute zero with zero prior code",
        icon: "🐣",
        pathWeight: "frontend",
      },
      {
        id: "basics",
        labelAr: "📖 أعرف بعض المبادئ البسيطة (مثل المتغيرات والشروط)، لكن ينقصني التطبيق العملي",
        labelEn: "📖 Know basic syntax concepts, but need structured real-world practice",
        icon: "📖",
        pathWeight: "backend",
      },
      {
        id: "student",
        labelAr: "🎓 طالب حاسوب أو ذو خلفية تقنية، وأريد مساراً يربطني مباشرة بمقابلات العمل",
        labelEn: "🎓 Tech/CS student or switcher seeking direct career and interview readiness",
        icon: "🎓",
        pathWeight: "ai",
      },
    ],
  },
  {
    id: 4,
    titleAr: "الوقت الذي تستطيع تخصيصه أسبوعياً",
    titleEn: "Weekly Time Commitment",
    descAr: "الاستمرارية هي سر الاحتراف، كم ساعة يمكنك الالتزام بها أسبوعياً؟",
    descEn: "Consistency is key. How many hours per week can you dedicate?",
    options: [
      {
        id: "time_flexible",
        labelAr: "⏱️ 5 - 10 ساعات أسبوعياً (تعلم مرن وتدريجي بجانب دراستي أو عملي الحالي)",
        labelEn: "⏱️ 5 - 10 hours/week (flexible learning alongside school or job)",
        icon: "⏱️",
        pathWeight: "frontend",
      },
      {
        id: "time_committed",
        labelAr: "🚀 15 - 25 ساعة أسبوعياً (ملتزم بتعلم مكثف وسريع لأدخل سوق العمل سريعاً)",
        labelEn: "🚀 15 - 25 hours/week (steady and focused sprint towards hiring)",
        icon: "🚀",
        pathWeight: "backend",
      },
      {
        id: "time_full",
        labelAr: "🔥 أكثر من 30 ساعة أسبوعياً (تفرغ كامل وشغف كبير للإنجاز في أقصر وقت)",
        labelEn: "🔥 30+ hours/week (full-time immersion for rapid career launch)",
        icon: "🔥",
        pathWeight: "ai",
      },
    ],
  },
];

interface PathVerdict {
  titleAr: string;
  titleEn: string;
  badgeAr: string;
  badgeEn: string;
  icon: typeof Code2;
  accentColor: string;
  matchScore: number;
  whyAr: string;
  whyEn: string;
  stepsAr: string[];
  stepsEn: string[];
}

const VERDICTS: Record<"frontend" | "backend" | "ai", PathVerdict> = {
  frontend: {
    titleAr: "مسار تطوير واجهات الويب التفاعلية (Frontend Development)",
    titleEn: "Modern Frontend Web Development Track",
    badgeAr: "الأكثر طلباً وملاءمة لشغفك البصري",
    badgeEn: "Top Match for Visual & Interactive Creators",
    icon: Code2,
    accentColor: "from-cyan-500 to-emerald-500 text-cyan-400 border-cyan-500/30",
    matchScore: 96,
    whyAr:
      "تظهر إجاباتك حبك لرؤية الأثر المباشر لعملك، والتفاعل مع المستخدمين من خلال تصاميم حديثة وسريعة. مسار الـ Frontend هو المدخل الأسهل والأسرع لرؤية ثمار كودك مباشرة على الشاشة وبناء معرض مشاريع جذاب.",
    whyEn:
      "Your choices reflect a strong appreciation for visual impact, direct interactivity, and immediate creative feedback. Frontend is the most rewarding entry path into software engineering.",
    stepsAr: [
      "إتقان أساسيات الويب: HTML5 للهيكل، و CSS3 الحديث مع Flexbox/Grid للتنسيق.",
      "تعلم لغة JavaScript الحديثة (ES6+) لفهم التفاعل وديناميكية الصفحات.",
      "الانتقال لمكتبة React لبناء تطبيقات متطورة، ثم التجهيز لمقابلات العمل التجريبية عبر منصتنا.",
    ],
    stepsEn: [
      "Master modern HTML5 semantics and responsive CSS3 layouts.",
      "Learn modern JavaScript (ES6+) for interactive behavior and logic.",
      "Build projects with React & Next.js, then validate with AI mock interviews.",
    ],
  },
  backend: {
    titleAr: "مسار تطوير الأنظمة الخلفية وقواعد البيانات (Backend Engineering)",
    titleEn: "Robust Backend & API Engineering Track",
    badgeAr: "ملاءمة ممتازة لعقليتك المنطقية والتحليلية",
    badgeEn: "Top Match for Logical & Systems Thinkers",
    icon: Target,
    accentColor: "from-purple-500 to-indigo-500 text-purple-400 border-purple-500/30",
    matchScore: 94,
    whyAr:
      "شغفك يتجه نحو فهم ما وراء الكواليس: كيف تتحرك البيانات بأمان، وكيف تُبنى المحركات السريعة والخوارزميات. مهندس الـ Backend هو العقل المدبر لأي منصة ناجحة.",
    whyEn:
      "Your responses demonstrate strong logical curiosity for system architecture, data flow, and reliable server-side performance.",
    stepsAr: [
      "اختيار لغة خلفية قوية مثل JavaScript (Node.js) أو Python والتعمق في أساسياتها.",
      "فهم وتصميم واجهات برمجة التطبيقات (RESTful APIs) وهندسة قواعد البيانات (SQL / PostgreSQL).",
      "بناء أنظمة المصادقة (Auth & Security) والربط مع خدمات الكلاود والتجهيز للمقابلات التقنية.",
    ],
    stepsEn: [
      "Master a core backend language like Node.js or Python.",
      "Design clean RESTful APIs and model relational databases (PostgreSQL).",
      "Implement authentication & security, then practice technical system design rounds.",
    ],
  },
  ai: {
    titleAr: "مسار بايثون وهندسة الذكاء الاصطناعي (Python & AI Engineering)",
    titleEn: "Python & Applied AI Engineering Track",
    badgeAr: "المسار المستقبلي الأكثر ابتكاراً",
    badgeEn: "Future-Ready AI & Intelligent Systems",
    icon: Cpu,
    accentColor: "from-emerald-500 to-teal-500 text-emerald-400 border-emerald-500/30",
    matchScore: 98,
    whyAr:
      "شغفك موجه نحو الذكاء الاصطناعي، الأتمتة، واستغلال النماذج الذكية لحل مشاكل المستقبل. بايثون هي البوابة الذهبية الأسهل تعلماً والأقوى أثراً في هذا المجال.",
    whyEn:
      "You are driven by intelligent automation, generative models, and data-centric innovation. Python provides the smoothest and most powerful entry ramp.",
    stepsAr: [
      "إتقان أساسيات لغة بايثون وتراكيب البيانات المدمجة وحل التمارين التفاعلية.",
      "تعلم التعامل مع البيانات والمكتبات الأساسية ودمج نماذج الذكاء الاصطناعي عبر APIs.",
      "بناء أدوات ذكية ومساعدين تفاعليين، والتدرب على مقابلات الذكاء الاصطناعي في المنصة.",
    ],
    stepsEn: [
      "Master Python fundamentals, OOP, and data structures.",
      "Integrate state-of-the-art GenAI models via APIs and build custom agents.",
      "Deploy intelligent applications and practice technical interview rounds.",
    ],
  },
};

export default function CareerDiscoveryModal({
  open,
  onOpenChange,
}: CareerDiscoveryModalProps) {
  const { language } = useLanguage();
  const isAr = language === "ar";

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionOption>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [verdict, setVerdict] = useState<PathVerdict | null>(null);

  const handleSelectOption = (questionId: number, option: QuestionOption) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Calculate verdict
      setIsAnalyzing(true);
      setTimeout(() => {
        // Count weights
        const weights = { frontend: 0, backend: 0, ai: 0 };
        Object.values(answers).forEach((ans) => {
          if (ans.pathWeight === "frontend") weights.frontend += 2;
          else if (ans.pathWeight === "backend") weights.backend += 2;
          else if (ans.pathWeight === "ai") weights.ai += 2;
        });

        let highest: "frontend" | "backend" | "ai" = "frontend";
        if (weights.ai > weights.frontend && weights.ai > weights.backend) {
          highest = "ai";
        } else if (weights.backend > weights.frontend) {
          highest = "backend";
        }

        setVerdict(VERDICTS[highest]);
        setIsAnalyzing(false);
      }, 1200);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentStep(0);
    setVerdict(null);
    setIsAnalyzing(false);
  };

  const currentQ = QUESTIONS[currentStep];
  const isAnswered = currentQ ? !!answers[currentQ.id] : false;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-2xl md:max-w-3xl max-h-[90vh] flex flex-col gap-0 p-0 overflow-hidden bg-[#120D17] border border-cyan-500/40 text-foreground rounded-3xl shadow-2xl shadow-cyan-950/40">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-border/60 bg-[#16101E]/90 shrink-0">
          <DialogHeader>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400">
                  <Compass className="h-3.5 w-3.5" />
                  {isAr ? "المرشد الذكي لتحديد المسار" : "AI Career Orientation"}
                </span>
              </div>

              {!verdict && !isAnalyzing && (
                <span className="text-xs font-medium text-muted-foreground">
                  {isAr
                    ? `السؤال ${currentStep + 1} من ${QUESTIONS.length}`
                    : `Step ${currentStep + 1} of ${QUESTIONS.length}`}
                </span>
              )}
            </div>

            <DialogTitle className="text-xl sm:text-2xl font-bold text-foreground">
              {verdict
                ? isAr
                  ? "🎯 نتيجة تحليلك وتوصية المرشد الذكي"
                  : "🎯 Your Personalized Path Recommendation"
                : isAr
                ? "جلسة استكشافية ذكية لتحديد مسارك البرمجي 🧭"
                : "AI Guided Coding Path Discovery Session 🧭"}
            </DialogTitle>

            <DialogDescription className="text-muted-foreground text-xs sm:text-sm mt-1">
              {verdict
                ? isAr
                  ? "بناءً على إجاباتك وشغفك، إليك المسار الأنسب وخارطة طريقك للبدء فوراً:"
                  : "Based on your preferences and mindset, here is your customized career verdict:"
                : isAr
                ? "أجب عن هذه الأسئلة البسيطة ليحلل الذكاء الاصطناعي شخصيتك ويقترح لك المسار الأمثل:"
                : "Answer a few simple questions to uncover the exact tech track aligned with your goals:"}
            </DialogDescription>

            {/* Step progress bar */}
            {!verdict && !isAnalyzing && (
              <div className="mt-3 w-full bg-border/50 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-full transition-all duration-300"
                  style={{
                    width: `${((currentStep + 1) / QUESTIONS.length) * 100}%`,
                  }}
                />
              </div>
            )}
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto max-h-[calc(90vh-145px)] space-y-4">
          {isAnalyzing ? (
            /* Loading / Analyzing State */
            <div className="py-14 flex flex-col items-center justify-center text-center space-y-4">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 animate-pulse">
                <Bot className="h-10 w-10 text-cyan-400" />
                <Sparkles className="h-5 w-5 text-emerald-400 absolute top-2 right-2 animate-bounce" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  {isAr
                    ? "جاري تحليل إجاباتك وشغفك التقني..."
                    : "Analyzing your answers & mindset..."}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  {isAr
                    ? "يقوم المرشد الذكي بمطابقة تفضيلاتك مع متطلبات سوق العمل البرمجي الحالية."
                    : "Matching your profile with current industry demands and practical paths."}
                </p>
              </div>
            </div>
          ) : verdict ? (
            /* Verdict / Result State */
            <div className="space-y-5 animate-in fade-in-50 duration-300">
              {/* Main Recommendation Card */}
              <div
                className={`rounded-3xl border bg-card/85 p-6 shadow-xl ${verdict.accentColor}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                      <verdict.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
                        {isAr ? verdict.badgeAr : verdict.badgeEn}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground mt-1.5 leading-snug">
                        {isAr ? verdict.titleAr : verdict.titleEn}
                      </h3>
                    </div>
                  </div>

                  <div className="shrink-0 text-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 px-3.5">
                    <span className="text-xs font-medium text-emerald-400 block">
                      {isAr ? "التوافق" : "Match"}
                    </span>
                    <span className="text-xl font-extrabold text-emerald-300">
                      {verdict.matchScore}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border/50 text-sm leading-relaxed text-foreground/90">
                  <p>{isAr ? verdict.whyAr : verdict.whyEn}</p>
                </div>
              </div>

              {/* 3 Step Action Plan */}
              <div className="rounded-2xl border border-border/70 bg-card/60 p-5">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-cyan-400" />
                  {isAr
                    ? "خارطة طريقك الأولى للبدء فوراً:"
                    : "Your First Action Steps:"}
                </h4>

                <div className="space-y-3">
                  {(isAr ? verdict.stepsAr : verdict.stepsEn).map(
                    (step, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 text-xs sm:text-sm text-foreground/85"
                      >
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold mt-0.5">
                          {idx + 1}
                        </div>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Question Step */
            <div className="space-y-4">
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground">
                  {isAr ? currentQ.titleAr : currentQ.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {isAr ? currentQ.descAr : currentQ.descEn}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-3 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id]?.id === opt.id;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`text-start p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                        isSelected
                          ? "border-cyan-500 bg-cyan-500/15 text-foreground shadow-lg shadow-cyan-950/30"
                          : "border-border/60 bg-card/60 text-muted-foreground hover:border-cyan-500/40 hover:bg-card/90 hover:text-foreground"
                      }`}
                    >
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border mt-0.5 transition-colors ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-500 text-black"
                            : "border-border/80 bg-background/50 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </div>

                      <div className="flex-1 text-xs sm:text-sm font-medium leading-relaxed">
                        {isAr ? opt.labelAr : opt.labelEn}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-6 border-t border-border/60 bg-[#140E1B] shrink-0 flex items-center justify-between gap-3">
          {verdict ? (
            <>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-xl border-border/60 hover:bg-white/5 flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {isAr ? "إعادة الاستكشاف" : "Start Over"}
              </Button>

              <Button
                type="button"
                onClick={() => onOpenChange(false)}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium px-6 text-xs sm:text-sm"
              >
                {isAr ? "اعتماد هذا المسار والبدء 🚀" : "Adopt this Track 🚀"}
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                onClick={handlePrev}
                disabled={currentStep === 0 || isAnalyzing}
                className="rounded-xl text-xs sm:text-sm disabled:opacity-30"
              >
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                <span>{isAr ? "السابق" : "Previous"}</span>
              </Button>

              <Button
                type="button"
                onClick={handleNext}
                disabled={!isAnswered || isAnalyzing}
                className="rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold px-6 flex items-center gap-2 text-xs sm:text-sm disabled:opacity-40"
              >
                <span>
                  {currentStep === QUESTIONS.length - 1
                    ? isAr
                      ? "إظهار النتيجة والتوصية ✨"
                      : "Reveal Recommendation ✨"
                    : isAr
                    ? "السؤال التالي"
                    : "Next Step"}
                </span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" />
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
