// Supabase Edge Function: search
// Vector similarity search with OpenAI embeddings

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, filters } = await req.json()

    // If no query text, do filter-only browse mode (no embedding needed)
    if (!query || query.trim() === '') {
      return browseMode(filters)
    }

    // 1. Generate embedding for the search query using OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OPENAI_API_KEY not configured')
    }

    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: query,
      }),
    })

    if (!embeddingResponse.ok) {
      const error = await embeddingResponse.text()
      throw new Error(`OpenAI embedding failed: ${error}`)
    }

    const embeddingData = await embeddingResponse.json()
    const queryEmbedding = embeddingData.data[0].embedding

    // 2. Call search_providers RPC function
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data, error } = await supabase.rpc('search_providers', {
      query_embedding: queryEmbedding,
      match_count: filters?.limit || 100,
      filter_use_case: filters?.useCase || null,
      filter_business_function: filters?.businessFunction || null,
      filter_industry: filters?.industry || null,
      filter_region: filters?.region || null,
      filter_country: filters?.country || null,
    })

    if (error) {
      throw error
    }

    // 3. If too few results and filters are active, suggest relaxing filters
    const shouldRelaxFilters = data.length < 5 && (
      filters?.useCase || filters?.businessFunction || filters?.industry
    )

    return new Response(
      JSON.stringify({
        results: data,
        count: data.length,
        query,
        filters,
        suggestRelaxFilters: shouldRelaxFilters,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})

// Browse mode: filter-only without vector search (for dropdown-only filtering)
async function browseMode(filters: any) {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const supabase = createClient(supabaseUrl, supabaseKey)

  let query = supabase.from('leads_all').select('*')

  // Apply filters
  if (filters?.useCase) {
    query = query.contains('use_cases', [filters.useCase])
  }
  if (filters?.businessFunction) {
    query = query.contains('business_functions', [filters.businessFunction])
  }
  if (filters?.industry) {
    query = query.contains('industries_served', [filters.industry])
  }
  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  if (filters?.country) {
    query = query.ilike('country', `%${filters.country}%`)
  }

  query = query.limit(filters?.limit || 50)

  const { data, error } = await query

  if (error) {
    throw error
  }

  return new Response(
    JSON.stringify({
      results: data,
      count: data.length,
      mode: 'browse',
      filters,
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    },
  )
}
