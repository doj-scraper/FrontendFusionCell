# Baseline Inventory (Phase 0)

This document freezes the current API architecture baseline before Phase 1 testing/CI rollout.

## Architecture Snapshot

- HTTP boundary: `src/app/api/**/route.ts`.
- Domain logic: primarily in `src/server/services/*` (with known gaps listed below).
- Input validation: `src/server/validators/*` (route-level usage varies by endpoint).
- Shared infra: `src/lib/*` (`auth`, `api`, `db`, `monitoring`, `rate-limit`, etc.).

## API Endpoint Inventory

| Route | Methods | Owner | Validator | Service Module | Notes |
| --- | --- | --- | --- | --- | --- |
| `/api` | GET | Platform API | none | none | health/hello response |
| `/api/account/addresses` | GET, POST | Commerce API | `addressCreateSchema` | `addresses/address.service` | authenticated |
| `/api/account/addresses/[addressId]` | PATCH, DELETE | Commerce API | `addressUpdateSchema` (PATCH) | `addresses/address.service` | authenticated |
| `/api/account/addresses/[addressId]/default` | POST | Commerce API | none | `addresses/address.service` | authenticated |
| `/api/auth/[...nextauth]` | GET, POST | Identity API | NextAuth internal | `authOptions` / NextAuth handler | provider configuration only |
| `/api/auth/register` | POST | Identity API | `registerSchema` | `auth/register.service` | has in-memory rate limiting |
| `/api/brands` | GET | Catalog API | none | none | uses `db` directly in route |
| `/api/brands/[slug]` | GET | Catalog API | none | none | uses `db` directly in route |
| `/api/cart` | GET, PATCH, DELETE | Commerce API | inline guards | `cart/cart.service` | authenticated |
| `/api/cart/items` | POST, PATCH, DELETE | Commerce API | inline guards | `cart/cart.service` | authenticated |
| `/api/categories` | GET | Catalog API | none | none | uses `db` directly in route |
| `/api/checkout/intent` | POST | Checkout API | inline body checks | `checkout/checkout.service` | authenticated |
| `/api/contact` | POST | Support API | `contactFormSchema` | none | logs + simulated async handler |
| `/api/devices/[slug]` | GET | Catalog API | none | none | uses `db` directly in route |
| `/api/filters` | GET | Catalog API | none | `filter.service` | query handling in route |
| `/api/ops/metrics` | GET | Platform API | none | `monitoring` snapshot | authenticated |
| `/api/parts` | GET | Catalog API | `partsQuerySchema` | `parts.service` | standardized response shape |
| `/api/parts/[sku]` | GET | Catalog API | none | none | uses `db` directly in route |
| `/api/search` | GET | Catalog API | `searchParamsSchema` | `search.service` | standardized response shape |
| `/api/webhooks/stripe` | POST | Checkout API | Stripe signature + event parsing | `orders/order-finalization.service` | webhook verification + telemetry |

## Risk Register (Pre-Phase 1)

1. **Service-layer gaps**: several catalog endpoints access Prisma directly in route handlers.
2. **Validator consistency gaps**: some endpoints still rely on ad-hoc inline checks.
3. **Error/logging inconsistency**: mix of `apiError/apiSuccess` and raw `NextResponse` + `console.error`.
4. **Test/CI gap**: no first-class `test`, `test:e2e`, or CI workflow currently present.

## Baseline Quality Gates (Draft)

All Phase 1+ PRs must run:

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm run test` (added in Phase 1)
- `npm run test:e2e` for user-flow-impacting changes (added in Phase 1)

## Rollback-Safe Checkpoints

- Introduce risky features behind flags only (auth provider additions, strict lint/type gates, distributed rate limiting).
- Keep route contracts backward compatible until at least one release cycle validates replacement code paths.
- Require branch protection + CODEOWNERS review before merging Phase 1+ infrastructure changes.
