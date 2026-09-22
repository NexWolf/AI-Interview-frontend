"use client";

import Link from "next/link";
import { Mic, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export const CtaFooter = () => {
  return (
    <footer
      id="footer"
      className="
        relative
        overflow-hidden
        border-t
        border-white/[0.06]
        bg-[#0B0710]
        text-white
      "
    >
      {/* =========================================
          Background Grid
      ========================================= */}
      <div
        aria-hidden
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
          Main Purple Glow
      ========================================= */}
      <motion.div
        aria-hidden
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          h-[420px]
          w-[700px]
          -translate-x-1/2
          -translate-y-1/3
          rounded-full
          bg-[#8B5CF6]/10
          blur-[140px]
        "
        animate={{
          opacity: [0.3, 0.55, 0.3],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =========================================
          Side Glow
      ========================================= */}
      <div
        aria-hidden
        className="
          pointer-events-none
          absolute
          bottom-0
          right-[10%]
          h-[300px]
          w-[300px]
          rounded-full
          bg-[#7D5BA6]/10
          blur-[120px]
        "
      />

      {/* =========================================
          Content
      ========================================= */}
      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[1400px]
          px-8
          py-20
          sm:px-12
          sm:py-24
          lg:px-16
          lg:py-28
          xl:px-20
        "
      >
        {/* =========================================
            CTA CARD
        ========================================= */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            margin: "-80px",
          }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            relative
            overflow-hidden
            rounded-3xl
            border
            border-[#7D5BA6]/25
            bg-[#141019]/80
            px-6
            py-14
            text-center
            backdrop-blur-xl
            shadow-[0_25px_80px_rgba(0,0,0,0.35)]
            sm:px-12
            sm:py-16
          "
        >
          {/* Card glow */}
          <div
            aria-hidden
            className="
              pointer-events-none
              absolute
              left-1/2
              top-0
              h-64
              w-[600px]
              -translate-x-1/2
              rounded-full
              bg-[#8B5CF6]/15
              blur-[120px]
            "
          />

          {/* Top shine */}
          <motion.div
            aria-hidden
            className="
              pointer-events-none
              absolute
              inset-x-0
              top-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-[#A36AF6]/70
              to-transparent
            "
            animate={{
              opacity: [0.35, 0.9, 0.35],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <div className="relative z-10">
            {/* Small label */}
            <div
              className="
                mx-auto
                mb-5
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-[#7D5BA6]/25
                bg-[#8B5CF6]/10
                px-4
                py-2
                text-xs
                font-medium
                text-[#C4B5FD]
              "
            >
              <Mic className="h-3.5 w-3.5 text-[#A36AF6]" />
              Ready when you are
            </div>

            {/* Heading */}
            <h2
              className="
                mx-auto
                max-w-3xl
                text-balance
                text-3xl
                font-bold
                leading-tight
                tracking-tight
                text-white
                sm:text-4xl
                lg:text-5xl
              "
            >
              Your next interview could be the one
            </h2>

            {/* Description */}
            <p
              className="
                relative
                mx-auto
                mt-5
                max-w-xl
                text-pretty
                text-sm
                leading-7
                text-white/40
                sm:text-base
              "
            >
              Start your first mock interview in under a minute.
              No credit card required.
            </p>

            {/* CTA */}
            <div className="relative mt-8 flex justify-center">
              <Button
                asChild
                size="lg"
                variant="default"
                className="
                  group
                  h-[48px]
                  px-6
                "
              >
                <Link href="/signup">
                  Start practicing free

                  <ArrowUpRight
                    className="
                      h-4
                      w-4
                      transition-transform
                      duration-300
                      group-hover:-translate-y-0.5
                      group-hover:translate-x-0.5
                    "
                  />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* =========================================
            FOOTER NAV
        ========================================= */}
        <div
          className="
            mt-16
            flex
            flex-col
            items-center
            justify-between
            gap-6
            border-t
            border-white/[0.06]
            pt-8
            sm:flex-row
          "
        >
          {/* Brand */}
          <Link
            href="/"
            className="
              group
              flex
              items-center
              gap-2
            "
          >
            <span
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                border
                border-[#7D5BA6]/30
                bg-[#8B5CF6]/10
                text-[#A36AF6]
                transition-all
                duration-300
                group-hover:border-[#A36AF6]/50
                group-hover:bg-[#8B5CF6]/15
              "
            >
              <Mic className="h-4 w-4" />
            </span>

            <span
              className="
                font-semibold
                tracking-tight
                text-white
              "
            >
              AI Interview
            </span>
          </Link>

          {/* Navigation */}
          <nav
            className="
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-6
              gap-y-2
              text-sm
              text-white/40
            "
          >
            <a
              href="#features"
              className="transition-colors hover:text-white"
            >
              Features
            </a>

            <a
              href="#benefits"
              className="transition-colors hover:text-white"
            >
              Benefits
            </a>

            <a
              href="#pricing"
              className="transition-colors hover:text-white"
            >
              Pricing
            </a>

            <a
              href="#faq"
              className="transition-colors hover:text-white"
            >
              FAQ
            </a>

            <a
              href="#"
              className="transition-colors hover:text-white"
            >
              Privacy
            </a>
          </nav>

          {/* Copyright */}
          <p
            className="
              text-sm
              text-white/30
            "
          >
            © {new Date().getFullYear()} AI Interview
          </p>
        </div>
      </section>
    </footer>
  );
};

export default CtaFooter;