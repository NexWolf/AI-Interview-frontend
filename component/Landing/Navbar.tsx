"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  {
    label: "Features",
    href: "#features",
    dropdown: true,
  },
  {
    label: "Benefits",
    href: "#benefits",
    dropdown: false,
  },
  {
    label: "How it Works",
    href: "#how-it-works",
    dropdown: true,
  },
  {
    label: "Pricing",
    href: "#pricing",
    dropdown: false,
  },
  {
    label: "Testimonials",
    href: "#testimonials",
    dropdown: false,
  },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute left-0 right-0 top-0 z-50">
      <div className="mx-auto w-full max-w-[1280px] px-5 pt-6 sm:px-8 lg:px-10">
        <nav className="flex h-[64px] items-center justify-between">
          {/* ================= Logo ================= */}
          <Link href="#home" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] shadow-[0_0_20px_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300 group-hover:bg-white/[0.1]">
              <div className="relative h-5 w-5">
                <span className="absolute left-[3px] top-[1px] h-2.5 w-2.5 rotate-45 rounded-[3px] bg-white" />
                <span className="absolute bottom-[1px] right-[3px] h-2.5 w-2.5 rotate-45 rounded-[3px] bg-white/60" />
              </div>
            </div>

            <span className="text-[18px] font-medium tracking-tight text-white">
              AI INTERVIEW
            </span>
          </Link>

          {/* ================= Desktop Navigation ================= */}
          <div className="hidden items-center lg:flex">
            <div className="flex h-[48px] items-center rounded-full border border-white/[0.18] bg-white/[0.07] px-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-2xl">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group flex h-[38px] items-center gap-1.5 rounded-full px-4 text-[14px] font-medium text-white/70 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
                >
                  {link.label}

                  {link.dropdown && (
                    <ChevronDown className="h-3.5 w-3.5 text-white/50 transition-transform duration-300 group-hover:translate-y-0.5" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* ================= Desktop Right Side ================= */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Search */}
            {/* <button
              type="button"
              aria-label="Search"
              className="group flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.06] text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl transition-all duration-300 hover:border-white/25 hover:bg-white/[0.1] hover:text-white"
            >
              <Search className="h-[19px] w-[19px] stroke-[1.7] transition-transform duration-300 group-hover:scale-110" />
            </button> */}

            {/* Log In */}
            {/* <Link
              href="/login"
              className="text-sm font-medium text-white/75 transition-colors duration-300 hover:text-white"
            >
              Log In
            </Link> */}

            {/* Sign Up */}
            <Button
              asChild
              className="rounded-md border border-[#8B5CF6] bg-[#8B5CF6] px-6 hover:bg-[#7C3AED]"
            >
              <Link href="/auth">
                {" "}
                Sign Up <ArrowUpRight className="ml-2 h-4 w-4" />{" "}
              </Link>
            </Button>
          </div>

          {/* ================= Mobile Button ================= */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-xl transition hover:bg-white/[0.1] lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* ================= Mobile Menu ================= */}
        {open && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]/95 shadow-2xl backdrop-blur-2xl lg:hidden">
            <div className="p-4">
              {/* Links */}
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium text-white/75 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                  >
                    <span>{link.label}</span>

                    {link.dropdown && (
                      <ChevronDown className="h-4 w-4 text-white/50" />
                    )}
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-4">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-sm font-medium text-white/80 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="group flex h-11 items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.08] text-sm font-medium text-white transition hover:bg-white/[0.14]"
                >
                  Sign Up
                  <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
