# Production Improvement Plan (10 Objectives)

This plan sequences the 10 requested improvements into integrated, production-ready phases with explicit dependencies, acceptance criteria, and rollback-safe checkpoints.

## Guiding Principles

- Keep API boundaries in `src/app/api/**/route.ts`; business logic in `src/server/services/*`; validation in `src/server/validators/*`.
- Keep all new scripts and implementation in TypeScript.
- Deliver in small, mergeable increments with lint/build/test gates in each phase.

---

## Phase 0 — Baseline, Risk Controls, and Branch Protections (Week 0)

**Goals:** establish a safe delivery baseline and avoid regressions while introducing core platform changes.

### Scope

1. Freeze current behavior with a baseline architecture + endpoint inventory.
2. Define quality gates that every subsequent phase must satisfy.
3. Add feature flags for high-risk changes (auth providers, strict lint/type upgrades, rate limiting).

### Deliverables

- `docs/engineering/baseline-inventory.md`
- `docs/engineering/rollout-flags.md`
- PR template and CODEOWNERS adjustments (if missing).

### Acceptance Criteria

- Every API route is mapped to owner, validator, and service module.
- Flag strategy exists for incremental rollout/rollback.
- CI policy drafted before implementation phases begin.

---

## Phase 1 — Testing Infrastructure + CI/CD Foundation (Objectives 1 & 6)

**Why first:** all remaining objectives are safer when enforced by automated checks.

### Scope

1. Add unit/integration testing with Vitest.
2. Add end-to-end testing with Playwright.
3. Add GitHub Actions workflows for lint/typecheck/build/test/E2E.
4. Add coverage reporting + minimum coverage thresholds for changed files.

### Implementation Plan

- Add test tooling:
  - `vitest`, `@vitest/coverage-v8`, `@testing-library/react`, `@testing-library/jest-dom`, `msw`.
  - `@playwright/test` and browser install step in CI.
- Add configs:
  - `vitest.config.ts`
  - `playwright.config.ts`
  - `src/test/setup.ts`
- Add GitHub workflows:
  - `.github/workflows/ci.yml` (lint, typecheck, build, unit/integration tests)
  - `.github/workflows/e2e.yml` (Playwright on preview/local)
- Seed initial test suites:
  - API route smoke tests
  - validator/service tests for auth/cart/checkout
  - one critical checkout happy-path E2E

### Acceptance Criteria

- PRs are blocked if lint/build/tests fail.
- Test command matrix is reproducible locally and in CI.
- Coverage report generated in CI artifacts.

---

## Phase 2 — Static Safety Hardening (Objectives 2 & 3)

### Scope

1. Re-enable critical ESLint safety rules currently disabled.
2. Enable `noImplicitAny: true` with staged remediation.

### Implementation Plan

- Create a staged lint policy:
  - Start with warnings for broad rules.
  - Move to errors after remediation completes.
- Prioritize high-signal rules:
  - `@typescript-eslint/no-explicit-any`
  - `@typescript-eslint/no-unused-vars`
  - `no-console` (allow controlled logger wrappers)
  - `react-hooks/exhaustive-deps`
- TypeScript migration strategy:
  - Enable `noImplicitAny: true` in branch.
  - Fix by domain (auth → cart → checkout → shared libs).
  - Prefer explicit DTO/types in validators/services.

### Acceptance Criteria

- `npm run lint` passes with critical rules enabled.
- `npm run build` passes with `noImplicitAny: true`.
- No unsafe `any` in security-sensitive paths.

---

## Phase 3 — Authentication Completion + Endpoint Protection (Objectives 4 & 5)

### Scope

1. Complete auth providers (credentials + at least one OAuth provider).
2. Apply rate limiting consistently to public/auth-sensitive endpoints.

### Implementation Plan

- Auth provider completion:
  - Add Credentials provider using existing auth services.
  - Add OAuth provider(s) via env-gated config.
  - Ensure callback/session claims are minimal and typed.
- Rate-limit rollout:
  - Build route-level policy map (`public`, `auth`, `checkout`, `webhook`).
  - Integrate `rate-limit.ts` at API boundaries with structured 429 responses.
  - Add bypass/adjustment strategy for internal/trusted origins.

### Acceptance Criteria

- Login/register/OAuth flows validated in automated tests.
- Public endpoints enforce consistent throttling.
- 429 telemetry is observable (counts by route and client key).

---

## Phase 4 — Security Hardening + API Documentation (Objectives 7 & 8)

### Scope

1. Add OpenAPI/Swagger coverage for all API endpoints.
2. Implement security controls: CSP, CSRF, and input sanitization.

### Implementation Plan

- API docs:
  - Generate OpenAPI spec from typed route schemas where possible.
  - Publish `/api/docs` (Swagger UI) for non-production or authenticated internal use.
  - Add CI check ensuring spec stays in sync.
- Security controls:
  - Add strict CSP headers in middleware/Next config (nonce/hash strategy for scripts).
  - Add CSRF protection for state-changing endpoints (token + same-site cookie strategy).
  - Add centralized sanitization utilities (query/body normalization) before service calls.
  - Threat-model auth, checkout, and webhook endpoints.

### Acceptance Criteria

- All public/internal endpoints represented in OpenAPI spec.
- CSP/CSRF enabled without breaking auth/checkout UX.
- Fuzz/negative tests exist for invalid payloads and malicious input.

---

## Phase 5 — Observability + Performance Monitoring (Objective 9)

### Scope

1. Add query profiling and slow-query visibility.
2. Define caching strategy and Redis adoption decision.

### Implementation Plan

- Instrumentation:
  - Add request IDs, route latency histograms, error-rate counters.
  - Enable Prisma query timing logs in non-dev controlled modes.
- Performance:
  - Identify top-N expensive queries; optimize indexes + query shapes.
  - Define cache policy by data class:
    - product catalog (cacheable)
    - cart/checkout/account (non-cache or short-lived private cache)
- Redis decision:
  - Evaluate for rate-limit store + hot-read caching + job coordination.
  - Add ADR documenting adoption criteria, costs, and operational burden.

### Acceptance Criteria

- Dashboard/report exists for p95 latency, DB slow queries, and error rates.
- Cache strategy documented and partially implemented for top hot paths.
- Redis decision recorded with rollout plan (adopt/defer).

---

## Phase 6 — Data Layer Consistency + Final Production Readiness (Objective 10)

### Scope

1. Fix Prisma schema mismatch by adding `directUrl` to datasource as documented.
2. Run final production readiness validation.

### Implementation Plan

- Add `directUrl = env("DIRECT_URL")` to Prisma datasource.
- Validate migrations, generate client, and verify runtime behavior in staging.
- Ensure README + ARCHITECTURE stay aligned with actual implementation.

### Acceptance Criteria

- Prisma schema and README are consistent.
- DB commands (`generate`, `migrate`, `seed`) pass in CI/staging.
- Release checklist signed off.

---

## Cross-Phase Integration Controls

## Dependency Graph (critical order)

1. Testing/CI foundations → 2) lint/type hardening → 3) auth + rate limiting → 4) security/docs → 5) performance → 6) schema alignment/final signoff.

## Definition of Done (for each objective)

- Code merged with tests.
- CI green on lint/build/test suites.
- Observability added for the changed area.
- Documentation updated (README/ARCHITECTURE/OpenAPI where applicable).
- Rollback path documented.

## Recommended Command Gate per PR

- `npm run lint`
- `npm run build`
- `npm run test` (Vitest)
- `npm run test:e2e` (Playwright, for impacted user flows)

---

## Suggested Milestone Breakdown

- **Milestone A (Weeks 1–2):** Phases 0–1
- **Milestone B (Weeks 3–4):** Phase 2
- **Milestone C (Weeks 5–6):** Phase 3
- **Milestone D (Weeks 7–8):** Phase 4
- **Milestone E (Weeks 9–10):** Phases 5–6 + release readiness

This sequence ensures every one of the 10 objectives is completed with automated verification and production-safe rollout controls.
