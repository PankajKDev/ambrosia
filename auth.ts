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
  user: {
    additionalFields: {
      isOnboarded: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      focusAreas: { type: "string[]", defaultValue: [] },
      reminderEnabled: { type: "boolean", defaultValue: false },
      reminderTime: { type: "string", required: false },
      aiEnabled: { type: "boolean", defaultValue: false },
      aiModel: { type: "string", defaultValue: "gemini" },
    },
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
