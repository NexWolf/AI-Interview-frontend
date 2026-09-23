"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/shared/context/LanguageContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage();

  const navLinks = [
    { label: t("nav.features"), href: "#features" },
    { label: t("nav.benefits"), href: "#benefits" },
    { label: t("nav.howItWorks"), href: "#how-it-works" },
    { label: t("nav.pricing"), href: "#pricing" },
  ];

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
                  key={link.href}
                  href={link.href}
                  className="group flex h-[38px] items-center gap-1.5 rounded-full px-4 text-[14px] font-medium text-white/70 transition-all duration-300 hover:bg-white/[0.08] hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* ================= Desktop Right Side ================= */}
          <div className="hidden items-center gap-4 lg:flex">
            {/* Language Switcher Button */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex h-[44px] items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-xs font-semibold text-white/90 shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#9F84D9]/50 hover:bg-white/[0.12] active:scale-95"
              aria-label="Switch Language"
            >
              <Globe className="h-4 w-4 text-[#9F84D9]" />
              <span>{t("nav.switchLang")}</span>
            </button>

            {/* Sign Up */}
            <Button
              asChild
              className="rounded-full border border-[#6136BF] bg-[#6136BF] px-6 text-white shadow-lg shadow-[#6136BF]/25 transition-all duration-300 hover:bg-[#724EBF] hover:shadow-[#724EBF]/35"
            >
              <Link href="/auth" className="flex items-center gap-2">
                <span>{t("nav.signup")}</span>
                <ArrowUpRight className="h-4 w-4 rtl:rotate-[-90deg] transition-transform" />
              </Link>
            </Button>
          </div>

          {/* ================= Mobile Button ================= */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex h-10 items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.06] px-3 text-xs font-medium text-white/90 backdrop-blur-xl"
              aria-label="Switch Language"
            >
              <Globe className="h-3.5 w-3.5 text-[#9F84D9]" />
              <span>{language === "en" ? "AR" : "EN"}</span>
            </button>

            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen(!open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.06] text-white backdrop-blur-xl transition hover:bg-white/[0.1]"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* ================= Mobile Menu ================= */}
        {open && (
          <div className="mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]/95 shadow-2xl backdrop-blur-2xl lg:hidden">
            <div className="p-4">
              {/* Links */}
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-[15px] font-medium text-white/75 transition-all duration-300 hover:bg-white/[0.06] hover:text-white"
                  >
                    <span>{link.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="mt-3 flex flex-col gap-3 border-t border-white/10 pt-4">
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="group flex h-11 items-center justify-center gap-2 rounded-full border border-[#6136BF] bg-[#6136BF] text-sm font-medium text-white transition hover:bg-[#724EBF]"
                >
                  {t("nav.signup")}
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
