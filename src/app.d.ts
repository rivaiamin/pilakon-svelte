/// <reference types="@sveltejs/kit" />
declare global {
	namespace App {
		interface Locals {
      supabase: import('@supabase/supabase-js').SupabaseClient;
      getSession: () => Promise<import('@supabase/supabase-js').Session | null>;
    }
		// interface Error {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};