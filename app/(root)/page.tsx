import { auth } from "@/auth";
import Features from "@/components/shared/Home/Features";
import Hero from "@/components/shared/Home/Hero";
import HowItWorks from "@/components/shared/Home/HowItWorks";
import Onboarding from "@/components/shared/Onboarding";
import Mood from "@/components/shared/Today/Mood";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    return (
      <>
        <Mood />
        <Onboarding />
      </>
    );
  }

  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
    </>
  );
}
