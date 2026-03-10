# FrontendFusionCell Components

This directory contains the core UI components for the FrontendFusionCell application. The components are organized into layout components, content display cards, and shared UI primitives.

## Table of Contents

- [Layout Components](#layout-components)
- [Card Components](#card-components)
- [Modal Components](#modal-components)
- [Theme System](#theme-system)
- [Design Tokens](#design-tokens)

---

## Layout Components

### Header

**File:** [`src/components/layout/header.tsx`](src/components/layout/header.tsx)

The primary navigation header that provides site-wide navigation and quick access to search, account, and cart functionality.

**Features:**
- Sticky positioning with backdrop blur effect
- Responsive design with mobile drawer menu
- Integrated search bar (Cmd+K keyboard shortcut)
- Theme toggle (light/dark mode)
- Account and cart navigation icons with cart badge
- Brand navigation bar for quick device category access
- Full accessibility support with ARIA labels

**Key Props:**
```typescript
// No props required - component is self-contained
export function Header()
```

**Dependencies:**
- [`SearchModal`](src/components/search-modal.tsx) - Search functionality
- `useTheme` from `next-themes` - Theme management
- UI components: Button, Badge, Sheet, NavigationMenu

---

### Footer

**File:** [`src/components/layout/footer.tsx`](src/components/layout/footer.tsx)

Site-wide footer providing company information, navigation links, and contact details.

**Features:**
- Four-column responsive grid layout
- Company description and branding
- Quick links navigation (About, Contact, Return Policy, Terms, Shipping)
- Device category links (Apple, Samsung, Motorola, Google)
- Contact information with email and phone
- Social media links (Facebook, eBay, YouTube, LinkedIn, Instagram)
- Copyright notice with Privacy Policy and Terms links

**Key Props:**
```typescript
// No props required - component uses static data
export function Footer()
```

---

### Main Layout

**File:** [`src/components/layout/main-layout.tsx`](src/components/layout/main-layout.tsx)

Wrapper component that combines Header and Footer with page content.

---

## Card Components

### BrandCard

**File:** [`src/components/brand-card.tsx`](src/components/brand-card.tsx)

Displays a device brand (e.g., Apple, Samsung) with device count and navigation capability.

**Interface:**
```typescript
export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string | null
  description?: string | null
  deviceCount: number
}

export interface BrandCardProps {
  brand: Brand
  onClick?: () => void
  isSelected?: boolean
  className?: string
}
```

**Features:**
- Displays brand logo/icon or fallback icon
- Shows device count badge
- Hover and selected states
- Keyboard navigation support (Enter/Space)
- Skeleton loading state component

---

### DeviceCard

**File:** [`src/components/device-card.tsx`](src/components/device-card.tsx)

Displays a device (e.g., iPhone 14, Galaxy S23) with part availability information.

**Interface:**
```typescript
export interface Device {
  id: string
  name: string
  slug: string
  modelNumber?: string | null
  image?: string | null
  releaseYear?: number | null
  description?: string | null
  partCount: number
}

export interface DeviceCardProps {
  device: Device
  onClick?: () => void
  isSelected?: boolean
  className?: string
}
```

**Features:**
- Device image with fallback icon
- Parts count overlay badge
- Model number and release year display
- Hover state with "View parts" indicator
- Keyboard navigation support
- Skeleton loading state component

---

### PartCard

**File:** [`src/components/part-card.tsx`](src/components/part-card.tsx)

Displays a repair part with pricing, stock status, and add-to-cart functionality.

**Interface:**
```typescript
export interface Part {
  id: string
  sku: string
  name: string
  slug: string
  description?: string | null
  price: number
  comparePrice?: number | null
  image?: string | null
  quality?: string | null
  color?: string | null
  isFeatured?: boolean
  category?: { id: string; name: string; slug: string } | null
  inventory?: {
    quantity: number
    reserved: number
    available: number
    location?: string | null
  } | null
}

export interface PartCardProps {
  part: Part
  onAddToCart?: (part: Part) => void
  onQuickView?: (part: Part) => void
  className?: string
}
```

**Features:**
- Product image with fallback icon
- Featured and discount badges
- SKU display with stock status badge
- Quality and color badges
- Dynamic pricing (original vs. compare price)
- Quick view button on hover
- Add to cart button with disabled state for out-of-stock items
- Stock status indicators: In Stock, Low Stock, Out of Stock
- Skeleton loading state component

**Quality Badge Mapping:**
| Quality | Badge Variant |
|---------|---------------|
| OEM | default |
| Premium | default |
| Aftermarket | secondary |
| High Quality | default |
| Refurbished | outline |

---

## Modal Components

### SearchModal

**File:** [`src/components/search-modal.tsx`](src/components/search-modal.tsx)

Global search modal powered by a command palette interface, accessible via clicking the search bar or pressing Cmd+K / Ctrl+K.

**Interface:**
```typescript
interface SearchModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}
```

**Features:**
- Debounced search (300ms) with API integration
- Three result categories: Parts, Devices, Brands
- Keyboard navigation (arrow keys, Enter, Escape)
- Loading skeleton states
- Empty state with search suggestions
- Initial state with keyboard shortcuts help
- Discount percentage display for parts
- Quick navigation to full search results page

**Result Types:**
- **Parts:** SKU, name, price, quality badge, discount, device compatibility
- **Devices:** Name, brand, model number, release year, part count
- **Brands:** Name, description, device count

**Keyboard Shortcuts:**
| Shortcut | Action |
|----------|--------|
| ↑↓ | Navigate results |
| Enter | Select result |
| Escape | Close modal |
| Cmd+K / Ctrl+K | Open search |

---

## Theme System

### ThemeProvider

**File:** [`src/components/theme-provider.tsx`](src/components/theme-provider.tsx)

Wrapper around `next-themes` for managing light/dark mode with system preference detection.

**Usage:**
```typescript
import { ThemeProvider } from "@/components/theme-provider"

<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

**Features:**
- System theme detection
- Smooth transitions between themes
- No flash of unstyled content (SSR-safe)
- Persisted user preference

---

## Design Tokens

The application uses a token-first design system defined in `src/app/globals.css` and mapped in `tailwind.config.ts`.

### Core Tokens

| Token | Purpose |
|-------|---------|
| `--background` | Page background |
| `--foreground` | Primary text |
| `--card` | Card backgrounds |
| `--card-foreground` | Card text |
| `--primary` | Primary actions (teal family) |
| `--primary-foreground` | Text on primary |
| `--secondary` | Secondary elements |
| `--muted` | Muted/disabled states |
| `--accent` | Hover/highlight states |
| `--destructive` | Error/delete actions |

### Extended Tokens

| Token | Purpose |
|-------|---------|
| `--highlight` | Gold family for emphasis |
| `--highlight-soft` | Softer highlight variant |
| `--success` | Success states (green) |
| `--warning` | Warning states (amber) |
| `--info` | Informational states (blue) |

### Structural Tokens

| Token | Purpose |
|-------|---------|
| `--border` | Default borders |
| `--input` | Form input borders |
| `--ring` | Focus ring color |

### Design Rules

1. **Color Usage:**
   - Use token-backed utilities only (`bg-primary`, `text-muted-foreground`)
   - Prefer background contrast over heavy borders/shadows for hierarchy
   - Keep static cards shadowless; reserve shadow for overlays/popovers

2. **Interaction:**
   - Keep all interactive controls at least 44px tall (`min-h-11`)
   - Use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`

3. **Typography Utilities:**
   - `.text-display` - Hero text
   - `.text-page-title` - Page headings
   - `.text-section-title` - Section headings
   - `.text-card-title` - Card headings
   - `.text-body` - Body text
   - `.text-body-strong` - Emphasized body
   - `.text-label` - Labels
   - `.text-caption` - Captions
   - `.text-micro` - Fine print

4. **Accessibility:**
   - WCAG AA minimum compliance (AAA where feasible)
   - Respect `prefers-reduced-motion`
   - Avoid color-only communication; pair with labels/icons
   - Maintain visible focus states

5. **Palette Preferences:**
   - Avoid dark blue/cyan blue primary-button palettes
   - Avoid brutalist visual style
   - Preferred palettes:
     - Black / Gold / Violet
     - Dark Green / Wood Brown / Yellow / White (PNW-inspired)

---

## Component Hierarchy

```
src/components/
├── layout/
│   ├── header.tsx          # Main navigation header
│   ├── footer.tsx         # Site footer
│   ├── main-layout.tsx    # Layout wrapper
│   └── index.ts           # Export barrel
├── brand-card.tsx         # Brand display card
├── device-card.tsx        # Device display card
├── part-card.tsx          # Part product card
├── search-modal.tsx       # Global search modal
├── theme-provider.tsx     # Theme context provider
└── ui/                    # shadcn/ui primitives
```

---

## Related Documentation

- [Design System](../design_system.md) - Full design token reference
- [Architecture](../ARCHITECTURE.md) - Application architecture
- [Tailwind Config](../tailwind.config.ts) - Theme configuration