import { Mic, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const CtaFooter = () => {
  return (
    <footer className="border-t border-border/60">
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-14 text-center sm:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 h-64 w-[640px] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
          />
          <h2 className="relative text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            Your next interview could be the one
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-pretty leading-relaxed text-muted-foreground">
            Start your first mock interview in under a minute. No credit card
            required.
          </p>
          <div className="relative mt-8 flex justify-center">
            <Button size="lg" className="group rounded-full px-7">
              Start practicing free
              <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border/60 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Mic className="h-3.5 w-3.5" />
            </span>
            <span className="font-semibold tracking-tight">Rehearse</span>
          </div>
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
            <a href="#faq" className="hover:text-foreground">FAQ</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
          </nav>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Rehearse
          </p>
        </div>
      </section>
    </footer>
  )
}

export default CtaFooter;
