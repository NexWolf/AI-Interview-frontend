"use client";

import { motion } from "framer-motion";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { useLanguage, TranslationKey } from "@/shared/context/LanguageContext";

interface StepItem {
  number: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}

const stepList: StepItem[] = [
  {
    number: "01",
    titleKey: "how.s1Title",
    descKey: "how.s1Desc",
  },
  {
    number: "02",
    titleKey: "how.s2Title",
    descKey: "how.s2Desc",
  },
  {
    number: "03",
    titleKey: "how.s3Title",
    descKey: "how.s3Desc",
  },
];

export function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section
      id="how-it-works"
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
      {/* Background Grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.10]
          [background-image:linear-gradient(rgba(159,132,217,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(159,132,217,0.18)_1px,transparent_1px)]
          [background-size:70px_70px]
          [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_80%)]
        "
      />

      {/* Purple Glow */}
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

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================
            TITLE
        ===================================== */}

        <div className="mx-auto max-w-3xl text-center">

          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="
              mt-4
              text-3xl
              font-bold
              leading-tight
              tracking-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            {t("how.title1")}{" "}
            <span className="text-[#9F84D9]">
              {t("how.title2")}
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="
              mx-auto
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-white/50
              sm:text-base
            "
          >
            {t("how.subtitle")}
          </motion.p>

        </div>

        {/* =====================================
            STEPS
        ===================================== */}

        <div className="relative mt-16 grid gap-6 md:grid-cols-3 md:gap-5 lg:mt-20">

          {/* Connecting Line */}
          <div
            className="
              pointer-events-none
              absolute
              left-[16%]
              right-[16%]
              top-1/2
              hidden
              -translate-y-1/2
              border-t
              border-dashed
              border-[#6136BF]/30
              md:block
            "
          />

          {stepList.map((step, index) => (
            <motion.div
              key={step.number}
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
                amount: 0.25,
              }}
              transition={{
                duration: 0.65,
                delay: index * 0.12,
              }}
              className="relative z-10"
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
                  min-h-[280px]
                  border-[#312442]
                  bg-[#141019]
                  p-0
                  shadow-[0_15px_45px_rgba(0,0,0,0.25)]
                "
              >
                <div className="flex h-full min-h-[280px] flex-col p-7 sm:p-8">

                  {/* Number */}
                  <div className="flex items-center justify-between">

                    <span
                      className="
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[#6136BF]/40
                        bg-[#6136BF]/15
                        text-sm
                        font-semibold
                        text-[#9F84D9]
                        shadow-[0_0_20px_rgba(97,54,191,0.2)]
                      "
                    >
                      {step.number}
                    </span>

                    <div className="h-2 w-2 rounded-full bg-[#724EBF] shadow-[0_0_12px_rgba(114,78,191,0.9)]" />
                  </div>

                  {/* Content */}
                  <div className="mt-auto pt-12">

                    <h3
                      className="
                        text-xl
                        font-semibold
                        tracking-tight
                        text-white
                      "
                    >
                      {t(step.titleKey)}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-6
                        text-white/45
                      "
                    >
                      {t(step.descKey)}
                    </p>

                  </div>

                </div>
              </BorderBeamPanel>
            </motion.div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default HowItWorks;