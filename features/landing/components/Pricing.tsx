"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Zap } from "lucide-react";

import { BorderBeamPanel } from "@/components/ui/border-beam-panel";
import { Button } from "@/components/ui/button";

type BillingCycle = "monthly" | "yearly";

const plans = [
  {
    name: "Starter",
    monthly: 19,
    yearly: 190,
    description: "Perfect for individuals and small projects.",
    features: [
      "5 Projects",
      "Basic Analytics",
      "24/7 Support",
      "10GB Storage",
    ],
    featured: false,
  },
  {
    name: "Pro",
    monthly: 49,
    yearly: 490,
    description: "For growing teams and businesses.",
    features: [
      "Unlimited Projects",
      "Advanced Analytics",
      "Priority Support",
      "100GB Storage",
      "Team Collaboration",
    ],
    featured: true,
  },
  {
    name: "Enterprise",
    monthly: 99,
    yearly: 990,
    description: "For large organizations with custom needs.",
    features: [
      "Everything in Pro",
      "Dedicated Account Manager",
      "Custom Integrations",
      "SLA & Security Audits",
    ],
    featured: false,
  },
];

export default function Pricing() {
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
          bg-[#8B5CF6]/10
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
              border-[#7D5BA6]/30
              bg-[#7D5BA6]/10
              px-4
              py-2
              text-sm
              font-medium
              text-white/80
            "
          >
            <Zap className="h-4 w-4 text-[#A36AF6]" />

            Flexible & Transparent Pricing
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
            Find the Perfect{" "}
            <span className="text-[#A36AF6]">
              Plan
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
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-white/40
              sm:text-base
            "
          >
            Choose the plan that fits your needs and get
            everything you need to make smarter decisions.
          </motion.p>
        </div>

        {/* =========================================
            BILLING TOGGLE
        ========================================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.6,
            delay: 0.3,
          }}
          className="
            mt-10
            flex
            flex-wrap
            items-center
            justify-center
            gap-3
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
                  ? "bg-[#312442] text-white"
                  : "text-white/40 hover:text-white"
              }
            `}
          >
            Monthly
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
                  ? "bg-[#312442] text-white"
                  : "text-white/40 hover:text-white"
              }
            `}
          >
            Yearly
          </button>

          <span
            className="
              rounded-full
              border
              border-[#8B5CF6]/30
              bg-[#8B5CF6]/10
              px-3
              py-1
              text-xs
              font-semibold
              text-[#A36AF6]
            "
          >
            Save 20%
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
                key={plan.name}
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
                      ? ["#8B5CF6", "#FFFFFF"]
                      : ["#7D5BA6", "#A36AF6"]
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
                          border-[#8B5CF6]/30
                          bg-[#8B5CF6]/10
                          px-3
                          py-1
                          text-[11px]
                          font-semibold
                          uppercase
                          tracking-[0.15em]
                          text-[#A36AF6]
                        "
                      >
                        Most Popular
                      </div>
                    )}

                    {/* Plan name */}
                    <h3 className="text-2xl font-semibold text-white">
                      {plan.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/40">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mt-8 flex items-baseline">

                      <span className="text-5xl font-bold tracking-tight text-white">
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={`${plan.name}-${billingCycle}`}
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
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </div>

                    {/* Features */}
                    <ul className="mt-8 space-y-4">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="
                            flex
                            items-center
                            gap-3
                            text-sm
                            text-white/75
                          "
                        >
                          <Check className="h-4 w-4 shrink-0 text-[#A36AF6]" />

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Button */}
                    <div className="mt-auto pt-10">
                      <Button
                        asChild
                        size="lg"
                        variant={
                          plan.featured
                            ? "default"
                            : "outline"
                        }
                        className="w-full"
                      >
                        <a href="/signup">
                          Choose Plan
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