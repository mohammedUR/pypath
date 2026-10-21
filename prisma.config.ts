// Prisma CLI config (Prisma ORM v7): connection URL + migrations location
// moved out of schema.prisma into this file. Loaded by every `prisma` command.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Migrations must NOT go through a transaction-mode pooler (Neon's pooled
    // endpoint breaks per-session state the migrate engine relies on), so the
    // CLI prefers DIRECT_URL when present. Runtime uses DATABASE_URL through
    // the pg driver adapter (see src/lib/db.ts) and needs no DIRECT_URL.
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"] ?? "",
  },
});
