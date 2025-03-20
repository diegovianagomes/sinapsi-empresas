import { createClient } from "@supabase/supabase-js"

// Cliente Supabase com a chave de serviço para operações administrativas
export const getSupabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Supabase URL e chave de serviço são necessárias")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}

