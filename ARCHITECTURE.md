# FusionCell Architecture

## 1) System Overview

FusionCell is a production-oriented B2B mobile repair parts catalog built on:

- **Next.js App Router** for server rendering, routing, and API routes.
- **TypeScript** across frontend, backend, and tooling.
- **Prisma + PostgreSQL (Neon-compatible)** for data access.
- **Tailwind CSS + shadcn/ui** for UI primitives and design system composition.

At a high level, the app serves catalog browsing experiences (brands, devices, parts, search), while API routes validate requests and delegate business logic to server-side services.

---

## 2) Runtime & Request Flow

### User-facing page flow

1. User requests an App Router page (e.g., `/`, `/search`, `/brand/[slug]`, `/device/[slug]`, `/part/[sku]`).
2. The page component loads data via route handlers or server-side service calls.
3. UI components (cards, explorer, layout primitives) render data into responsive pages.

### API flow

1. Request enters `src/app/api/**/route.ts`.
2. Request payload and query params are validated via `src/server/validators/*`.
3. Route delegates to service layer in `src/server/services/*`.
4. Service layer accesses DB through Prisma client (`src/lib/db.ts`).
5. Normalized response returned to caller.

### Data consistency principles

- Server-side validation before any DB read/write.
- Business logic centralized in services, not route handlers.
- Typed payload contracts shared through TypeScript.

---

## 3) Repository Structure

```text
prisma/
  schema.prisma
  seed.ts
src/
  app/
    api/**/route.ts
    (pages)
  components/
    layout/
    ui/
    *.tsx (domain components)
  hooks/
  lib/
    db.ts
    utils.ts
  server/
    services/
    validators/
```

### Responsibility map

- **`src/app`**: route surfaces (pages + HTTP API entrypoints).
- **`src/server/validators`**: input guardrails and schema constraints.
- **`src/server/services`**: reusable domain logic for catalog/search/filtering.
- **`src/components`**: render layer and composable UI.
- **`src/lib`**: low-level shared utilities (DB client, helper functions).
- **`prisma`**: source of truth for schema and seed data.

---

## 4) Domain Model (Current)

The active domain centers around catalog discovery:

- **Brand** → contains multiple devices.
- **Device** → contains multiple parts.
- **Part** → identified by SKU and searchable metadata.

Supporting capabilities include:

- Faceted filtering.
- Full-text-like part search.
- Category and brand/device browsing endpoints.

---

## 5) API Surface (Current)

Current API endpoints are organized under `src/app/api`:

- `brands`, `brands/[slug]`
- `devices/[slug]`
- `parts`, `parts/[sku]`
- `categories`
- `filters`
- `search`
- `contact`
- `cart`, `cart/items`
- `checkout/intent`
- `webhooks/stripe`
- `account/addresses`, `account/addresses/[addressId]`, `account/addresses/[addressId]/default`
- `ops/metrics`

Design expectations:

- Routes are thin controllers.
- Validators reject malformed inputs early.
- Services own query composition and domain invariants.

---

## 6) Data Layer & Prisma

- Prisma schema is maintained in `prisma/schema.prisma`.
- Connection settings rely on `DATABASE_URL` and `DIRECT_URL`.
- `prisma/seed.ts` bootstraps local/sample catalog state.

Production notes:

- Use pooled URL for runtime traffic.
- Use direct URL for migration/introspection operations.
- Prefer migration-based changes for controlled schema evolution.

---

## 7) Frontend Architecture

### Rendering strategy

- Use App Router server rendering for data-heavy catalog routes.
- Keep client components focused on interaction state.
- Minimize client bundle by preferring server components by default.

### Component strategy

- `src/components/ui/*`: low-level primitive wrappers.
- Domain components (`part-card`, `device-card`, `brand-card`, explorer components) compose primitives into catalog experiences.
- Layout components in `src/components/layout/*` standardize header/footer/shell.

### Styling and visual system

Production UI should follow:

- Accessible contrast, semantic spacing, and predictable component states.
- Preferred palettes: **black / gold / violet** or **dark green / wood brown / yellow / white** (PNW-inspired).
- Avoid dark-blue/cyan primary-button style defaults.
- Avoid brutalist styling.

---

## 8) Validation, Error Handling, and Observability


### Checkout and order safety

- Checkout intents are created from server-repriced cart state only.
- Saved address IDs are ownership-validated server-side before use in an order shell.
- Stripe webhook finalization is idempotent and transaction-wrapped.
- Webhook counters and payment/order divergence signals are recorded for operational visibility.

### Validation

- All external inputs are validated at boundary routes.
- Type-safe validator outputs are passed downstream.

### Error handling

- Route handlers should return consistent JSON error shapes.
- Service exceptions should be normalized into user-safe errors.

### Observability (recommended)

- Add structured logs with request IDs.
- Track API latency and error rates by route.
- Add uptime and DB health checks.

---

## 9) Security & Compliance Baseline

- Never trust client-derived pricing or entity identity.
- Rate-limit public endpoints (especially search/contact).
- Sanitize and validate all query/body inputs.
- Restrict sensitive environment variables to server runtime.
- Add bot mitigation on contact and auth-like endpoints.

---

## 10) Performance Strategy

- Use targeted indexes for common catalog lookup fields (slug, SKU, brand/device foreign keys).
- Cache stable lookups where safe.
- Paginate large part listings.
- Use incremental rendering and partial hydration patterns where possible.
- Continuously profile slow queries and optimize in service layer.

---

## 11) Production Readiness Checklist

### Application

- [ ] `npm run lint` clean.
- [ ] `npm run build` succeeds.
- [ ] Error pages and empty states are user-friendly.
- [ ] API responses are consistent and documented.

### Database

- [ ] Prisma schema reviewed and versioned.
- [ ] Backup and restore plan defined.
- [ ] Indexes verified for top queries.

### Operations

- [ ] Environment variables validated at startup.
- [ ] Monitoring + alerting configured.
- [ ] Deployment rollback process documented.

---

## 12) Next Architectural Milestones

1. Introduce centralized env validation and typed config.
2. Standardize API response envelope and error codes.
3. Add service-level tests for search/filter/parts logic.
4. Implement auth/cart/checkout phases from roadmap in `README.md`.
5. Add request tracing + structured logging for production diagnostics.

---

## 13) Testing Strategy (Recommended)

- **Unit tests**: validators and service-layer pure logic.
- **Integration tests**: API route handlers against a test database.
- **E2E tests**: core browse/search/contact flows.
- **CI gates**: lint, typecheck, tests, and production build required before merge.

Suggested baseline commands:

```bash
npm run lint
npm run build
npm run test
```

(If `npm run test` is not configured yet, add Vitest/Jest with coverage targets.)
