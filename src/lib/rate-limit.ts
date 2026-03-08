type Bucket = {
  count: number;
  resetAt: number;
};

const store = new Map<string, Bucket>();

export function getClientIdentifier(
  headers: Headers | Record<string, string | string[] | undefined>,
): string {
  const read = (key: string) => {
    if (headers instanceof Headers) {
      return headers.get(key) ?? undefined;
    }

    const value = headers[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const forwardedFor = read("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = read("x-real-ip");

  return forwardedFor || realIp || "unknown-client";
}

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || existing.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= limit) {
    return false;
  }

  existing.count += 1;
  store.set(key, existing);
  return true;
}
