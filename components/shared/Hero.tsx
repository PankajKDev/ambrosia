import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import TodayPreview from "@/components/shared/TodayPreview";
import { cn } from "@/lib/utils";

function TrustLine() {
  return (
    <p className="mt-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
      Private by default
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      No streak pressure
      <span aria-hidden="true" className="text-border">
        ·
      </span>
      Built for real-life ADHD days
    </p>
  );
}

function Hero() {
  return (
    <main className="relative flex-1  overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-150 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />
      <div className="mx-auto grid max-w-6xl gap-18 px-4 py-16 sm:px-6 lg:grid-cols-[6fr_5fr] lg:items-center lg:gap-10 lg:px-8 lg:py-24">
        <section className="text-center lg:text-left">
          <h1 className="text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Understand your days, without having to keep a perfect journal.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-pretty text-lg text-muted-foreground lg:mx-0">
            Ambrosia helps ADHD minds quickly capture thoughts, check in with
            mood and energy, and discover gentle patterns over time.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/sign-up"
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
            >
              Start free
            </Link>
            <Link
              href="/how-it-works"
              className="w-full rounded-4xl px-4 py-2.5 text-sm font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline sm:w-auto"
            >
              See how it works
            </Link>
          </div>
          <TrustLine />
        </section>
        <TodayPreview />
      </div>
    </main>
  );
}

export default Hero;
