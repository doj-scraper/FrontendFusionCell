# FusionCell - Wholesale Cell Phone Repair Parts

A modern e-commerce platform for wholesale cell phone repair parts, built with Next.js 16, TypeScript, and PostgreSQL.

## 🚀 Overview

FusionCell is a B2B wholesale distributor platform for cell phone repair parts. It provides repair shops and technicians with access to quality parts for iPhone, Samsung, Motorola, and Google Pixel devices.

### Key Features

- **Device Catalog**: Browse parts by brand and device (iPhone 11-17, Samsung Galaxy, Motorola, Google Pixel)
- **Parts Inventory**: Real-time inventory tracking with SKU, MOQ, and warehouse locations
- **Search**: Full-text search across parts, devices, and brands (CMD+K shortcut)
- **Responsive Design**: Mobile-first design with light/dark mode support
- **Accessibility**: WCAG AA compliant with full keyboard navigation

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Database | PostgreSQL (Neon) |
| ORM | Prisma 6 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| State | Zustand + TanStack Query |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |
| Theme | next-themes |
| Runtime | Bun |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (REST endpoints)
│   ├── about/             # About page
│   ├── account/           # Account/login page (placeholder)
│   ├── brand/[slug]/      # Brand device listing (dynamic)
│   ├── cart/              # Shopping cart (placeholder)
│   ├── checkout/          # Checkout flow (placeholder)
│   ├── contact/           # Contact form page
│   ├── device/[slug]/     # Device parts listing (dynamic)
│   ├── return-policy/     # Return policy page
│   ├── search/            # Search results page
│   ├── terms/             # Terms & conditions page
│   ├── globals.css        # Global styles + CSS variables
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/
│   ├── layout/            # Header, Footer, MainLayout
│   ├── ui/                # shadcn/ui components
│   ├── brand-card.tsx     # Brand display card
│   ├── device-card.tsx    # Device display card
│   ├── device-explorer.tsx # File explorer navigation
│   ├── part-card.tsx      # Part display card
│   ├── search-modal.tsx   # Command palette search
│   └── theme-provider.tsx # Theme context provider
├── hooks/
│   ├── use-mobile.ts      # Mobile detection hook
│   └── use-toast.ts       # Toast notifications hook
└── lib/
    ├── db.ts              # Prisma client singleton
    └── utils.ts           # Utility functions

prisma/
├── schema.prisma          # Database schema (PostgreSQL)
└── seed.ts                # Database seeding script
```

## 🗄️ Database Schema

### Core Models

```
Brand (Apple, Samsung, Motorola, Google)
  └── Device (iPhone 13 Pro, Galaxy S24, etc.)
        └── Part (Screen, Battery, Charging Port, etc.)
              └── Inventory (quantity, location, reorder point)
```

### Part Categories
- Screens & LCD
- Batteries
- Charging Ports
- Rear Glass
- Cameras
- Buttons & Flex
- Speakers & Audio
- Small Parts

## 🚀 Getting Started

### Prerequisites

- Bun (recommended) or Node.js 18+
- PostgreSQL database (Neon, Supabase, Railway, etc.)

### Installation

1. **Clone and install dependencies**

```bash
bun install
```

2. **Set up environment variables**

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your database credentials
# DATABASE_URL is REQUIRED - the app will not run without it
```

3. **Set up the database**

```bash
# Generate Prisma client
bun run db:generate

# Push schema to PostgreSQL
bun run db:push

# Seed database with sample data
bun run db:seed
```

4. **Start development server**

```bash
bun run dev
```

### Environment Variables

Create a `.env` file with the following **required** variables:

```env
# REQUIRED - PostgreSQL connection string
DATABASE_URL="postgresql://username:password@host:5432/database?sslmode=require"

# REQUIRED - NextAuth configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
```

> ⚠️ **Important**: The app requires a valid PostgreSQL `DATABASE_URL`. API endpoints will fail at runtime without it.

### Getting a PostgreSQL Database

Free options for development:

| Provider | Free Tier | URL |
|----------|-----------|-----|
| Neon | 0.5GB | [neon.tech](https://neon.tech) |
| Supabase | 500MB | [supabase.com](https://supabase.com) |
| Railway | $5 credit/mo | [railway.app](https://railway.app) |

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/brands` | GET | List all brands with device counts |
| `/api/brands/[slug]` | GET | Get brand with all devices |
| `/api/devices/[slug]` | GET | Get device with all parts |
| `/api/parts` | GET | List parts (paginated, filterable) |
| `/api/parts/[sku]` | GET | Get part by SKU |
| `/api/search` | GET | Search across parts, devices, brands |
| `/api/categories` | GET | List all part categories |
| `/api/contact` | POST | Submit contact form |

### Query Parameters

**`/api/parts`**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `deviceId` - Filter by device
- `categoryId` - Filter by category
- `brandId` - Filter by brand
- `quality` - Filter by quality (OEM, Aftermarket, Premium)
- `inStock` - Filter by stock status
- `featured` - Filter featured parts

**`/api/search`**
- `q` - Search query (required, min 2 chars)
- `type` - Filter type (parts, devices, brands)
- `limit` - Max results (default: 10)

## 🎨 Design System

### Colors
- **Primary**: Teal/Emerald (`oklch(0.45 0.14 170)`)
- **Background**: White (light) / Charcoal (dark)
- WCAG AA compliant contrast ratios

### Typography
- Sans: Geist
- Mono: Geist Mono

### Components
All UI components are from shadcn/ui (New York style) located in `src/components/ui/`.

## 🔧 Scripts

```bash
bun run dev         # Start development server
bun run build       # Build for production
bun run lint        # Run ESLint
bun run db:generate # Generate Prisma client
bun run db:push     # Push schema to database
bun run db:seed     # Seed database with sample data
bun run db:studio   # Open Prisma Studio GUI
bun run db:migrate  # Run migrations
```

## 📝 Current Status

### ✅ Implemented
- Full device catalog (iPhone 11-17, Samsung, Motorola, Google Pixel)
- Parts inventory with SKUs and MOQ
- Device explorer navigation
- Search functionality
- Contact form
- About, Terms, Return Policy pages
- Responsive design
- Light/dark theme
- Accessibility (ARIA, keyboard navigation)
- PostgreSQL database (Neon)

### 🚧 Placeholders (Ready for Implementation)
- User authentication (NextAuth.js available)
- Shopping cart functionality
- Checkout flow
- Payment processing
- Order management
- Email notifications

## 🔐 Security Notes

- All forms use CSRF protection via Next.js
- Input validation with Zod schemas
- SQL injection prevention via Prisma
- XSS prevention via React's built-in escaping
- **Always rotate database credentials after setup**

## 📄 License

Proprietary - FusionCell Wholesale

## 🤝 Support

- Email: sales@fusioncell.com
- Phone: 1-800-FUSION-1
- Address: 1400 Market Street, Tomball, TX 77375
