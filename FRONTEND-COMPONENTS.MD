# Frontend Components Documentation

This document provides a comprehensive overview of all frontend components used in the FusionCell application. The application is built with **Next.js 15**, **React 19**, and **TypeScript**, using **shadcn/ui** for the component library.

---

## Table of Contents

1. [Core Components](#core-components)
2. [Authentication Components](#authentication-components)
3. [Account Components](#account-components)
4. [Checkout Components](#checkout-components)
5. [Layout Components](#layout-components)
6. [Product/Commerce Components](#productcommerce-components)
7. [UI Components (shadcn/ui)](#ui-components-shadncnui)
8. [Hooks](#hooks)

---

## Core Components

### Theme Provider

**File:** `src/components/theme-provider.tsx`

```tsx
"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
```

**Purpose:** Provides theme context (light/dark mode) using next-themes.

---

### Search Modal

**File:** `src/components/search-modal.tsx`

```tsx
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  Package,
  Smartphone,
  Building2,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// ... (full implementation includes PartResultItem, DeviceResultItem, BrandResultItem, EmptyState, InitialState)

export function SearchModal({ open: controlledOpen, onOpenChange }: SearchModalProps) {
  // Implementation handles debounced search across parts, devices, and brands
  // Supports keyboard shortcuts (Cmd/Ctrl+K)
}

export function useSearchModal() {
  // Hook for managing search modal state
}
```

**Purpose:** Global search functionality with support for parts, devices, and brands. Features debounced search, keyboard navigation, and suggestion chips.

---

## Authentication Components

### Login Form

**File:** `src/components/auth/login-form.tsx`

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  callbackUrl?: string;
};

export function LoginForm({ callbackUrl = "/account" }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email, Password inputs and submit button */}
    </form>
  );
}
```

**Purpose:** Handles user authentication with NextAuth credentials provider.

---

### Register Form

**File:** `src/components/auth/register-form.tsx`

```tsx
"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        companyName: formData.get("companyName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      }),
    });

    const data = (await response.json()) as RegisterResponse;

    setLoading(false);

    if (!response.ok || !data.success) {
      setError(data.error?.message ?? "Unable to create account.");
      return;
    }

    router.push("/login?registered=true");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name, Company, Phone, Email, Password, Confirm Password inputs */}
    </form>
  );
}
```

**Purpose:** User registration form with validation for business accounts.

---

### Sign Out Button

**File:** `src/components/auth/sign-out-button.tsx`

```tsx
"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <Button type="button" variant="outline" onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign out
    </Button>
  );
}
```

**Purpose:** Simple button component for user sign-out.

---

## Account Components

### Address Manager

**File:** `src/components/account/address-manager.tsx`

```tsx
"use client"

import { useEffect, useState, type FormEvent } from 'react'
import { Star, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type Address = {
  id: string
  label: string | null
  fullName: string
  line1: string
  line2: string | null
  city: string
  state: string
  postalCode: string
  country: string
  phone: string | null
  isDefault: boolean
}

export function AddressManager() {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(initialForm)

  // CRUD operations for addresses
  // - loadAddresses(): Fetch all addresses
  // - onCreate(): Add new address
  // - onDelete(): Remove address
  // - onSetDefault(): Set default shipping address

  return (
    <div className="space-y-6">
      {/* Address form and address list cards */}
    </div>
  )
}
```

**Purpose:** Manages user saved addresses with full CRUD operations, including setting default addresses.

---

## Checkout Components

### Checkout Form

**File:** `src/components/checkout/checkout-form.tsx`

```tsx
"use client"

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { useSession } from 'next-auth/react'
import { Elements, useElements, useStripe } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { ArrowLeft, CheckCircle2, Lock, LogIn, PlusCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'

import { CheckoutPaymentElement } from '@/components/checkout/payment-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

export function CheckoutForm() {
  // Handles both authenticated and guest checkout
  // Features:
  // - Saved address selection for authenticated users
  // - Inline address forms for guest checkout
  // - Stripe payment integration
  // - Order summary display
  
  return (
    // Shipping & Billing section + Payment section
  )
}
```

**Purpose:** Complete checkout flow supporting both authenticated users (with saved addresses) and guest checkout. Integrates with Stripe for payment processing.

---

### Payment Element

**File:** `src/components/checkout/payment-element.tsx`

```tsx
'use client'

import { PaymentElement } from '@stripe/react-stripe-js'

export function CheckoutPaymentElement() {
  return (
    <div className="rounded-lg border border-yellow-900/30 bg-white p-4">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />
    </div>
  )
}
```

**Purpose:** Stripe Elements payment form wrapper with tabbed layout for card and other payment methods.

---

## Layout Components

### Main Layout

**File:** `src/components/layout/main-layout.tsx`

```tsx
"use client"

import * as React from "react"

import { Header } from "./header"
import { Footer } from "./footer"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1" role="main" id="main-content">
        {children}
      </main>
      <Footer />
    </div>
  )
}
```

**Purpose:** Root layout wrapper providing consistent header/footer structure.

---

### Header

**File:** `src/components/layout/header.tsx`

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import {
  Search, User, ShoppingCart, Menu, Sun, Moon, Command,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { SearchModal } from "@/components/search-modal"

export function Header() {
  // Features:
  // - Logo and branding
  // - Desktop search bar with keyboard shortcut (Cmd+K)
  // - Navigation menu
  // - Theme toggle (light/dark)
  // - Account and cart icons
  // - Mobile responsive menu with sheet
  // - Brand navigation bar
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      {/* Header content */}
    </header>
  )
}
```

**Purpose:** Site header with navigation, search, theme toggle, and mobile responsiveness.

---

### Footer

**File:** `src/components/layout/footer.tsx`

```tsx
"use client"

import * as React from "react"
import Link from "next/link"
import {
  Mail, Phone, Facebook, Youtube, Linkedin, Instagram, ExternalLink,
} from "lucide-react"

import { Separator } from "@/components/ui/separator"

const quickLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/return-policy", label: "Return Policy" },
  { href: "/terms", label: "Terms" },
  { href: "/shipping-info", label: "Shipping Info" },
]

const deviceCategories = [
  { href: "/brand/apple", label: "Apple" },
  { href: "/brand/samsung", label: "Samsung" },
  { href: "/brand/motorola", label: "Motorola" },
  { href: "/brand/google", label: "Google" },
]

const socialLinks = [
  { href: "https://facebook.com/fusioncell", label: "Facebook", icon: Facebook },
  { href: "https://ebay.com/usr/fusioncell", label: "eBay", icon: ExternalLink },
  { href: "https://youtube.com/@fusioncell", label: "YouTube", icon: Youtube },
  { href: "https://linkedin.com/company/fusioncell", label: "LinkedIn", icon: Linkedin },
  { href: "https://instagram.com/fusioncell", label: "Instagram", icon: Instagram },
]

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t" role="contentinfo">
      {/* Four column layout: Company Info, Quick Links, Device Categories, Contact Us */}
    </footer>
  )
}
```

**Purpose:** Site footer with company info, navigation links, contact details, and social media links.

---

## Product/Commerce Components

### Brand Card

**File:** `src/components/brand-card.tsx`

```tsx
"use client"

import * as React from "react"
import { Smartphone, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string | null
  description?: string | null
  deviceCount: number
}

export function BrandCard({ brand, onClick, isSelected = false, className }: BrandCardProps) {
  // Displays brand information with logo/icon, name, description, and device count
  // Includes skeleton version for loading states
}

export function BrandCardSkeleton({ className }: { className?: string }) {
  // Loading skeleton
}
```

**Purpose:** Interactive card component for displaying brand information in lists/grids.

---

### Device Card

**File:** `src/components/device-card.tsx`

```tsx
"use client"

import * as React from "react"
import { Smartphone, ChevronRight, Wrench } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

export function DeviceCard({ device, onClick, isSelected = false, className }: DeviceCardProps) {
  // Displays device with image, name, model number, release year, and parts count badge
  // Includes skeleton version for loading states
}

export function DeviceCardSkeleton({ className }: { className?: string }) {
  // Loading skeleton
}
```

**Purpose:** Card component for displaying device/product information with images and metadata.

---

### Part Card

**File:** `src/components/part-card.tsx`

```tsx
"use client"

import * as React from "react"
import { ShoppingCart, Eye, Package } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

export type StockStatus = "in_stock" | "low_stock" | "out_of_stock"

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
  category?: { id: string; name: string; slug: string; icon?: string | null } | null
  inventory?: { quantity: number; reserved: number; available: number; location?: string | null } | null
}

export function PartCard({ part, onAddToCart, onQuickView, className }: PartCardProps) {
  // Features:
  // - Product image with placeholder
  // - SKU display
  // - Stock status badge (In Stock, Low Stock, Out of Stock)
  // - Quality, category, and color badges
  // - Price with discount display
  // - Featured and discount badges
  // - Quick view button
  // - Add to cart button (disabled when out of stock)
}

export function PartCardSkeleton({ className }: { className?: string }) {
  // Loading skeleton
}
```

**Purpose:** Comprehensive product card for repair parts with inventory status, pricing, and actions.

---

### Device Explorer

**File:** `src/components/device-explorer.tsx`

```tsx
"use client"

import * as React from "react"
import { ChevronLeft, Package, AlertCircle, RefreshCw } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BrandCard, BrandCardSkeleton, type Brand } from "@/components/brand-card"
import { DeviceCard, DeviceCardSkeleton, type Device } from "@/components/device-card"
import { PartCard, PartCardSkeleton, type Part } from "@/components/part-card"

export function DeviceExplorer() {
  // Three-level navigation: Brands → Devices → Parts
  // Features:
  // - Responsive design (mobile accordion, desktop sidebar)
  // - Breadcrumb navigation
  // - Loading skeletons
  // - Error states with retry
  // - Empty states
  // - API integration for fetching brands, devices, and parts
}

export default DeviceExplorer
```

**Purpose:** Main product browsing component with hierarchical navigation through brands, devices, and parts. Fully responsive with different layouts for mobile and desktop.

---

## UI Components (shadcn/ui)

The application uses shadcn/ui components. Below are the key UI components used:

### Button

**File:** `src/components/ui/button.tsx`

```tsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 whitespace-nowrap rounded-md text-label transition-all duration-fast ease-default active:scale-[0.98] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-accent hover:text-accent-foreground",
        outline: "border border-border bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        ghost: "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        highlight: "bg-highlight-soft text-highlight-foreground hover:bg-highlight",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2 has-[>svg]:px-3",
        sm: "h-10 gap-1.5 px-3",
        lg: "h-12 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

function Button({ className, variant, size, asChild = false, ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

export { Button, buttonVariants }
```

**Variants:** default, secondary, outline, ghost, highlight, destructive, link  
**Sizes:** default, sm, lg, icon

---

### Card

**File:** `src/components/ui/card.tsx`

Components: `Card`, `CardHeader`, `CardFooter`, `CardTitle`, `CardAction`, `CardDescription`, `CardContent`

---

### Input

**File:** `src/components/ui/input.tsx`

Standard text input with focus states and accessibility support.

---

### Label

**File:** `src/components/ui/label.tsx`

Form label component using Radix UI Label primitive.

---

### Badge

**File:** `src/components/ui/badge.tsx`

```tsx
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-white",
        outline: "text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  }
)
```

**Variants:** default, secondary, destructive, outline

---

### Separator

**File:** `src/components/ui/separator.tsx`

Horizontal or vertical divider using Radix UI Separator.

---

### Sheet

**File:** `src/components/ui/sheet.tsx`

Components: `Sheet`, `SheetTrigger`, `SheetClose`, `SheetPortal`, `SheetOverlay`, `SheetContent`, `SheetHeader`, `SheetFooter`

**Sides:** top, right, bottom, left

---

### Navigation Menu

**File:** `src/components/ui/navigation-menu.tsx`

Components: `NavigationMenu`, `NavigationMenuList`, `NavigationMenuItem`, `NavigationMenuTrigger`, `NavigationMenuContent`, `NavigationMenuViewport`, `NavigationMenuLink`

Includes `navigationMenuTriggerStyle()` utility for consistent styling.

---

### Command (cmdk)

**File:** `src/components/ui/command.tsx`

Components: `Command`, `CommandDialog`, `CommandInput`, `CommandList`, `CommandEmpty`, `CommandGroup`, `CommandItem`, `CommandSeparator`

Used for search functionality and command palettes.

---

### Accordion

**File:** `src/components/ui/accordion.tsx`

Components: `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`

Used for collapsible sections in mobile views.

---

### Dialog

**File:** `src/components/ui/dialog.tsx`

Components: `Dialog`, `DialogTrigger`, `DialogPortal`, `DialogClose`, `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription`

Modal dialog component using Radix UI Dialog.

---

### Scroll Area

**File:** `src/components/ui/scroll-area.tsx`

Components: `ScrollArea`, `ScrollBar`

Custom styled scrollable area using Radix UI ScrollArea.

---

### Skeleton

**File:** `src/components/ui/skeleton.tsx`

```tsx
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />
}
```

Loading placeholder component.

---

### Breadcrumb

**File:** `src/components/ui/breadcrumb.tsx`

Components: `Breadcrumb`, `BreadcrumbList`, `BreadcrumbItem`, `BreadcrumbLink`, `BreadcrumbPage`, `BreadcrumbSeparator`, `BreadcrumbEllipsis`

Navigation breadcrumb for hierarchical page structure.

---

## Additional UI Components

The following UI components are also available but may have limited usage:

| Component | File |
|-----------|------|
| Alert | `src/components/ui/alert.tsx` |
| Alert Dialog | `src/components/ui/alert-dialog.tsx` |
| Aspect Ratio | `src/components/ui/aspect-ratio.tsx` |
| Avatar | `src/components/ui/avatar.tsx` |
| Calendar | `src/components/ui/calendar.tsx` |
| Carousel | `src/components/ui/carousel.tsx` |
| Chart | `src/components/ui/chart.tsx` |
| Checkbox | `src/components/ui/checkbox.tsx` |
| Collapsible | `src/components/ui/collapsible.tsx` |
| Context Menu | `src/components/ui/context-menu.tsx` |
| Drawer | `src/components/ui/drawer.tsx` |
| Dropdown Menu | `src/components/ui/dropdown-menu.tsx` |
| Form | `src/components/ui/form.tsx` |
| Hover Card | `src/components/ui/hover-card.tsx` |
| Input OTP | `src/components/ui/input-otp.tsx` |
| Menubar | `src/components/ui/menubar.tsx` |
| Pagination | `src/components/ui/pagination.tsx` |
| Popover | `src/components/ui/popover.tsx` |
| Progress | `src/components/ui/progress.tsx` |
| Radio Group | `src/components/ui/radio-group.tsx` |
| Resizable | `src/components/ui/resizable.tsx` |
| Select | `src/components/ui/select.tsx` |
| Sidebar | `src/components/ui/sidebar.tsx` |
| Slider | `src/components/ui/slider.tsx` |
| Sonner (Toast) | `src/components/ui/sonner.tsx` |
| Switch | `src/components/ui/switch.tsx` |
| Table | `src/components/ui/table.tsx` |
| Tabs | `src/components/ui/tabs.tsx` |
| Textarea | `src/components/ui/textarea.tsx` |
| Toast | `src/components/ui/toast.tsx` |
| Toaster | `src/components/ui/toaster.tsx` |
| Toggle | `src/components/ui/toggle.tsx` |
| Toggle Group | `src/components/ui/toggle-group.tsx` |
| Tooltip | `src/components/ui/tooltip.tsx` |

---

## Hooks

### use-mobile

**File:** `src/hooks/use-mobile.ts`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
```

**Purpose:** Detects mobile viewport for responsive rendering.

---

## Technology Stack Summary

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **shadcn/ui** | Component library |
| **Radix UI** | Accessible primitives |
| **Tailwind CSS** | Styling |
| **class-variance-authority** | Component variants |
| **next-themes** | Dark/light mode |
| **next-auth** | Authentication |
| **Stripe** | Payment processing |
| **Lucide React** | Icons |
| **cmdk** | Command palette/search |

---

## Component Architecture

All components follow these patterns:

1. **Client Components**: Marked with `"use client"` directive for interactive features
2. **TypeScript**: Full type definitions for props and data structures
3. **Accessibility**: ARIA attributes, keyboard navigation, focus management
4. **Responsive Design**: Mobile-first approach with conditional rendering
5. **Loading States**: Skeleton loaders for async data
6. **Error Handling**: Error states with retry mechanisms
7. **Composition**: Small, reusable components composed into larger features

---

*Document generated for FusionCell e-commerce platform.*
