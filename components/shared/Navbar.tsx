import { headers } from "next/headers";

import { auth } from "@/auth";
import AppNavbar from "./AppNavbar";
import MarketingNavbar from "./MarketingNavbar";

export default async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return <MarketingNavbar />;
  }

  return <AppNavbar user={{ name: session.user.name }} />;
}
