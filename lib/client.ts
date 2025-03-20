import { createClient } from "@supabase/supabase-js"

// Singleton pattern para o cliente Supabase no lado do cliente
let supabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase URL e chave anônima são necessárias")
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

