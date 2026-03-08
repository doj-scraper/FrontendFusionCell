import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import type { RegisterInput } from "@/server/validators/auth.validator";

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({ where: { email: input.email } });

  if (existingUser) {
    return { ok: false as const, code: "EMAIL_IN_USE" };
  }

  const passwordHash = await hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name || null,
      phone: input.phone || null,
      company: input.companyName || null,
      role: "CUSTOMER",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return { ok: true as const, user };
}
