"use client";

import { BarChart3, Settings2, Database } from "lucide-react";
import { motion } from "framer-motion";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";

const features = [
  {
    icon: BarChart3,
    title: "Insightful Analytics",
    description:
      "Lorem ipsum dolor sit amet consectetur. Integer tellus eu scelerisque nunc. Integer ac convallis tempus nibh ac tristique penatibus nulla a.",
  },
  {
    icon: Settings2,
    title: "Automate Tasks",
    description:
      "Lorem ipsum dolor sit amet consectetur. Integer tellus eu scelerisque nunc. Integer ac convallis tempus nibh ac tristique penatibus nulla a.",
  },
  {
    icon: Database,
    title: "Data-Backed Strategies",
    description:
      "Lorem ipsum dolor sit amet consectetur. Integer tellus eu scelerisque nunc. Integer ac convallis tempus nibh ac tristique penatibus nulla a.",
  },
];

export function Features() {
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
          [background-image:linear-gradient(rgba(163,106,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(163,106,246,0.18)_1px,transparent_1px)]
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
          bg-[#8B5CF6]/10
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
              text-[#A36AF6]
              sm:text-sm
            "
          >
            Features
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
            Everything You Need to Scale
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-white/40
              sm:text-base
            "
          >
            Powerful tools designed to help you make smarter decisions,
            automate repetitive work, and turn your data into action.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
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
                  colors={["#8B5CF6", "#FFFFFF"]}
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
                        rounded-[6px]
                        border
                        border-[#7D5BA6]/30
                        bg-[#1D1724]
                        shadow-[0_0_22px_rgba(139,92,246,0.12)]
                      "
                    >
                      <div
                        className="
                          absolute
                          inset-0
                          rounded-[6px]
                          bg-[#8B5CF6]/10
                          blur-md
                        "
                      />

                      <Icon
                        className="
                          relative
                          z-10
                          h-8
                          w-8
                          text-[#A36AF6]
                          drop-shadow-[0_0_8px_rgba(163,106,246,0.65)]
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
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-6
                        text-white/45
                      "
                    >
                      {feature.description}
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