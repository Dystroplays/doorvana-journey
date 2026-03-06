import { drizzle } from 'drizzle-orm/vercel-postgres';
import { sql } from '@vercel/postgres';
import * as schema from './schema';

/**
 * Database client instance
 * Note: @vercel/postgres is deprecated. Consider migrating to @neondatabase/serverless
 * See: https://neon.com/docs/guides/vercel-postgres-transition-guide
 */
export const db = drizzle(sql, { schema });

export { sql };
