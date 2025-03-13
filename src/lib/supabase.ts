import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate URL before creating client
if (!supabaseUrl || !isValidUrl(supabaseUrl)) {
  throw new Error('Invalid or missing VITE_SUPABASE_URL')
}

if (!supabaseKey) {
  throw new Error('Missing VITE_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
})

function isValidUrl(string: string) {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export type { SupabaseClient } from '@supabase/supabase-js';
