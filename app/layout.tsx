import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shared/theme-provider";

const notoSansHeading = localFont({
  src: "../public/fonts/NotoSans.ttf",
  variable: "--font-heading",
});

const nunitoSans = localFont({
  src: "../public/fonts/NunitoSans.ttf",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_BASE_URL!),
  title: {
    default: "Ambrosia — Journaling for ADHD minds",
    template: "%s | Ambrosia",
  },
  description:
    "A gentle journaling app for ADHD minds to capture thoughts and notice patterns.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Ambrosia — Journaling for ADHD minds",
    description:
      "Capture thoughts, check in with mood, and discover gentle patterns.",
    url: "/",
    siteName: "Ambrosia",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        nunitoSans.variable,
        notoSansHeading.variable,
      )}
    >
      <body className="min-h-full  flex flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
