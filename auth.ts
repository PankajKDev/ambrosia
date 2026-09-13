import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./lib/prisma";
import { nextCookies } from "better-auth/next-js";
import { oAuthProxy } from "better-auth/plugins";
import resend from "./lib/resend";
import ForgotPasswordTemplate from "./components/shared/Email/ForgotPasswordTemplate";
import EmailVerificationTemplate from "./components/shared/Email/EmailVerificationTemplate";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,

    //password reset
    sendResetPassword: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: "Ambrosia <auth@ambrosia.sainte.cloud>",
        to: user.email,
        subject: "Reset your password",
        react: ForgotPasswordTemplate({ firstName: user.name, resetLink: url }),
      });
      if (error) throw error;
    },
    revokeSessionsOnPasswordReset: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      const { error } = await resend.emails.send({
        from: "Ambrosia <onboarding@ambrosia.sainte.cloud>",
        to: user.email,
        subject: "verify your email",
        react: EmailVerificationTemplate({
          firstName: user.email,
          verificationLink: url,
        }),
      });
      if (error) throw error;
    },
  },
  user: {
    additionalFields: {
      isOnboarded: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      focusAreas: { type: "string[]", defaultValue: [] },
      aiEnabled: { type: "boolean", defaultValue: false },
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
