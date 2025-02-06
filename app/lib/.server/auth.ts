import { betterAuth } from "better-auth";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { sendResetPassword } from "./utils/emails";
import { env } from "server/env";

export const authServer = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword,
  },
  baseURL: env.BASE_URL,
  trustedOrigins: env.TRUSTED_ORIGINS,
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email") {
        return;
      }

      const email = ctx.body?.email;

      if (env.ALLOWED_EMAILS.includes(email)) {
        return;
      }

      throw new APIError("BAD_REQUEST", {
        message: "Email not allowed to register",
      });
    }),
  },
});

export type AuthServer = typeof authServer;
