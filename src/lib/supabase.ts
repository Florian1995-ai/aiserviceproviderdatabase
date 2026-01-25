import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Read-only search function - searches across multiple text fields
export async function searchProviders(query: string, limit = 20) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .or(`company_name.ilike.%${query}%,description.ilike.%${query}%,business_type.ilike.%${query}%,region.ilike.%${query}%`)
    .limit(limit)

  if (error) {
    console.error('Search error:', error)
    return []
  }

  return data
}

// Get all providers (with limit)
export async function getAllProviders(limit = 50) {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .limit(limit)

  if (error) {
    console.error('Fetch error:', error)
    return []
  }

  return data
}
