"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { Button } from "@/components/ui/button";
import { useLanguage, TranslationKey } from "@/shared/context/LanguageContext";

type BillingCycle = "monthly" | "yearly";

interface PlanItem {
  id: string;
  nameKey: TranslationKey;
  monthly: number;
  yearly: number;
  descKey: TranslationKey;
  featureKeys: TranslationKey[];
  featured: boolean;
}

const plans: PlanItem[] = [
  {
    id: "starter",
    nameKey: "pricing.starterName",
    monthly: 19,
    yearly: 190,
    descKey: "pricing.starterDesc",
    featureKeys: [
      "pricing.starterF1",
      "pricing.starterF2",
      "pricing.starterF3",
      "pricing.starterF4",
    ],
    featured: false,
  },
  {
    id: "pro",
    nameKey: "pricing.proName",
    monthly: 49,
    yearly: 490,
    descKey: "pricing.proDesc",
    featureKeys: [
      "pricing.proF1",
      "pricing.proF2",
      "pricing.proF3",
      "pricing.proF4",
      "pricing.proF5",
      "pricing.proF6",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    nameKey: "pricing.entName",
    monthly: 99,
    yearly: 990,
    descKey: "pricing.entDesc",
    featureKeys: [
      "pricing.entF1",
      "pricing.entF2",
      "pricing.entF3",
      "pricing.entF4",
      "pricing.entF5",
    ],
    featured: false,
  },
];

export default function Pricing() {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] =
    useState<BillingCycle>("monthly");

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
            <span className="text-[#9F84D9]">
              {t("pricing.title2")}
            </span>
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
              text-white/45
              sm:text-base
            "
          >
            {t("pricing.subtitle")}
          </motion.p>
        </div>

        {/* =========================================
            BILLING TOGGLE
        ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="
            mt-10
            flex
            items-center
            justify-center
            gap-3
          "
        >
          <div
            className="
              flex
              items-center
              rounded-full
              border
              border-white/10
              bg-[#141019]
              p-1
            "
          >
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                transition-all
                ${
                  billingCycle === "monthly"
                    ? "bg-[#6136BF] text-white"
                    : "text-white/40 hover:text-white"
                }
              `}
            >
              {t("pricing.monthly")}
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`
                rounded-full
                px-4
                py-2
                text-sm
                transition-all
                ${
                  billingCycle === "yearly"
                    ? "bg-[#6136BF] text-white"
                    : "text-white/40 hover:text-white"
                }
              `}
            >
              {t("pricing.yearly")}
            </button>
          </div>

          <span
            className="
              rounded-full
              border
              border-[#6136BF]/30
              bg-[#6136BF]/15
              px-3
              py-1
              text-xs
              font-semibold
              text-[#9F84D9]
            "
          >
            {t("pricing.save")}
          </span>
        </motion.div>

        {/* =========================================
            PRICING CARDS
        ========================================= */}
        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">

          {plans.map((plan, index) => {
            const price =
              billingCycle === "monthly"
                ? plan.monthly
                : plan.yearly;

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
                  thickness={plan.featured ? 2 : 1.5}
                  radius={20}
                  glow
                  idleSpeed={32}
                  hoverSpeed={180}
                  className="
                    h-full
                    min-h-[520px]
                    border-transparent
                    bg-[#141019]
                    p-0
                  "
                >
                  <div className="flex h-full min-h-[520px] flex-col p-8">

                    {/* Popular */}
                    {plan.featured && (
                      <div
                        className="
                          mb-5
                          inline-flex
                          w-fit
                          rounded-full
                          border
                          border-[#6136BF]/40
                          bg-[#6136BF]/20
                          px-3
                          py-1
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-[#9F84D9]
                        "
                      >
                        {t("pricing.popular")}
                      </div>
                    )}

                    {/* Plan name */}
                    <h3 className="text-2xl font-semibold text-white">
                      {t(plan.nameKey)}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      {t(plan.descKey)}
                    </p>

                    {/* Price */}
                    <div className="mt-8 flex items-baseline">

                      <span className="text-5xl font-bold tracking-tight text-white">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.id}-${billingCycle}`}
                            initial={{
                              opacity: 0,
                              y: 8,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: -8,
                            }}
                            transition={{
                              duration: 0.25,
                            }}
                          >
                            ${price}
                          </motion.span>
                        </AnimatePresence>
                      </span>

                      <span className="ml-2 text-sm text-white/35">
                        {billingCycle === "monthly" ? t("pricing.perMo") : t("pricing.perYr")}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="mt-8 space-y-4">
                      {plan.featureKeys.map((fKey) => (
                        <li
                          key={fKey}
                          className="
                            flex
                            items-center
                            gap-3
                            text-sm
                            text-white/75
                          "
                        >
                          <Check className="h-4 w-4 shrink-0 text-[#9F84D9]" />

                          <span>{t(fKey)}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <div className="mt-auto pt-10">
                      <Button
                        asChild
                        size="lg"
                        className={`w-full rounded-full transition-all duration-300 ${
                          plan.featured
                            ? "border border-[#6136BF] bg-[#6136BF] text-white shadow-xl shadow-[#6136BF]/25 hover:bg-[#724EBF] hover:shadow-[#724EBF]/35"
                            : "border border-[#6136BF]/40 bg-white/[0.04] text-white hover:bg-[#6136BF]/20 hover:border-[#6136BF]"
                        }`}
                      >
                        <a href="/auth">
                          {t("pricing.choose")}
                        </a>
                      </Button>
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