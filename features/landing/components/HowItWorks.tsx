"use client";

import { motion } from "framer-motion";
import { BorderBeamPanel } from "@/components/ui/border-beam-panel";

const steps = [
  {
    number: "01",
    title: "Start Interview",
    description:
      "Begin a realistic AI-powered interview designed around the role you are applying for.",
  },
  {
    number: "02",
    title: "AI Analysis",
    description:
      "Our AI analyzes your answers, communication style, confidence, and overall performance.",
  },
  {
    number: "03",
    title: "Get Insights",
    description:
      "Receive clear feedback and actionable insights to help you perform better.",
  },
];

export function HowItWorks() {
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
          [background-image:linear-gradient(rgba(163,106,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(163,106,246,0.18)_1px,transparent_1px)]
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
          bg-[#8B5CF6]/10
          blur-[140px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* =====================================
            TITLE
        ===================================== */}

        <div className="mx-auto max-w-3xl text-center">

          {/* <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              text-[#A36AF6]
              sm:text-sm
            "
          >
            HOW IT WORKS
          </motion.span> */}

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
            Turn Data into{" "}
            <span className="text-[#A36AF6]">
              Decisions
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
              text-white/45
              sm:text-base
            "
          >
            A simple three-step process that transforms every interview into
            useful, actionable intelligence.
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
              border-[#7D5BA6]/25
              md:block
            "
          />

          {steps.map((step, index) => (
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
                colors={["#8B5CF6", "#FFFFFF"]}
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
                        border-[#7D5BA6]/30
                        bg-[#7D5BA6]/10
                        text-sm
                        font-semibold
                        text-[#A36AF6]
                        shadow-[0_0_20px_rgba(139,92,246,0.12)]
                      "
                    >
                      {step.number}
                    </span>

                    <div className="h-2 w-2 rounded-full bg-[#A36AF6] shadow-[0_0_12px_rgba(163,106,246,0.8)]" />
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
                      {step.title}
                    </h3>

                    <p
                      className="
                        mt-3
                        text-sm
                        leading-6
                        text-white/45
                      "
                    >
                      {step.description}
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