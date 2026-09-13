import {
  Compass,
  Download,
  HeartPulse,
  Lock,
  Sparkles,
  Tags,
  Zap,
} from "lucide-react";

import { cn } from "@/lib/utils";

const moods = [
  { label: "Low", tone: "bg-(--mood-soft)" },
  { label: "Meh", tone: "bg-(--mood-soft)" },
  { label: "Okay", tone: "bg-(--mood-soft)" },
  { label: "Good", tone: "bg-(--mood-gold)" },
  { label: "Great", tone: "bg-(--mood-rose)" },
];

function IconTile({ children }: { children: React.ReactNode }) {
  return (
    <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
      {children}
    </span>
  );
}

function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      className={cn(
        "flex flex-col rounded-4xl border border-border bg-background/80 p-8 shadow-sm shadow-primary/5",
        className,
      )}
    >
      {children}
    </article>
  );
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-heading text-xl font-semibold tracking-tight text-foreground">
      {children}
    </h3>
  );
}

function Description({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
      {children}
    </p>
  );
}

function MoodDots() {
  return (
    <div className="flex items-center gap-2.5" aria-hidden="true">
      {moods.map((mood, i) => (
        <span
          key={mood.label}
          className={cn(
            "h-9 w-9 rounded-full border border-border",
            mood.tone,
            "animate-in zoom-in-95 fade-in-0 duration-300 ease-out fill-mode-backwards",
          )}
          style={{ animationDelay: `${i * 90}ms` }}
        />
      ))}
    </div>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden py-16 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Support for difficult days and high-energy days alike
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Built around quick check-ins, easy capture, and gentle patterns —
            with none of the pressure that makes journals feel like homework.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-12">
          <Card className="bg-(--mood-soft)/50 lg:col-span-7 lg:p-10">
            <IconTile>
              <HeartPulse className="size-5" />
            </IconTile>
            <Title>Fast mood check-ins</Title>
            <Description>
              Capture where you&apos;re at in a single tap — whether it&apos;s
              a foggy afternoon or a wired, high-energy evening.
            </Description>
            <div className="mt-8">
              <MoodDots />
            </div>
          </Card>

          <Card className="lg:col-span-5">
            <IconTile>
              <Zap className="size-5" />
            </IconTile>
            <Title>One-tap thought capture</Title>
            <Description>
              Get the thought out before it slips away. Capture is one tap
              away, wherever you are.
            </Description>
            <div
              aria-hidden="true"
              className="mt-8 grid size-16 place-items-center rounded-full border-2 border-(--mood-gold)/40"
            >
              <span className="grid size-9 place-items-center rounded-full bg-(--mood-gold) text-background">
                <Zap className="size-4" />
              </span>
            </div>
          </Card>

          <Card className="lg:col-span-5">
            <IconTile>
              <Tags className="size-5" />
            </IconTile>
            <Title>Flexible notes, optional tags</Title>
            <Description>
              Folders are a later problem. Write what you need, add tags only
              when it helps, and never organize perfectly.
            </Description>
            <div className="mt-8 flex flex-wrap gap-2" aria-hidden="true">
              <span className="rounded-full bg-(--mood-soft) px-3 py-1 text-xs font-medium text-foreground">
                #win
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                #heavy-day
              </span>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                #coffee
              </span>
            </div>
          </Card>

          <Card className="bg-(--mood-soft)/50 lg:col-span-7 lg:p-10">
            <IconTile>
              <Sparkles className="size-5" />
            </IconTile>
            <Title>Weekly insights</Title>
            <Description>
              Scattered entries become an honest weekly summary — dominant
              mood, trend, and small things to try next week.
            </Description>
            <div className="mt-8 grid max-w-sm gap-2" aria-hidden="true">
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-xs">
                <span className="font-medium text-muted-foreground">Dominant mood</span>
                <span className="ml-auto font-semibold text-foreground">okay</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-2 text-xs">
                <span className="font-medium text-muted-foreground">Trend</span>
                <span className="ml-auto font-semibold text-foreground">stable</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Card>
            <IconTile>
              <Compass className="size-5" />
            </IconTile>
            <Title>Explore resources</Title>
            <Description>
              Peer communities and trusted articles — separate from your
              journal, there when you want context.
            </Description>
            <div className="mt-8 flex flex-wrap gap-2" aria-hidden="true">
              {["Communities", "Articles"].map((tone) => (
                <span
                  key={tone}
                  className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {tone}
                </span>
              ))}
            </div>
          </Card>
          <Card className="bg-(--mood-soft)/30">
            <IconTile>
              <Download className="size-5" />
            </IconTile>
            <Title>Export your data</Title>
            <Description>
              One JSON file with your notes, insights, and profile — private by
              default, portable whenever you need it.
            </Description>
            <span
              aria-hidden="true"
              className="mt-8 w-fit rounded-full border border-dashed border-border bg-background px-3 py-1 font-mono text-xs font-medium text-muted-foreground"
            >
              ambrosia-export-….json
            </span>
          </Card>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 rounded-4xl border border-border bg-background/80 px-8 py-8 text-center shadow-sm shadow-primary/5 sm:flex-row sm:px-10 sm:text-left">
          <IconTile>
            <Lock className="size-5" />
          </IconTile>
          <div>
            <h3 className="font-heading text-xl font-semibold tracking-tight">
              Your notes, your control
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Private by default. Export your data as JSON or delete notes
              whenever you choose.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;