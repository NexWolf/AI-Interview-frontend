"use client";
import Navbar from "@/features/landing/components/Navbar";
import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import CtaFooter from "@/features/landing/components/CtaFooter";
import { ThemeToggle } from "@/shared/components/ui/ThemeToggle";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import Pricing from "@/features/landing/components/Pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <HowItWorks/>
      <CtaFooter />
    </div>
  );
}
