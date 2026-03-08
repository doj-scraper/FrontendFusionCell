# FusionCell

FusionCell is a B2B parts catalog for wholesale mobile repair components. It is built with Next.js App Router, TypeScript, Tailwind CSS, and Prisma against PostgreSQL/Neon.

## Stack

- Next.js 16 + React 19
- TypeScript 5
- Prisma 6 + `@prisma/client`
- PostgreSQL (Neon-compatible)
- Tailwind CSS 4 + shadcn/ui

## Local setup (npm only)

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Set up Prisma client and database schema:

```bash
npx prisma generate
npx prisma db push
```

4. (Optional) Seed sample catalog data:

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```


## Vercel deployment checklist

1. Push this repo to GitHub/GitLab/Bitbucket and import it into Vercel.
2. In **Project Settings → Environment Variables**, set:
   - `DATABASE_URL` = Neon **pooled** connection string (runtime app traffic).
   - `DIRECT_URL` = Neon **direct** (non-pooled) connection string for Prisma CLI.
   - `NEXTAUTH_URL` = your Vercel production URL (for example `https://your-project.vercel.app`).
   - `NEXTAUTH_SECRET` = a long random secret (for example from `openssl rand -base64 32`).
3. In Vercel **Build & Output Settings**, keep:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: default (leave empty for Next.js)
4. Redeploy after updating any environment variables.

### Optional post-deploy DB sync

Run schema sync from a trusted environment (local machine or CI) using the same env values:

```bash
npm run db:generate
npm run db:push
```

## Production-oriented commands

```bash
npm run build
npm run start
npm run lint
```

## Prisma commands

```bash
npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma studio
npm run db:seed
```

## Required environment variables

- `DATABASE_URL` — app/runtime Prisma connection URL.
- `DIRECT_URL` — direct Postgres URL for Prisma CLI operations (recommended for Neon non-pooled endpoint).
- `NEXTAUTH_URL` — base app URL.
- `NEXTAUTH_SECRET` — legacy fallback secret for NextAuth session/JWT encryption.
- `AUTH_SECRET` — preferred secret for Auth.js session/JWT encryption.

## Prisma notes (Postgres/Neon)

The active schema is `prisma/schema.prisma` and uses:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

If your provider does not require a separate direct URL, you can set `DIRECT_URL` equal to `DATABASE_URL`.

## Scripts

- `npm run dev` — start dev server.
- `npm run build` — build production bundle.
- `npm run start` — serve production build.
- `npm run lint` — run ESLint.
- `npm run db:generate` — generate Prisma client.
- `npm run db:push` — push schema to DB.
- `npm run db:migrate` — run/create migrations.
- `npm run db:seed` — seed sample data.
- `npm run db:studio` — open Prisma Studio.

## Commerce implementation roadmap (production-first)

This is the repo-ready plan for implementing customer accounts, cart, checkout, and order processing in a safe sequence.

### Phase 0 — Platform foundation

**Goal:** create shared infrastructure before feature work.

**Files to add/update (TypeScript):**

- `src/lib/env.ts` — environment validation (`AUTH_SECRET`, Stripe, DB URLs, app URL).
- `src/lib/prisma.ts` — Prisma singleton with production-safe logging.
- `src/lib/auth.ts` — centralized Auth.js configuration.
- `src/lib/stripe.ts` — Stripe server client singleton.
- `src/lib/logger.ts` — structured logger helper.
- `src/lib/api.ts` — normalized API success/error response helpers.
- `src/lib/validations/auth.ts`
- `src/lib/validations/cart.ts`
- `src/lib/validations/checkout.ts`
- `src/middleware.ts` — request ID/header correlation and protected-route guardrails.

**Acceptance criteria:**

- App fails fast on missing/invalid required env vars.
- API responses follow one consistent shape.
- Shared validation and logging conventions exist before feature endpoints.

### Phase 1 — Identity & account foundation

**Goal:** registration, login, and protected account sessions.

**Files to add/update (TypeScript):**

- `prisma/schema.prisma` — `User`, `UserRole` enum, and timestamp fields.
- `src/app/api/auth/[...nextauth]/route.ts` — Auth.js handlers.
- `src/app/api/auth/register/route.ts` — register endpoint.
- `src/app/(shop)/register/page.tsx` *(or `src/app/register/page.tsx`)* — register UI.
- `src/app/(shop)/login/page.tsx` *(or `src/app/login/page.tsx`)* — login UI.
- `src/app/account/page.tsx` — protected account page.
- `src/services/auth/register.service.ts`
- `src/services/auth/login.service.ts`

**Acceptance criteria:**

- Register/login/logout works.
- Passwords are hashed only (never stored in plaintext).
- Session persists and `/account` routes are protected.
- Auth endpoints have explicit rate limits.

### Phase 2 — Cart system

**Goal:** durable cart behavior for guest + authenticated users.

**Files to add/update (TypeScript):**

- `prisma/schema.prisma` — `Cart`, `CartItem`, `CartStatus` enum.
- `src/app/api/cart/route.ts` — get active cart.
- `src/app/api/cart/items/route.ts` — add/set/remove item actions.
- `src/services/cart/cart.service.ts` — merge/reprice business logic.
- `src/lib/validations/cart.ts` — typed cart action payloads.
- `src/app/cart/page.tsx` — cart UI and summaries.

**Guest cart decision (recommended):**

- Use HTTP-only signed cookie with `guestCartId`.
- Persist guest cart rows in DB.
- Merge guest cart into active user cart on login, then invalidate cookie.

**Acceptance criteria:**

- One active cart per user.
- Cart totals are recomputed server-side.
- Inactive/missing products are blocked or pruned.
- Guest cart merge is deterministic and tested.

### Phase 3 — Checkout & Payment Intent

**Goal:** validated checkout inputs and server-created Stripe payment intents.

**Files to add/update (TypeScript):**

- `prisma/schema.prisma` — `Address`, `Order`, `OrderItem`, `PaymentStatus`, `OrderStatus`.
- `src/app/api/checkout/intent/route.ts` — create payment intent.
- `src/services/checkout/checkout.service.ts` — repricing, pending order shell creation.
- `src/app/checkout/page.tsx` — shipping/billing form + Stripe Payment Element.
- `src/components/checkout/checkout-form.tsx`
- `src/components/checkout/payment-element.tsx`
- `src/lib/validations/checkout.ts`

**Required behavior:**

- Always create/update a pending order shell before returning client secret.
- Re-query products and recompute totals server-side.
- Store `stripePaymentIntentId` on the pending order.
- Keep shipping/tax logic explicit (MVP: flat shipping, tax stubbed to `0`).

### Phase 4 — Webhook-driven order finalization & history

**Goal:** finalize orders from Stripe webhooks, not client redirects.

**Files to add/update (TypeScript):**

- `src/app/api/webhooks/stripe/route.ts` — signature-verified webhook handler.
- `src/services/orders/order-finalization.service.ts` — transaction-wrapped finalization.
- `prisma/schema.prisma` — processed webhook event table (idempotency) and constraints.
- `src/app/account/orders/page.tsx` — order history UI.
- `src/app/account/addresses/page.tsx` — address management UI.

**Required behavior:**

- Verify webhook signature for every event.
- Handle at least `payment_intent.succeeded` and `payment_intent.payment_failed`.
- Enforce idempotency via processed-event table + unique payment intent constraint.
- Finalization writes must be transactional.

## API response contract (recommended)

Use one shared response format in all route handlers:

```ts
type ApiSuccess<T> = {
  success: true;
  data: T;
  requestId?: string;
};

type ApiError = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  requestId?: string;
};
```

## Testing checklist by phase

- Phase 0
  - `npm run lint`
  - Environment validation tests for `src/lib/env.ts`
- Phase 1
  - Auth validator unit tests
  - API integration tests for register/login/session
- Phase 2
  - Cart action schema tests
  - Cart merge/reprice integration tests
- Phase 3
  - Checkout intent integration tests (empty cart, invalid items, amount mismatch)
- Phase 4
  - Webhook signature verification tests
  - Idempotency tests for duplicate event delivery
  - End-to-end happy path: register → cart → checkout → webhook → account orders

Recommended CI minimum before merge:

```bash
npm run lint
npm run build
```
