"use client";

import { motion } from "framer-motion";
import {
  Check,
  Zap,
  GraduationCap,
  Building2,
  School,
  ArrowRight,
  ArrowUpRight,
  Lock,
} from "lucide-react";
import Link from "next/link";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { Button } from "@/components/ui/button";
import { useLanguage, TranslationKey } from "@/shared/context/LanguageContext";

interface PortalPlanItem {
  id: "student" | "company" | "university";
  nameKey: TranslationKey;
  descKey: TranslationKey;
  badgeKey: TranslationKey;
  btnKey: TranslationKey;
  featureKeys: TranslationKey[];
  featured: boolean;
  type: "student" | "company" | "university";
  icon: typeof GraduationCap;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  badgeStyle: string;
}

const plans: PortalPlanItem[] = [
  {
    id: "student",
    type: "student",
    nameKey: "pricing.studentName",
    descKey: "pricing.studentDesc",
    badgeKey: "pricing.studentBadge",
    btnKey: "pricing.studentBtn",
    featureKeys: [
      "pricing.studentF1",
      "pricing.studentF2",
      "pricing.studentF3",
      "pricing.studentF4",
    ],
    featured: false,
    icon: GraduationCap,
    iconBg: "bg-[#7D5BA6]/20",
    iconBorder: "border-[#7D5BA6]/40",
    iconColor: "text-[#C4B5FD]",
    badgeStyle:
      "border-[#7D5BA6]/30 bg-[#7D5BA6]/15 text-[#C4B5FD]",
  },
  {
    id: "company",
    type: "company",
    nameKey: "pricing.companyName",
    descKey: "pricing.companyDesc",
    badgeKey: "pricing.companyBadge",
    btnKey: "pricing.companyBtn",
    featureKeys: [
      "pricing.companyF1",
      "pricing.companyF2",
      "pricing.companyF3",
      "pricing.companyF4",
    ],
    featured: true,
    icon: Building2,
    iconBg: "bg-[#6136BF]/30",
    iconBorder: "border-[#6136BF]/60",
    iconColor: "text-[#FAFFFD]",
    badgeStyle:
      "border-[#6136BF]/50 bg-[#6136BF]/30 text-white shadow-sm shadow-[#6136BF]/30",
  },
  {
    id: "university",
    type: "university",
    nameKey: "pricing.universityName",
    descKey: "pricing.universityDesc",
    badgeKey: "pricing.universityBadge",
    btnKey: "pricing.universityBtn",
    featureKeys: [
      "pricing.universityF1",
      "pricing.universityF2",
      "pricing.universityF3",
      "pricing.universityF4",
    ],
    featured: false,
    icon: School,
    iconBg: "bg-white/[0.05]",
    iconBorder: "border-white/15",
    iconColor: "text-white/60",
    badgeStyle:
      "border-white/10 bg-white/[0.06] text-white/50",
  },
];

export default function Pricing() {
  const { t } = useLanguage();
  const companyUrl =
    process.env.NEXT_PUBLIC_COMPANY_URL || "http://localhost:3002";

  return (
    <section
      id="pricing"
      className="
        relative
        overflow-hidden
        bg-[#0B0710]
        px-6
        py-24
        sm:px-8
        lg:px-12
        lg:py-32
      "
    >
      {/* =========================================
          BACKGROUND GRID
      ========================================= */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.08]
          [background-image:linear-gradient(rgba(163,106,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(163,106,246,0.18)_1px,transparent_1px)]
          [background-size:70px_70px]
          [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_80%)]
        "
      />

      {/* =========================================
          AURORA GLOW
      ========================================= */}
      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          left-[5%]
          top-[15%]
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#7D5BA6]/10
          blur-[120px]
        "
      />

      <motion.div
        animate={{
          x: [0, -70, 0],
          y: [0, 40, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          pointer-events-none
          absolute
          bottom-[5%]
          right-[5%]
          h-[500px]
          w-[500px]
          rounded-full
          bg-[#6136BF]/15
          blur-[130px]
        "
      />

      {/* =========================================
          CONTENT
      ========================================= */}
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#6136BF]/30
              bg-[#6136BF]/15
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
            "
          >
            <Zap className="h-4 w-4 text-[#9F84D9]" />
            {t("pricing.badge")}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: 0.1,
            }}
            className="
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            {t("pricing.title1")}{" "}
            <span className="text-[#9F84D9]">{t("pricing.title2")}</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-white/55
              sm:text-base
            "
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        {/* =========================================
            PORTAL CARDS (STUDENT, COMPANY, UNIVERSITY)
        ========================================= */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => {
            return (
              <motion.div
                key={plan.id}
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.65,
                  delay: index * 0.12,
                }}
                whileHover={{
                  y: -8,
                }}
                className={plan.featured ? "lg:-translate-y-4" : ""}
              >
                <BorderBeamPanel
                  beams={2}
                  colors={
                    plan.featured
                      ? ["#6136BF", "#FFFFFF"]
                      : ["#724EBF", "#9F84D9"]
                  }
                  thickness={plan.featured ? 2.5 : 1.5}
                  radius={20}
                  glow
                  idleSpeed={plan.featured ? 24 : 36}
                  hoverSpeed={180}
                  className="
                    h-full
                    min-h-[500px]
                    border-transparent
                    bg-[#141019]
                    p-0
                  "
                >
                  <div className="flex h-full min-h-[500px] flex-col p-8">
                    {/* Top Row: Icon + Badge */}
                    <div className="mb-6 flex items-center justify-between">
                      <div
                        className={`flex h-13 w-13 items-center justify-center rounded-2xl border ${plan.iconBg} ${plan.iconBorder}`}
                      >
                        <plan.icon className={`h-6 w-6 ${plan.iconColor}`} />
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${plan.badgeStyle}`}
                      >
                        {plan.type === "university" && (
                          <Lock className="h-3 w-3 opacity-60" />
                        )}
                        {t(plan.badgeKey)}
                      </span>
                    </div>

                    {/* Plan Name */}
                    <h3 className="text-2xl font-bold tracking-tight text-white">
                      {t(plan.nameKey)}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-sm leading-6 text-white/50 min-h-[48px]">
                      {t(plan.descKey)}
                    </p>

                    {/* Divider */}
                    <div className="my-6 h-px w-full bg-gradient-to-r from-white/15 via-[#6136BF]/30 to-transparent" />

                    {/* Features List */}
                    <ul className="space-y-3.5">
                      {plan.featureKeys.map((fKey) => (
                        <li
                          key={fKey}
                          className="flex items-start gap-3 text-sm text-white/80"
                        >
                          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#6136BF]/25 text-[#9F84D9]">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                          <span className="leading-5">{t(fKey)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Action Button */}
                    <div className="mt-auto pt-8">
                      {plan.type === "student" && (
                        <Button
                          asChild
                          size="lg"
                          className="
                            group
                            w-full
                            rounded-full
                            border
                            border-[#6136BF]/40
                            bg-white/[0.05]
                            text-white
                            transition-all
                            duration-300
                            hover:border-[#6136BF]
                            hover:bg-[#6136BF]/25
                            hover:shadow-lg
                            hover:shadow-[#6136BF]/20
                          "
                        >
                          <Link
                            href="/dashboard"
                            className="flex items-center justify-center gap-2"
                          >
                            <span>{t(plan.btnKey)}</span>
                            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                          </Link>
                        </Button>
                      )}

                      {plan.type === "company" && (
                        <Button
                          asChild
                          size="lg"
                          className="
                            group
                            w-full
                            rounded-full
                            border
                            border-[#6136BF]
                            bg-[#6136BF]
                            text-white
                            shadow-xl
                            shadow-[#6136BF]/30
                            transition-all
                            duration-300
                            hover:bg-[#724EBF]
                            hover:shadow-[#724EBF]/45
                          "
                        >
                          <a
                            href={companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2"
                          >
                            <span>{t(plan.btnKey)}</span>
                            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:rotate-90" />
                          </a>
                        </Button>
                      )}

                      {plan.type === "university" && (
                        <Button
                          disabled
                          size="lg"
                          className="
                            w-full
                            cursor-not-allowed
                            rounded-full
                            border
                            border-white/10
                            bg-white/[0.04]
                            text-white/40
                            transition-all
                            hover:bg-white/[0.04]
                          "
                        >
                          <span>{t(plan.btnKey)}</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </BorderBeamPanel>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}