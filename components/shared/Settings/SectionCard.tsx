import { FlaskConical } from "lucide-react";

export default function SectionCard({
  title,
  description,
  icon: Icon,
  badge,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-4xl border border-border bg-background/85 p-6 shadow-sm sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-(--mood-soft) text-(--mood-gold)">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/40 bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
            <FlaskConical className="size-3" />
            {badge}
          </span>
        )}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}
