"use client";

import { Mic, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/shared/context/LanguageContext";

export const CtaFooter = () => {
  const { t, direction } = useLanguage();

  return (
    <footer className="border-t border-border/60">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 rounded-full bg-[#6136BF]/20 blur-[120px]"
          />
          <h2 className="relative text-balance text-3xl font-semibold tracking-tight sm:text-4xl text-heading">
            {t("footer.title")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            {t("footer.desc")}
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button
              asChild
              size="lg"
              className="group rounded-full border border-[#6136BF] bg-[#6136BF] px-8 text-white shadow-xl shadow-[#6136BF]/25 transition-all duration-300 hover:bg-[#724EBF] hover:shadow-[#724EBF]/35"
            >
              <Link href="/auth" className="flex items-center gap-2">
                <span>{t("footer.cta")}</span>
                <ArrowRight className={`h-4 w-4 transition-transform ${direction === "rtl" ? "rotate-180 group-hover:-translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#6136BF] text-white">
              <Mic className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold tracking-tight text-heading">AI INTERVIEW</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">{t("nav.features")}</a>
            <a href="#benefits" className="hover:text-foreground">{t("nav.benefits")}</a>
            <a href="#how-it-works" className="hover:text-foreground">{t("nav.howItWorks")}</a>
            <a href="#pricing" className="hover:text-foreground">{t("nav.pricing")}</a>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI INTERVIEW. {t("footer.rights")}
          </p>
        </div>
      </section>
    </footer>
  );
};

export default CtaFooter;
