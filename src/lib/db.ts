import { neon } from '@neondatabase/serverless';

// Direct Neon HTTP client — bypasses Prisma adapter for public read queries.
// Uses DATABASE_URL from environment (same as Prisma).
export const sql = neon(process.env.DATABASE_URL!);
