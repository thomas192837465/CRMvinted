import { createBrowserClient } from '@supabase/ssr'
// On remplace @/ par ../../ pour remonter les dossiers
import type { Database } from '../../types/database' 

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
