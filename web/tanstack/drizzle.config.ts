import { Config, defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  dialect: "postgresql",
  schema: "./app/lib/db/schema.ts",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config);
