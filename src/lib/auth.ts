import { betterAuth } from "better-auth";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders:
    process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
          },
        }
      : undefined,
  trustedOrigins: process.env.BETTER_AUTH_URL
    ? [process.env.BETTER_AUTH_URL]
    : undefined,
});
