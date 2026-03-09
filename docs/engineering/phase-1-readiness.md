# Phase 1 Readiness Checklist

Phase 0 preparation complete when all items below are checked.

## CI/CD Policy Draft

- Required status checks (protected branches): `lint`, `typecheck`, `build`, `unit-integration`, `e2e`.
- PRs require at least one CODEOWNERS approval.
- PRs require linear history and conversation resolution before merge.
- Production deployments only from protected default branch.

## Tooling Plan (Phase 1 Implementation)

1. Unit/integration stack: Vitest + Testing Library + MSW + coverage (`@vitest/coverage-v8`).
2. E2E stack: Playwright with checkout happy-path smoke test.
3. Local command matrix:
   - `npm run lint`
   - `npm run typecheck`
   - `npm run build`
   - `npm run test`
   - `npm run test:e2e`
4. CI workflows:
   - `.github/workflows/ci.yml`
   - `.github/workflows/e2e.yml`

## Seed Test Backlog

- API smoke tests for: register, parts search, checkout intent, stripe webhook signature validation.
- Validator tests for: auth/address/contact/search schemas.
- Service tests for: cart and checkout business logic.
- One E2E checkout happy path with authenticated user.

## Exit Criteria to Start Phase 1

- [x] Baseline architecture and endpoint inventory committed.
- [x] Rollout-flag strategy committed.
- [x] Branch protection expectations documented.
- [x] CODEOWNERS + PR template present.
- [ ] Test tooling dependencies installed.
- [ ] CI workflows implemented.
