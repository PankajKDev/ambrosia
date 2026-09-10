export function SectionCard({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-4xl border border-border bg-background/85 p-6 shadow-sm sm:p-7">
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
      <div className="mt-6">{children}</div>
    </section>
  );
}
