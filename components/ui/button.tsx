"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  `
    group/button
    relative
    inline-flex
    shrink-0
    items-center
    justify-center
    whitespace-nowrap
    overflow-hidden
    select-none
    cursor-pointer
    isolate

    font-medium
    leading-none
    text-white

    rounded-full

    border
    border-transparent

    outline-none
    transition-all
    duration-300

    focus-visible:ring-2
    focus-visible:ring-[#8B5CF6]/50

    disabled:pointer-events-none
    disabled:opacity-50

    active:translate-y-px

    [&_svg]:pointer-events-none
    [&_svg]:shrink-0
    [&_svg]:transition-transform
    [&_svg]:duration-300

    group-hover/button:[&_svg]:translate-x-1
    group-hover/button:[&_svg]:-translate-y-1
  `,
  {
    variants: {
      variant: {
        /* =========================================
           DEFAULT / SHINY
        ========================================= */
        default: `
          shiny-button

          bg-[#0B0710]
          text-white

          shadow-[inset_0_0_0_1px_rgba(125,91,166,0.25)]
        `,

        /* =========================================
           OUTLINE
        ========================================= */
        outline: `
          border-[#7D5BA6]/70
          bg-transparent
          text-white

          hover:bg-[#7D5BA6]/10
          hover:border-[#A36AF6]
        `,

        /* =========================================
           SECONDARY
        ========================================= */
        secondary: `
          border-transparent
          bg-white
          text-[#312442]

          hover:bg-gray-100
        `,

        /* =========================================
           GHOST
        ========================================= */
        ghost: `
          border-transparent
          bg-transparent
          text-white

          hover:bg-white/10
        `,

        /* =========================================
           DESTRUCTIVE
        ========================================= */
        destructive: `
          border-transparent
          bg-red-500
          text-white

          hover:bg-red-600
        `,

        /* =========================================
           LINK
        ========================================= */
        link: `
          border-transparent
          bg-transparent
          text-[#A36AF6]

          underline-offset-4
          hover:underline
        `,
      },

      size: {
        default: `
          h-[40px]
          gap-2
          px-4
          text-[16px]
          font-semibold
        `,

        sm: `
          h-[36px]
          gap-2
          px-4
          text-sm
        `,

        lg: `
          h-[48px]
          gap-2
          px-7
          text-[16px]
          font-semibold
        `,

        icon: `
          size-10
          p-0
        `,

        "icon-xs": `
          size-6
          p-0
        `,

        "icon-sm": `
          size-8
          p-0
        `,

        "icon-lg": `
          size-12
          p-0
        `,
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <>
      <Comp
        data-slot="button"
        data-variant={variant}
        data-size={size}
        className={cn(
          buttonVariants({
            variant,
            size,
            className,
          })
        )}
        {...props}
      />

      <style jsx global>{`
        /* =====================================================
           SHINY BUTTON
        ===================================================== */

        @property --gradient-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-angle-offset {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }

        @property --gradient-percent {
          syntax: "<percentage>";
          initial-value: 5%;
          inherits: false;
        }

        @property --gradient-shine {
          syntax: "<color>";
          initial-value: #ffffff;
          inherits: false;
        }

        .shiny-button {
          --shiny-bg: #0b0710;
          --shiny-bg-subtle: #21172d;

          /* Purple instead of blue */
          --shiny-highlight: #8b5cf6;
          --shiny-highlight-subtle: #c4b5fd;

          --gradient-angle: 0deg;
          --gradient-angle-offset: 0deg;
          --gradient-percent: 5%;
          --gradient-shine: #ffffff;

          --shiny-duration: 3s;

          isolation: isolate;
          position: relative;
          overflow: hidden;

          border-radius: 9999px;

          background:
            linear-gradient(
              var(--shiny-bg),
              var(--shiny-bg)
            )
            padding-box,

            conic-gradient(
              from
                calc(
                  var(--gradient-angle) -
                  var(--gradient-angle-offset)
                ),

              transparent,

              var(--shiny-highlight)
                var(--gradient-percent),

              var(--gradient-shine)
                calc(var(--gradient-percent) * 2),

              var(--shiny-highlight)
                calc(var(--gradient-percent) * 3),

              transparent
                calc(var(--gradient-percent) * 4)
            )
            border-box;

          border: 1px solid transparent;

          box-shadow:
            inset 0 0 0 1px
              var(--shiny-bg-subtle);

          transition:
            --gradient-angle-offset 800ms
              cubic-bezier(0.25, 1, 0.5, 1),

            --gradient-percent 800ms
              cubic-bezier(0.25, 1, 0.5, 1),

            --gradient-shine 800ms
              cubic-bezier(0.25, 1, 0.5, 1),

            box-shadow 500ms ease;
        }

        /* =====================================================
           DOT PATTERN
        ===================================================== */

        .shiny-button::before {
          content: "";

          pointer-events: none;

          position: absolute;

          inset: 2px;

          width: auto;
          height: auto;

          border-radius: inherit;

          background:
            radial-gradient(
              circle at 2px 2px,
              rgba(255, 255, 255, 0.35) 1px,
              transparent 1.5px
            );

          background-size: 8px 8px;

          mask-image:
            linear-gradient(
              to bottom,
              black,
              transparent 85%
            );

          opacity: 0.12;

          z-index: -1;

          transition: opacity 500ms ease;
        }

        /* =====================================================
           SOFT WHITE / PURPLE SHINE
        ===================================================== */

        .shiny-button::after {
          content: "";

          pointer-events: none;

          position: absolute;

          left: -70%;
          top: -100%;

          width: 240%;
          height: 240%;

          border-radius: 50%;

          background:
            linear-gradient(
              120deg,
              transparent 40%,

              rgba(139, 92, 246, 0.08) 47%,

              rgba(255, 255, 255, 0.28) 50%,

              rgba(139, 92, 246, 0.08) 53%,

              transparent 60%
            );

          opacity: 0;

          transform: rotate(0deg);

          z-index: 0;

          transition:
            opacity 500ms ease,
            transform 900ms ease;
        }

        /* =====================================================
           HOVER
        ===================================================== */

        .shiny-button:hover,
        .shiny-button:focus-visible {
          --gradient-percent: 20%;
          --gradient-angle-offset: 95deg;
          --gradient-shine: #ffffff;

          box-shadow:
            inset 0 0 0 1px
              rgba(139, 92, 246, 0.35),

            0 0 18px
              rgba(139, 92, 246, 0.12);
        }

        .shiny-button:hover::before,
        .shiny-button:focus-visible::before {
          opacity: 0.22;
        }

        .shiny-button:hover::after,
        .shiny-button:focus-visible::after {
          opacity: 1;
          transform: rotate(35deg);
        }

        /* =====================================================
           ANIMATION
        ===================================================== */

        .shiny-button {
          animation:
            gradient-angle
            var(--shiny-duration)
            linear
            infinite;
        }

        @keyframes gradient-angle {
          to {
            --gradient-angle: 360deg;
          }
        }

        /* =====================================================
           ACTIVE
        ===================================================== */

        .shiny-button:active {
          transform: translateY(1px) scale(0.99);
        }

        /* =====================================================
           ACCESSIBILITY
        ===================================================== */

        @media (prefers-reduced-motion: reduce) {
          .shiny-button {
            animation: none;
          }

          .shiny-button::after {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}

export { Button, buttonVariants };