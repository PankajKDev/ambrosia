"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import QuickNote from "./Notes/QuickNote";
import { Logo, NavLink } from "./NavbarShared";
import { appLinks, profileItems } from "@/constants";

type NavbarUser = {
  name: string;
};

function UserMenu({
  user,
  side = "bottom",
  align = "end",
}: {
  user: NavbarUser;
  side?: "bottom" | "top";
  align?: "start" | "end" | "center";
}) {
  const router = useRouter();

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
          <span className="text-sm font-semibold">{user.name[0]}</span>
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
      className="size-12 shrink-0 rounded-full bg-orange-400 shadow-md shadow-primary/20 hover:bg-orange-600"
    >
      <Zap className="size-6" />
    </Button>
  );
}

function MobileNav({
  pathname,
  onOpenQuick,
  user,
}: {
  pathname: string;
  onOpenQuick: () => void;
  user: NavbarUser;
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
          <UserMenu user={user} side="top" align="center" />
        </div>
      </div>
    </nav>
  );
}

export default function AppNavbar({ user }: { user: NavbarUser }) {
  const pathname = usePathname();
  const [quickOpen, setQuickOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex">
            <Logo href="/" />
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:hidden">
            <Logo href="/" />
          </div>

          <div className="flex flex-1 items-center gap-8">
            <nav
              aria-label="Main"
              className="hidden items-center gap-1 md:flex"
            >
              {appLinks.map((link) => (
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
            <Button
              className="hidden bg-orange-400 hover:bg-orange-600 md:inline-flex"
              onClick={() => setQuickOpen(true)}
            >
              <Zap />
              Quick note
            </Button>
            <div className="hidden md:block">
              <UserMenu user={user} />
            </div>
          </div>
        </div>
      </header>

      <MobileNav
        pathname={pathname}
        onOpenQuick={() => setQuickOpen(true)}
        user={user}
      />
      <QuickNote open={quickOpen} onOpenChange={setQuickOpen} />
    </>
  );
}
