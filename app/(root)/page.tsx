import { SignedOut } from "@/components/shared/auth/signed-out";
import Features from "@/components/shared/Features";
import Hero from "@/components/shared/Hero";
import HowItWorks from "@/components/shared/HowItWorks";

export default function Home() {
  return (
    <>
      <SignedOut>
        <Hero />;
        <HowItWorks />
        <Features />
      </SignedOut>
    </>
  );
}
