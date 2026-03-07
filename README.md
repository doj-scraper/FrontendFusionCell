# FusionCell

FusionCell is a B2B parts catalog for wholesale mobile repair components. It is built with Next.js App Router, TypeScript, Tailwind CSS, and Prisma against PostgreSQL/Neon.

## Stack

- Next.js 16 + React 19
- TypeScript 5
- Prisma 6 + `@prisma/client`
- PostgreSQL (Neon-compatible)
- Tailwind CSS 4 + shadcn/ui

## Local setup (npm only)

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

3. Set up Prisma client and database schema:

```bash
npx prisma generate
npx prisma db push
```

4. (Optional) Seed sample catalog data:

```bash
npm run db:seed
```

5. Start development server:

```bash
npm run dev
```

## Production-oriented commands

```bash
npm run build
npm run start
npm run lint
```

## Prisma commands

```bash
npx prisma generate
npx prisma db push
npx prisma migrate dev
npx prisma studio
npm run db:seed
```

## Required environment variables

- `DATABASE_URL` — app/runtime Prisma connection URL.
- `DIRECT_URL` — direct Postgres URL for Prisma CLI operations (recommended for Neon non-pooled endpoint).
- `NEXTAUTH_URL` — base app URL.
- `NEXTAUTH_SECRET` — secret for NextAuth session/JWT encryption.

## Prisma notes (Postgres/Neon)

The active schema is `prisma/schema.prisma` and uses:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

If your provider does not require a separate direct URL, you can set `DIRECT_URL` equal to `DATABASE_URL`.

## Scripts

- `npm run dev` — start dev server.
- `npm run build` — build production bundle.
- `npm run start` — serve production build.
- `npm run lint` — run ESLint.
- `npm run db:generate` — generate Prisma client.
- `npm run db:push` — push schema to DB.
- `npm run db:migrate` — run/create migrations.
- `npm run db:seed` — seed sample data.
- `npm run db:studio` — open Prisma Studio.
