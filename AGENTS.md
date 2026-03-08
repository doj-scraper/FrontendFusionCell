# AGENTS.md

This file defines agent operating instructions for the entire repository.

## 1) Core Development Standards

- Always use **TypeScript** for new application code, scripts, utilities, and examples where applicable.
- Plan changes with **production readiness** in mind (security, observability, performance, rollback safety).
- Prefer small, composable modules with clear ownership boundaries.
- Keep route handlers thin; put business logic in service modules.

## 2) Architecture & Code Organization

- Follow the current layered pattern:
  - `src/app/api/**/route.ts` for HTTP boundaries.
  - `src/server/validators/*` for input validation.
  - `src/server/services/*` for domain/business logic.
  - `src/lib/*` for shared infrastructure utilities.
- Avoid duplicating logic already present in service layer.
- Keep validation close to API boundaries and fail fast on invalid input.

## 3) UI / Design Rules

- Do **not** use dark blue / cyan blue primary-button palettes.
- Do **not** use brutalist visual style.
- Preferred palette families:
  - black / gold / violet
  - dark green / wood brown / yellow / white (PNW-inspired)
- Maintain accessible contrast and clear interactive states (hover, focus, disabled, loading).

## 4) Quality & Testing Expectations

- For any meaningful code change, run relevant checks before finalizing:
  - `npm run lint`
  - `npm run build`
  - targeted tests where available
- If tests are missing for changed behavior, suggest adding them in the summary.
- For new logic in services/validators, prefer adding automated tests.

## 5) API and Data Safety

- Never trust client input without server-side validation.
- Normalize and sanitize query/body parameters.
- Keep sensitive values in environment variables, server-side only.
- Use Prisma access patterns that are explicit and predictable.
- Avoid introducing raw SQL unless necessary and reviewed.

## 6) Documentation Expectations

- Keep `README.md` and `ARCHITECTURE.md` aligned with major architectural changes.
- Document new endpoints, env vars, and operational runbooks when introduced.
- When adding new subsystems, include production considerations (failure modes, monitoring, scaling).

## 7) Delivery Checklist for Agents

Before completing a task:

1. Confirm instructions in this file are followed.
2. Run lint/build/tests relevant to change scope.
3. Summarize what changed and why.
4. Include follow-up suggestions when useful (especially around testing, hardening, and observability).

## 8) Non-Goals / Anti-Patterns

- Do not ship UI that relies on inaccessible color contrast.
- Do not embed business-critical logic directly in page components.
- Do not skip validation and error handling for external inputs.
- Do not optimize prematurely at the expense of maintainability.
