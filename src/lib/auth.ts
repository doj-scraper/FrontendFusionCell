import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";
import { getClientIdentifier, rateLimit } from "@/lib/rate-limit";
import { validateLoginCredentials } from "@/server/services/auth/login.service";
import { loginSchema } from "@/server/validators/auth.validator";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const parsed = loginSchema.safeParse(credentials);

        if (!parsed.success) {
          logger.warn("Rejected login payload", { issues: parsed.error.flatten() });
          return null;
        }

        const clientId = getClientIdentifier(req?.headers as Record<string, string | string[] | undefined>);
        const limiterKey = `login:${clientId}:${parsed.data.email}`;

        if (!rateLimit(limiterKey, 5, 60_000)) {
          logger.warn("Rate limited login attempt", { clientId, email: parsed.data.email });
          return null;
        }

        return validateLoginCredentials(parsed.data);
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = typeof token.role === "string" ? token.role : "CUSTOMER";
      }

      return session;
    },
  },
  secret: env.AUTH_SECRET,
};
