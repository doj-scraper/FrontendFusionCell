import { headers } from "next/headers";
import { apiError, apiSuccess } from "@/lib/api";
import { logger } from "@/lib/logger";
import { getClientIdentifier, rateLimit } from "@/lib/rate-limit";
import { registerUser } from "@/server/services/auth/register.service";
import { registerSchema } from "@/server/validators/auth.validator";

export async function POST(request: Request) {
  const headerStore = await headers();
  const requestId = headerStore.get("x-request-id") ?? undefined;

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(
      "INVALID_PAYLOAD",
      "Invalid registration payload",
      400,
      parsed.error.flatten(),
      requestId,
    );
  }

  const clientId = getClientIdentifier(headerStore);
  const limiterKey = `register:${clientId}:${parsed.data.email}`;

  if (!rateLimit(limiterKey, 5, 60_000)) {
    logger.warn("Rate limited registration attempt", {
      requestId,
      context: {
        clientId,
        email: parsed.data.email,
      },
    });

    return apiError(
      "RATE_LIMITED",
      "Too many registration attempts. Please try again shortly.",
      429,
      undefined,
      requestId,
    );
  }

  const result = await registerUser(parsed.data);

  if (!result.ok) {
    return apiError(
      "EMAIL_IN_USE",
      "An account with this email already exists.",
      409,
      undefined,
      requestId,
    );
  }

  logger.info("User registered", {
    requestId,
    context: {
      userId: result.user.id,
    },
  });

  return apiSuccess(result.user, 201, requestId);
}