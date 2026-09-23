"use client";

import { BarChart3, Settings2, Database } from "lucide-react";
import { motion } from "framer-motion";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { useLanguage, TranslationKey } from "@/shared/context/LanguageContext";

interface FeatureItem {
  icon: typeof BarChart3;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

const featureList: FeatureItem[] = [
  {
    icon: BarChart3,
    titleKey: "features.f1Title",
    descKey: "features.f1Desc",
  },
  {
    icon: Settings2,
    titleKey: "features.f2Title",
    descKey: "features.f2Desc",
  },
  {
    icon: Database,
    titleKey: "features.f3Title",
    descKey: "features.f3Desc",
  },
];

export function Features() {
  const { t } = useLanguage();

  return (
    <section
      id="features"
      className="
        relative
        overflow-hidden
        bg-[#0B0710]
        px-10
        py-20
        text-white
        sm:px-14
        lg:px-20
        xl:px-24
        lg:py-28
      "
    >
      {/* Background Grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.08]
          [background-image:linear-gradient(rgba(159,132,217,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(159,132,217,0.18)_1px,transparent_1px)]
          [background-size:70px_70px]
          [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]
        "
      />

      {/* Background Glow */}
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-[500px]
          w-[500px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#6136BF]/15
          blur-[140px]
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1400px]
        "
      >
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center"
        >
          <span
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              text-[#9F84D9]
              sm:text-sm
            "
          >
            {t("features.badge")}
          </span>

          <h2
            className="
              mt-3
              text-3xl
              font-bold
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            {t("features.title")}
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-white/50
              sm:text-base
            "
          >
            {t("features.subtitle")}
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {featureList.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.titleKey}
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
              >
                <BorderBeamPanel
                  beams={2}
                  colors={["#6136BF", "#9F84D9"]}
                  thickness={1.5}
                  radius={18}
                  glow
                  idleSpeed={35}
                  hoverSpeed={180}
                  className="
                    min-h-[285px]
                    border-transparent
                    bg-[#141019]
                    p-0
                    shadow-[0_15px_45px_rgba(0,0,0,0.25)]
                  "
                >
                  <div className="flex min-h-[285px] flex-col p-8">
                    {/* Icon */}
                    <div
                      className="
                        relative
                        mb-7
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-[8px]
                        border
                        border-[#6136BF]/30
                        bg-[#1A1424]
                        shadow-[0_0_22px_rgba(97,54,191,0.2)]
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-0
                          rounded-[8px]
                          bg-[#6136BF]/20
                          blur-md
                        "
                      />

                      <Icon
                        className="
                          relative
                          z-10
                          h-8
                          w-8
                          text-[#9F84D9]
                          drop-shadow-[0_0_8px_rgba(159,132,217,0.7)]
                        "
                        strokeWidth={1.8}
                      />
                    </div>

                    {/* Title */}
                    <h3
                      className="
                        text-xl
                        font-semibold
                        tracking-tight
                        text-white
                      "
                    >
                      {t(feature.titleKey)}
                    </h3>

                    {/* Description */}
                    <p
                      className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-6
                        text-white/50
                      "
                    >
                      {t(feature.descKey)}
                    </p>
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

export default Features;