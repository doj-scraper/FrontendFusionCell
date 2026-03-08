# FrontendFusionCell Design System

This repository uses a token-first, surface-led design system with WCAG AA minimum compliance (AAA where feasible).

## Foundation

- Primary interactive color: `--primary` (teal family)
- Highlight/emphasis color: `--highlight` (gold family)
- Neutral structure: gray-axis `260°` OKLCH tokens
- Semantic tokens: `--success`, `--warning`, `--info`, `--destructive`
- Focus token: `--ring` with visible `ring-2` + offset behavior

## Theme Tokens

Token values are defined in `src/app/globals.css` for light and dark themes:

- Core tokens: background/foreground/card/popover/primary/secondary/muted/accent
- Extended tokens: highlight/highlight-soft/success/warning/info/destructive
- Structural tokens: border/input/ring
- Data-viz tokens: chart-1…chart-5
- Layout tokens: space scale + radius scale

## Component Rules

- Use token-backed utilities only (`bg-primary`, `text-muted-foreground`, etc.)
- Prefer background contrast over heavy borders/shadows for hierarchy
- Keep static cards shadowless; reserve shadow for overlays/popovers
- Keep all interactive controls at least 44px tall (`min-h-11`)
- Use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

## Typography Utilities

Reusable typography classes are provided in `globals.css`:

- `.text-display`
- `.text-page-title`
- `.text-section-title`
- `.text-card-title`
- `.text-body`
- `.text-body-strong`
- `.text-label`
- `.text-caption`
- `.text-micro`

## Tailwind Bindings

`tailwind.config.ts` maps all theme tokens to named color families and extends:

- radius scale (`sm`, `md`, `lg`, `xl`)
- functional shadows (`sm`, `md`, `lg`)
- motion durations/easing (`fast`, `normal`, `slow`)

## Accessibility and Motion

- Respect `prefers-reduced-motion: reduce`
- Maintain AA minimum contrast
- Avoid color-only communication; pair with labels/icons
