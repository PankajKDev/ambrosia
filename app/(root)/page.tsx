import { SignedIn } from "@/components/shared/auth/signed-in";
import { SignedOut } from "@/components/shared/auth/signed-out";
import Features from "@/components/shared/Features";
import Hero from "@/components/shared/Hero";
import HowItWorks from "@/components/shared/HowItWorks";
import Onboarding from "@/components/shared/Onboarding";
import Mood from "@/components/shared/Today/Mood";

export default function Home() {
  return (
    <>
      <SignedOut>
        <Hero />;
        <HowItWorks />
        <Features />
      </SignedOut>
      <SignedIn>
        <Mood />
        <Onboarding />
      </SignedIn>
    </>
  );
}
