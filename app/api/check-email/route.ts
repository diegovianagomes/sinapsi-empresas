import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Verificar se o email já foi usado
    const { data, error } = await supabase
      .from("used_emails")
      .select("email")
      .eq("email", email.toLowerCase())
      .maybeSingle()

    if (error) {
      console.error("Erro ao verificar email:", error)
      return NextResponse.json({ error: "Erro ao verificar email" }, { status: 500 })
    }

    return NextResponse.json({
      isUsed: !!data,
      message: data ? "Email já utilizado" : "Email disponível",
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

