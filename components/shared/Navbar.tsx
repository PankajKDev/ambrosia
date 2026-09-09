"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  CircleHelp,
  Compass,
  Download,
  LogOut,
  NotebookPen,
  Settings,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { SignedIn } from "./auth/signed-in";
import { SignedOut } from "./auth/signed-out";
import { useCurrentUser } from "@/hooks/use-current-user";
import QuickNote from "./QuickNote";

const marketingLinks = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/features", label: "Features" },
  { href: "/privacy", label: "Privacy" },
  { href: "/pricing", label: "Pricing" },
];

const appLinks = [
  { href: "/", label: "Today", icon: CalendarDays },
  { href: "/notes", label: "Notes", icon: NotebookPen },
  { href: "/insights", label: "Insights", icon: TrendingUp },
  { href: "/explore", label: "Explore", icon: Compass },
];

const profileItems = [
  { href: "/account/settings", label: "Settings", icon: Settings },
  { href: "/account/export", label: "Export data", icon: Download },
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
}: {
  side?: "bottom" | "top";
  align?: "start" | "end" | "center";
}) {
  const router = useRouter();
  const user = useCurrentUser();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open profile menu"
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-background transition-colors outline-none hover:bg-muted focus-visible:ring-2 ring-ring"
      >
        <span className="grid size-7 place-items-center rounded-full bg-primary/10 text-primary">
          <span className="text-sm font-semibold">{user.user?.name?.[0]}</span>
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
        <DropdownMenuItem variant="destructive" onClick={handleSignOut}>
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileCheckIn({ onClick }: { onClick: () => void }) {
  return (
    <Button
      aria-label="Quick note"
      onClick={onClick}
      className="size-12 shrink-0 bg-orange-400 hover:bg-orange-600 rounded-full shadow-md shadow-primary/20"
    >
      <Zap className="size-6" />
    </Button>
  );
}

function MobileNav({
  pathname,
  onOpenQuick,
}: {
  pathname: string;
  onOpenQuick: () => void;
}) {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1 rounded-4xl border border-border bg-background/90 p-2 pt-3 shadow-lg shadow-primary/10 backdrop-blur-md">
        {appLinks.slice(0, 3).map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex flex-col items-center gap-1 rounded-2xl py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring",
                active && "bg-muted text-primary",
              )}
            >
              <item.icon className="size-5" />
              {item.label}
            </Link>
          );
        })}
        <div className="flex -translate-y-2 justify-center">
          <MobileCheckIn onClick={onOpenQuick} />
        </div>
        <div className="flex justify-center">
          <UserMenu side="top" align="center" />
        </div>
      </div>
    </nav>
  );
}

function Navbar() {
  const pathname = usePathname();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex">
            <SignedOut>
              <Logo href="/" />
            </SignedOut>
            <SignedIn>
              <Logo href="/" />
            </SignedIn>
          </div>
          <div className="md:hidden">
            <SignedOut>
              <Logo href="/" />
            </SignedOut>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <SignedIn>
              <Logo href="/" />
            </SignedIn>
          </div>

          <div className="flex flex-1 items-center gap-8">
            <nav
              aria-label="Main"
              className="hidden items-center gap-1 md:flex"
            >
              <SignedIn>
                {appLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                  />
                ))}
              </SignedIn>
              <SignedOut>
                {marketingLinks.map((link) => (
                  <NavLink
                    key={link.href}
                    href={link.href}
                    label={link.label}
                    active={pathname === link.href}
                  />
                ))}
              </SignedOut>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <SignedIn>
              <Button
                className="hidden bg-orange-400 hover:bg-orange-600 md:inline-flex"
                onClick={() => setQuickOpen(true)}
              >
                <Zap />
                Quick note
              </Button>
              <div className="hidden md:block">
                <UserMenu />
              </div>
            </SignedIn>

            <SignedOut>
              <Link
                href="/sign-in"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className={cn(buttonVariants({ size: "sm" }))}
              >
                Start free
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      <SignedIn>
        <MobileNav pathname={pathname} onOpenQuick={() => setQuickOpen(true)} />
      </SignedIn>

      <SignedIn>
        <QuickNote open={quickOpen} onOpenChange={setQuickOpen} />
      </SignedIn>
    </>
  );
}

export default Navbar;
