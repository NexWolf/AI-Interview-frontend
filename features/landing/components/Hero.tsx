"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

import { SplineScene } from "@/components/ui/spline";
import { Button } from "@/components/ui/button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { Spotlight } from "@/components/ui/spotlight";

export function Hero() {
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
          [background-image:linear-gradient(rgba(163,106,246,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(163,106,246,0.18)_1px,transparent_1px)]
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
          bg-[#7D5BA6]/10
          blur-[120px]
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
            style={
              {
                "--base-color": "#ffffff",
                "--base-gradient-color": "#A36AF6",
              } as React.CSSProperties
            }
          >
            Intelligent Insights for Agile Enterprises
          </TextShimmer>

          {/* Description */}
          <p
            className="
              mt-5
              max-w-lg
              text-sm
              leading-6
              text-white/45
              sm:text-base
              sm:leading-7
              lg:text-lg
            "
          >
            Lorem ipsum dolor sit amet consectetur. Integer tellus eu
            scelerisque nunc. Integer ac convallis tempus nibh ac tristique
            penatibus nulla a.
          </p>

          {/* =========================================
              Button + Companies
          ========================================= */}
          <div className="mt-7 flex flex-wrap items-center gap-5">

            {/* Start Now */}
            <Button
              asChild
              size="lg"
              variant="default"
            >
              <Link href="/signup">
                Start Now
                <ArrowUpRight />
              </Link>
            </Button>

            {/* Companies */}
            <div className="flex items-center gap-3">

              <div className="flex -space-x-2">

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

              <span className="text-xs font-medium text-white/55">
                1000+ Satisfied Companies
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
              bg-[#8B5CF6]/10
              blur-[100px]
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