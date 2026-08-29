import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy } from "better-auth/plugins";
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  trustedOrigins: ["http://localhost:3000"],
  plugins: [
    oAuthProxy({
      productionURL: process.env.BETTER_AUTH_URL,
      secret: process.env.OAUTH_PROXY_SECRET,
    }),
    nextCookies(),
  ],
});
