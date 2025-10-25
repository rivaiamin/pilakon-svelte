import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

// Supabase client for auth, storage, real-time
export const supabase = createClient(
  PUBLIC_SUPABASE_URL,
  PUBLIC_SUPABASE_ANON_KEY
);

// Drizzle for database (via Session Pooler - future-proof)
const connectionString = env.SUPABASE_DATABASE_URL || env.DATABASE_URL;
if (!connectionString) {
  throw new Error('Missing SUPABASE_DATABASE_URL or DATABASE_URL');
}
export const db = drizzle(postgres(connectionString), { schema });

// Export schema
export * from './schema';
