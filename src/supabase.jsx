import { createClient } from "@supabase/supabase-js";

/**
 * The URL of the Supabase API endpoint.
 *
 * @type {string}
 */
// eslint-disable-next-line react-refresh/only-export-components
const supabaseURL = "https://fcfjszkwzawiinbdnlto.supabase.co";

/**
 * The anonymous access key for authentication with Supabase.
 *
 * @type {string}
 */
const ANON_KEY =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZjZmpzemt3emF3aWluYmRubHRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk4NDA4OTIsImV4cCI6MjAwNTQxNjg5Mn0.fQv3Pge08afFFreuI5LJFkXg_CYAESPKpJUE84KH_Os";

/**
 * Supabase client instance used for communication with the Supabase API.
 *
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseURL, ANON_KEY);
