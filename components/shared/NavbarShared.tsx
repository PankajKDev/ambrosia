import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-2xl bg-primary text-primary-foreground">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="Ambrosia" className="size-4" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">
        Ambrosia
      </span>
    </Link>
  );
}

export function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
        active && "bg-muted text-foreground",
      )}
    >
      {label}
    </Link>
  );
}
