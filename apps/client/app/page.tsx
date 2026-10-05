import Navbar from "@/features/landing/components/Navbar";
import { Hero } from "@/features/landing/components/Hero";
import { Features } from "@/features/landing/components/Features";
import CtaFooter from "@/features/landing/components/CtaFooter";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import Pricing from "@/features/landing/components/Pricing";

export default function Home() {
  return (
    <div className="dark min-h-screen bg-black text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Pricing />
      <HowItWorks />
      <CtaFooter />
    </div>
  );
}
