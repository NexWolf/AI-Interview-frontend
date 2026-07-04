import Image from "next/image"
import { ArrowRight, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* subtle radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-primary/15 blur-[140px]"
      />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 sm:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            AI-powered mock interviews
          </div>

          <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Practice interviews with an AI coach that helps you{" "}
            <span className="text-primary">land the offer</span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Rehearse runs realistic mock interviews, listens to your answers, and
            delivers instant, specific feedback on your content, clarity, and
            confidence — so you walk in ready.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="group w-full rounded-full px-6 sm:w-auto">
              Start practicing free
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full rounded-full border-border bg-transparent px-6 sm:w-auto"
            >
              Watch demo
            </Button>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <span>Trusted by 40,000+ job seekers</span>
          </div>
        </div>

        {/* product preview */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
            <Image
              src="/AI.jpg"
              alt="Rehearse AI interview session showing a live mock interview, transcript, and a score of 86"
              width={1600}
              height={1000}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
