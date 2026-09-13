import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Pricing — Ambrosia",
  description: "Ambrosia is free to use in its alpha stage.",
};

export default function PricingPage() {
  return (
    <main className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-radial-[at_50%_0%] from-(--hero-aura) via-(--hero-wash) to-transparent"
      />
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-(--mood-gold)" />
            Alpha
          </span>
          <h1 className="mt-6 text-balance font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Free to use while in alpha
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Ambrosia is free during its alpha stage. Check in, capture notes,
            explore weekly insights, and export your data — all without a
            paywall. Pricing will be introduced later, with early supporters
            grandfathered in.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl rounded-4xl border border-border bg-background/85 p-8 shadow-sm">
          <h2 className="font-heading text-xl font-semibold tracking-tight text-foreground">
            Everything in alpha
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            One plan, everything included while we shape the product.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Unlimited mood check-ins and notes",
              "Weekly insights (rule-based now, AI when enabled)",
              "Full timeline and history",
              "Export your data as JSON",
              "Explore resources — communities and articles",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm text-foreground">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-(--mood-soft) text-(--mood-gold)">
                  <Check className="size-3.5" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/sign-up" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}>
              Start free
            </Link>
            <Link
              href="/sign-in"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full sm:w-auto")}
            >
              Sign in
            </Link>
          </div>
          <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
            No credit card required. We&apos;ll share pricing details well before alpha ends.
          </p>
        </div>
      </div>
    </main>
  );
}
