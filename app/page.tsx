"use client"
import Navbar from "@/component/Landing/Navbar";
import { Hero } from "@/component/Landing/Hero";
import { Features } from "@/component/Landing/Features"
import CtaFooter from "@/component/Landing/CtaFooter";
import { ThemeToggle } from "@/component/shared/ThemeToggle";
import { Benefits } from "@/component/Landing/benefits";
import HowItWorks from "@/component/Landing/HowItWorks";
import Pricing from "@/component/Landing/pricing";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
       <div className="landing-theme">
      {/* هنا ضع مكونات الصفحة الجديدة مثل text-shimmer و border-beam إلخ */}
      <Navbar />
      <Hero/>
      <Features />
      <Benefits/>
      <HowItWorks />
      <Pricing />
      <CtaFooter />
    </div>
    </div>
  );
}
