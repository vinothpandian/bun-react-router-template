import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.string().default("development"),
  DATABASE_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  RESEND_API_KEY: z.string(),
  ALLOWED_EMAILS: z.string().transform((val) => val.split(";")),
  BASE_URL: z.string().url(),
  TRUSTED_ORIGINS: z.string().transform((val) => val.split(";")),
});

export const env = envSchema.parse(process.env);
