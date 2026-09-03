"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const stats = [
  {
    value: "92%",
    label: "Interview Confidence",
  },
  {
    value: "87%",
    label: "Response Quality",
  },
  {
    value: "94%",
    label: "Overall Performance",
  },
];

export function Benefits() {
  return (
    <section
      id="benefits"
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
          opacity-[0.08]
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
          right-[15%]
          top-1/2
          h-[500px]
          w-[500px]
          -translate-y-1/2
          rounded-full
          bg-[#8B5CF6]/10
          blur-[140px]
        "
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Heading */}
        <div className="max-w-2xl">
          <span
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.25em]
              text-[#A36AF6]
            "
          >
            Benefits
          </span>

          <h2
            className="
              mt-4
              text-3xl
              font-bold
              leading-tight
              text-white
              sm:text-4xl
              lg:text-5xl
            "
          >
            Turn Every Interview Into
            <span className="block text-[#A36AF6]">
              Actionable Insights
            </span>
          </h2>

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-white/40
              sm:text-base
            "
          >
            Understand performance, identify strengths, and discover the
            areas that matter most with intelligent interview analytics.
          </p>
        </div>

        {/* Main Visual */}
        <div
          className="
            relative
            mt-16
            min-h-[620px]
            overflow-hidden
            rounded-[28px]
            border
            border-[#312442]
            bg-[#100B16]
            shadow-[0_30px_100px_rgba(0,0,0,0.45)]
          "
        >
          {/* Soft glass glow */}
          <div
            className="
              pointer-events-none
              absolute
              right-[15%]
              top-[25%]
              h-[280px]
              w-[280px]
              rounded-full
              bg-[#8B5CF6]/10
              blur-[100px]
            "
          />

          {/* Dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
            className="
              absolute
              right-[4%]
              top-[8%]
              z-20
              w-[52%]
              min-w-[360px]
              rounded-[24px]
              border
              border-white/10
              bg-white/[0.035]
              p-6
              backdrop-blur-xl
              shadow-[0_20px_70px_rgba(0,0,0,0.35)]
            "
          >
            {/* Top */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-white/35">
                  AI Interview Performance
                </p>

                <h3 className="mt-1 text-lg font-semibold text-white">
                  Candidate Insights
                </h3>
              </div>

              <span className="rounded-full border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-1 text-xs text-[#A36AF6]">
                Live
              </span>
            </div>

            {/* Score */}
            <div className="mt-7 flex items-center gap-7">
              <div className="relative flex h-32 w-32 items-center justify-center">
                <svg
                  className="absolute inset-0 h-full w-full -rotate-90"
                  viewBox="0 0 120 120"
                >
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="8"
                  />

                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#8B5CF6"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    whileInView={{ pathLength: 0.92 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.4,
                      ease: "easeOut",
                    }}
                  />
                </svg>

                <div className="text-center">
                  <div className="text-3xl font-bold text-white">
                    92
                  </div>

                  <div className="text-xs text-white/35">
                    / 100
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <p className="text-xs text-white/35">
                  Overall score
                </p>

                <p className="mt-2 text-2xl font-semibold text-white">
                  Excellent
                </p>

                <p className="mt-2 text-xs leading-5 text-white/35">
                  Strong performance across communication and technical
                  responses.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-7 grid grid-cols-3 gap-3">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -4 }}
                  className="
                    rounded-2xl
                    border
                    border-white/[0.07]
                    bg-white/[0.03]
                    p-4
                  "
                >
                  <div className="text-lg font-semibold text-[#A36AF6]">
                    {stat.value}
                  </div>

                  <div className="mt-1 text-[11px] leading-4 text-white/35">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Chart */}
            <div className="mt-7 rounded-2xl border border-white/[0.07] bg-black/20 p-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs text-white/35">
                  Performance Analytics
                </span>

                <span className="text-xs text-[#A36AF6]">
                  +18.4%
                </span>
              </div>

              <div className="flex h-32 items-end gap-3">
                {[42, 65, 50, 80, 60, 92, 72, 100, 76].map(
                  (height, index) => (
                    <motion.div
                      key={index}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.06,
                        ease: "easeOut",
                      }}
                      className="
                        flex-1
                        rounded-t-md
                        bg-gradient-to-t
                        from-[#312442]
                        to-[#A36AF6]
                        opacity-80
                      "
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>

          {/* Robot Image */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.9,
              delay: 0.2,
            }}
            className="
              absolute
              bottom-0
              left-[3%]
              z-10
              h-[520px]
              w-[48%]
              min-w-[320px]
            "
          >
            <Image
              src="/images/benefits-robot.png"
              alt="AI Interview Assistant"
              fill
              priority
              className="
                object-contain
                object-bottom
              "
            />
          </motion.div>

          {/* Floating label */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="
              absolute
              bottom-[12%]
              left-[46%]
              z-30
              rounded-full
              border
              border-[#8B5CF6]/25
              bg-[#0B0710]/80
              px-4
              py-2
              text-xs
              text-white/70
              backdrop-blur-md
            "
          >
            AI-powered insights
          </motion.div>
        </div>
      </div>
    </section>
  );
}