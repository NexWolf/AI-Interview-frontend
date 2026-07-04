import {
  MessageSquareText,
  Gauge,
  Briefcase,
  Mic,
  LineChart,
  ShieldCheck,
} from "lucide-react"

const features = [
  {
    icon: MessageSquareText,
    title: "Instant answer feedback",
    description:
      "Get line-by-line analysis of your responses with concrete suggestions to make them sharper and more structured.",
  },
  {
    icon: Gauge,
    title: "Real-time scoring",
    description:
      "Every answer is scored on clarity, relevance, and confidence so you always know exactly where you stand.",
  },
  {
    icon: Briefcase,
    title: "Role-specific questions",
    description:
      "Tailored question banks for engineering, product, sales, design, and 50+ roles at the companies you target.",
  },
  {
    icon: Mic,
    title: "Voice & tone analysis",
    description:
      "Detect filler words, pacing, and hesitation, then practice until you sound calm, clear, and convincing.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    description:
      "Watch your scores climb session over session with trends that show what's improving and what needs work.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design",
    description:
      "Your recordings and transcripts are encrypted and never shared. Delete your data anytime in one click.",
  },
]

export const Features = () => {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Why Rehearse</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Everything you need to interview with confidence
        </h2>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          A complete coaching toolkit that turns nervous practice into measurable
          improvement — built for the way real interviews actually happen.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <feature.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-lg font-medium tracking-tight">{feature.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Features;
