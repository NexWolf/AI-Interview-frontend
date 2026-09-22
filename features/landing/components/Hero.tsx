"use client";

import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Spotlight } from "@/components/ui/spotlight";
import { useLanguage } from "@/shared/context/LanguageContext";

const SplineScene = dynamic(
  () => import("@/components/ui/spline").then((mod) => mod.SplineScene),
  {
    ssr: false,
    loading: () => (
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6136BF] border-t-transparent shadow-[0_0_20px_rgba(97,54,191,0.5)]" />
          <span className="text-xs font-medium tracking-wider text-white/40 uppercase">Loading 3D Experience</span>
        </div>
      </div>
    ),
  }
);

export function Hero() {
  const { t, direction } = useLanguage();
  return (
    <section className="relative h-[100svh] overflow-hidden bg-black">

      {/* =========================================
          Spotlight
      ========================================= */}
      <Spotlight />

      {/* =========================================
          Background Grid
      ========================================= */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          opacity-[0.18]
          [background-image:linear-gradient(rgba(159,132,217,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(159,132,217,0.18)_1px,transparent_1px)]
          [background-size:70px_70px]
          [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_80%)]
        "
      />

      {/* =========================================
          Background Glow
      ========================================= */}
      <div
        className="
          pointer-events-none
          absolute
          right-[10%]
          top-1/2
          z-[1]
          h-[500px]
          w-[500px]
          -translate-y-1/2
          rounded-full
          bg-[#6136BF]/15
          blur-[130px]
        "
      />

      {/* =========================================
          Hero Content
      ========================================= */}
      <div
        className="
          relative
          z-10
          mx-auto
          grid
          h-full
          w-full
          max-w-[1400px]
          grid-cols-1
          items-center
          gap-10
          px-8
          py-16
          sm:px-12
          sm:py-20
          lg:grid-cols-2
          lg:px-16
          lg:py-12
          xl:px-20
        "
      >

        {/* =========================================
            Left Content
        ========================================= */}
        <div className="relative z-10">

          {/* Heading */}
          <TextShimmer
            as="h1"
            duration={3}
            spread={3}
            className="
              max-w-xl
              text-4xl
              font-bold
              leading-[1.08]
              tracking-tight
              sm:text-5xl
              lg:text-6xl
            "

          >
            {t("hero.title")}
          </TextShimmer>

          {/* Description */}
          <p
            className="
              mt-5
              max-w-lg
              text-sm
              leading-6
              text-white/60
              sm:text-base
              sm:leading-7
              lg:text-lg
            "
          >
            {t("hero.desc")}
          </p>

          {/* =========================================
              Button + Companies
          ========================================= */}
          <div className="mt-7 flex flex-wrap items-center gap-5">

            {/* Start Now */}
            <Button
              asChild
              size="lg"
              className="rounded-full border border-[#6136BF] bg-[#6136BF] px-8 text-white shadow-xl shadow-[#6136BF]/30 transition-all duration-300 hover:bg-[#724EBF] hover:shadow-[#724EBF]/40"
            >
              <Link href="/auth" className="flex items-center gap-2">
                <span>{t("hero.cta")}</span>
                <ArrowUpRight className={direction === "rtl" ? "rotate-[-90deg] transition-transform" : "transition-transform"} />
              </Link>
            </Button>

            {/* Companies */}
            <div className="flex items-center gap-3">

              <div className="flex -space-x-2 rtl:space-x-reverse">

                <div
                  className="
                    relative
                    h-7
                    w-7
                    overflow-hidden
                    rounded-full
                    border-2
                    border-black
                  "
                >
                  <Image
                    src="/images/mohammed.jpg"
                    alt="Customer"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>

                <div
                  className="
                    relative
                    h-7
                    w-7
                    overflow-hidden
                    rounded-full
                    border-2
                    border-black
                  "
                >
                  <Image
                    src="/images/ahmed.jpg"
                    alt="Customer"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>

                <div
                  className="
                    relative
                    h-7
                    w-7
                    overflow-hidden
                    rounded-full
                    border-2
                    border-black
                  "
                >
                  <Image
                    src="/images/adham.jpg"
                    alt="Customer"
                    fill
                    sizes="28px"
                    className="object-cover"
                  />
                </div>

              </div>

              <span className="text-xs font-medium text-white/70">
                {t("hero.stats")}
              </span>

            </div>
          </div>
        </div>

        {/* =========================================
            Right - Spline
        ========================================= */}
        <div
          className="
            relative
            flex
            h-[380px]
            w-full
            items-center
            justify-center
            sm:h-[430px]
            lg:h-[500px]
          "
        >

          {/* Spline Glow */}
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[320px]
              w-[320px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#6136BF]/20
              blur-[110px]
              sm:h-[360px]
              sm:w-[360px]
              lg:h-[400px]
              lg:w-[400px]
            "
          />

          {/* Spline */}
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="
              relative
              z-10
              h-full
              w-full
            "
          />

        </div>

      </div>
    </section>
  );
}