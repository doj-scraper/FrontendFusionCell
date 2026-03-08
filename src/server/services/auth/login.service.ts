import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { LoginInput } from "@/server/validators/auth.validator";

export async function validateLoginCredentials(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });

  if (!user?.passwordHash || !user.isActive) {
    return null;
  }

  const isPasswordValid = await compare(input.password, user.passwordHash);

  if (!isPasswordValid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
