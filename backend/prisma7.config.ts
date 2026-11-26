import { defineConfig } from 'prisma/config'

// The Prisma CLI doesn't read .env by itself. CI and Docker pass DATABASE_URL directly.
try {
  process.loadEnvFile()
} catch {
  // No .env file.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  // process.env rather than env(), so `prisma generate` works without a database URL.
  datasource: { url: process.env.DATABASE_URL ?? '' },
})
