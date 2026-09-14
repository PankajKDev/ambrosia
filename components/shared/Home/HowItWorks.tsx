import { Activity, NotebookPen, TrendingUp } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Activity,
    title: "Daily check-in",
    description:
      "Take a quick daily check-in to capture your mood, energy, focus, and anything on your mind.",
  },
  {
    number: "02",
    icon: NotebookPen,
    title: "Capture when it appears",
    description:
      "Save thoughts, worries, or wins whenever they appear — no need to organize everything perfectly.",
  },
  {
    number: "03",
    icon: TrendingUp,
    title: "Gentle reflections",
    description:
      "As small entries build over time, Ambrosia turns them into clear weekly reflections, helping you notice patterns and choose one realistic next step.",
  },
];

function StepCard({
  number,
  icon: Icon,
  title,
  description,
}: (typeof steps)[number]) {
  return (
    <article className="relative rounded-4xl border border-border bg-background/80 p-6 shadow-sm shadow-primary/5">
      <span
        aria-hidden="true"
        className="absolute right-5 top-5 font-heading text-3xl font-semibold leading-none tracking-tight text-muted-foreground/25"
      >
        {number}
      </span>
      <span className="mb-5 grid size-11 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
        <Icon className="size-5" />
      </span>
      <h3 className="font-heading text-lg font-semibold tracking-tight">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </article>
  );
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Ambrosia works in three gentle steps
        </h2>
        <p className="mt-4 text-pretty text-lg text-muted-foreground">
          No perfect journal required — just three small rituals that fit
          around real-life ADHD days.
        </p>
      </div>
      <div className="relative mt-12 grid gap-6 lg:grid-cols-3">
        <div
          aria-hidden="true"
          className="absolute left-8 right-8 top-14 hidden border-t-2 border-dashed border-border lg:block"
        />
        {steps.map((step) => (
          <StepCard key={step.number} {...step} />
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;