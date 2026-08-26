"use client"
import Navbar from "@/component/Landing/Navbar";
import { Hero } from "@/component/Landing/Hero";
import { Features } from "@/component/Landing/Features"
import CtaFooter from "@/component/Landing/CtaFooter";
import { ThemeToggle } from "@/component/shared/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <Navbar />
      <Hero/>
      <Features />
      <CtaFooter />
    </div>
  );
}
