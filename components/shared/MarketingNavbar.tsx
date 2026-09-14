import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Logo, NavLink } from "./NavbarShared";
import { marketingLinks } from "@/constants";

export default function MarketingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Logo href="/" />

        <nav
          aria-label="Main"
          className="hidden flex-1 items-center gap-1 md:flex"
        >
          {marketingLinks.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/sign-in"
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
          >
            Sign in
          </Link>
          <Link href="/sign-up" className={cn(buttonVariants({ size: "sm" }))}>
            Start free
          </Link>
        </div>
      </div>
    </header>
  );
}
