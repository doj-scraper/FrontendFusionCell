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


## Vercel deployment checklist

1. Push this repo to GitHub/GitLab/Bitbucket and import it into Vercel.
2. In **Project Settings → Environment Variables**, set:
   - `DATABASE_URL` = Neon **pooled** connection string (runtime app traffic).
   - `DIRECT_URL` = Neon **direct** (non-pooled) connection string for Prisma CLI.
   - `NEXTAUTH_URL` = your Vercel production URL (for example `https://your-project.vercel.app`).
   - `NEXTAUTH_SECRET` = a long random secret (for example from `openssl rand -base64 32`).
3. In Vercel **Build & Output Settings**, keep:
   - Install Command: `npm install`
   - Build Command: `npm run build`
   - Output Directory: default (leave empty for Next.js)
4. Redeploy after updating any environment variables.

### Optional post-deploy DB sync

Run schema sync from a trusted environment (local machine or CI) using the same env values:

```bash
npm run db:generate
npm run db:push
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
