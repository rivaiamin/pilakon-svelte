/// <reference types="@sveltejs/kit" />

declare namespace App {
	interface Locals {
		supabase: import('@supabase/supabase-js').SupabaseClient;
		getSession: () => Promise<import('@supabase/auth-js').Session | null>;
	}
	interface PageData {
		session: import('@supabase/auth-js').Session | null;
	}
	// interface Error {}
	// interface Platform {}
}

declare module '$env/static/public' {
	export const PUBLIC_SUPABASE_URL: string;
	export const PUBLIC_SUPABASE_ANON_KEY: string;
}
