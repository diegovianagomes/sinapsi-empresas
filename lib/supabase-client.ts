import { createClient } from "@supabase/supabase-js"

// Singleton pattern para o cliente Supabase
let supabaseClient: ReturnType<typeof createClient> | null = null

export const getSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL e chave anônima são necessárias")
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}

