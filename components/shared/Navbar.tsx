"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  CalendarDays,
  CircleHelp,
  Compass,
  Download,
  LogOut,
  NotebookPen,
  Plus,
  Settings,
  Sparkles,
  TrendingUp,
} from "lucide-react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const marketingLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/privacy", label: "Privacy" },
  { href: "/pricing", label: "Pricing" },
];

const appLinks = [
  { href: "/today", label: "Today", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/insights", label: "Insights", icon: TrendingUp },
  { href: "/explore", label: "Explore", icon: Compass },
];

const profileItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/settings/reminders", label: "Reminders", icon: Bell },
  { href: "/settings/export", label: "Export data", icon: Download },
  { href: "/help", label: "Help & feedback", icon: CircleHelp },
];

function Logo({ href }: { href: string }) {
  return (
    <Link href={href} className="flex items-center gap-2">
      <span className="grid size-8 place-items-center rounded-2xl bg-primary text-primary-foreground">
        <Sparkles className="size-4" />
      </span>
      <span className="font-heading text-lg font-semibold tracking-tight">
        Ambrosia
      </span>
    </Link>
  );
}

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
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

function UserMenu({
  side = "bottom",
  align = "end",
  onSignOut,
}: {
  side?: "bottom" | "top";
  align?: "start" | "end" | "center";
  onSignOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors outline-none hover:bg-muted focus-visible:ring-2 ring-ring"
      >
        <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary">
          <span className="text-sm font-semibold">A</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={side} align={align} sideOffset={10}>
        {profileItems.map((item) => (
          <DropdownMenuItem key={item.href} render={<Link href={item.href} />}>
            <item.icon />
            {item.label}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={onSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileCheckIn() {
  return (
    <Button
      aria-label="Check in"
      className="size-12 shrink-0 rounded-full shadow-md shadow-primary/20"
    >
      <Plus className="size-6" />
    </Button>
  );
}

function MobileNav({
  pathname,
  onSignOut,
}: {
  pathname: string;
  onSignOut: () => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5 items-center gap-1 px-3 py-2">
        {appLinks.slice(0, 3).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-0.5 rounded-2xl px-2 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                active && "text-primary",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        <div className="flex justify-center">
          <MobileCheckIn />
        </div>
        <div className="flex justify-center">
          <UserMenu side="top" align="center" onSignOut={onSignOut} />
        </div>
      </div>
    </nav>
  );
}

// ponytail: dev-only auth mock. Remove when real auth lands and drive
// `signedIn` from the session instead.
function Navbar({ signedIn = false }: { signedIn?: boolean }) {
  const pathname = usePathname();
  const [isSignedIn, setIsSignedIn] = useState(signedIn);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSignedIn((v) => !v)}
          className="rounded-full text-muted-foreground"
          aria-pressed={isSignedIn}
          aria-label="Toggle signed-in preview"
        >
          {isSignedIn ? "Signed in" : "Signed out"}
        </Button>

        <div className="flex flex-1 items-center gap-8">
          <Logo href={isSignedIn ? "/today" : "/"} />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {isSignedIn
              ? appLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                  />
                ))
              : marketingLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                  />
                ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {isSignedIn ? (
            <>
              <Button className="hidden md:inline-flex">
                <Plus />
                Check in
              </Button>
              <div className="hidden md:block">
                <UserMenu onSignOut={() => setIsSignedIn(false)} />
              </div>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "ghost" }))}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants())}
              >
                Start free
              </Link>
            </>
          )}
        </div>
      </div>

      {isSignedIn && (
        <MobileNav pathname={pathname} onSignOut={() => setIsSignedIn(false)} />
      )}
    </header>
  );
}

export default Navbar;
