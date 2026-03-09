# Rollout Flags (Phase 0)

This register defines production-safe feature flags for high-risk platform changes scheduled in upcoming phases.

## Flag Standards

- Flags must be server-side evaluated for API/security behavior.
- Default state must prioritize safety and rollback simplicity.
- Every flag must define owner, scope, observability signal, and rollback action.

## Initial Flag Register

| Flag | Default | Owner | Scope | Observability | Rollback |
| --- | --- | --- | --- | --- | --- |
| `FF_AUTH_CREDENTIALS_PROVIDER` | `false` | Identity API | Enable credentials provider in NextAuth | auth login success/failure rate, 401/403 volume | disable flag and keep existing auth path |
| `FF_AUTH_OAUTH_GOOGLE` | `false` | Identity API | Enable Google OAuth provider | OAuth callback error rate, account-linking failures | disable provider via flag/env |
| `FF_RATE_LIMIT_STRICT` | `false` | Platform API | Promote stricter rate-limit policies by route class | 429 counts by route/client key, request latency | flip to `false` and retain permissive policy |
| `FF_LINT_STRICT_MODE` | `false` | Platform API | Enforce stricter eslint rules as CI blockers | lint failure trend and rule-frequency histogram | revert to warning-only config |
| `FF_TS_NO_IMPLICIT_ANY` | `false` | Platform API | Enable `noImplicitAny` in TS config | typecheck failure trend by package/domain | disable and continue staged remediation |
| `FF_CI_REQUIRED_E2E` | `false` | Platform API | Make E2E job required in protected branches | flaky-test rate, pipeline duration, failure causes | mark E2E non-blocking temporarily |

## Operational Notes

- Flag values should be exposed in startup logs for traceability (without sensitive config values).
- Do not couple multiple risky changes behind one shared flag.
- Record every default change in release notes and deployment changelog.
