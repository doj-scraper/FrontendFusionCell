import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const resolveDatabaseUrl = () =>
  process.env.DIRECT_URL ??
  process.env.DATABASE_URL ??
  process.env.PRISMA_DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/fusioncell";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
