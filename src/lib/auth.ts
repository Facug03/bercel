import { i18n } from "@better-auth/i18n";
import { betterAuth } from "better-auth";
import { db } from "@/lib/db";

export const auth = betterAuth({
  database: db,
  plugins: [
    i18n({
      defaultLocale: "es",
      translations: {
        es: {
          USER_NOT_FOUND: "No existe una cuenta con ese email.",
          INVALID_EMAIL_OR_PASSWORD: "Email o contraseña incorrectos.",
          INVALID_PASSWORD: "Contraseña incorrecta.",
          CREDENTIAL_ACCOUNT_NOT_FOUND: "Cuenta no encontrada.",
          EMAIL_NOT_VERIFIED: "El email no está verificado.",
          SESSION_EXPIRED: "La sesión expiró. Iniciá sesión nuevamente.",
          EMAIL_ALREADY_IN_USE: "Ya existe una cuenta con ese email.",
          PASSWORD_TOO_SHORT: "La contraseña es demasiado corta.",
          PASSWORD_TOO_LONG: "La contraseña es demasiado larga.",
          TOO_MANY_REQUESTS: "Demasiados intentos, intentá más tarde.",
        },
      },
    }),
  ],
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
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 10,
  },
});
