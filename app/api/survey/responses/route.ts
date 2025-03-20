import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function GET() {
  try {
    const supabase = getSupabaseAdmin()

    // Buscar todas as respostas da pesquisa
    const { data: responses, error: responsesError } = await supabase
      .from("survey_responses")
      .select("*")
      .order("created_at", { ascending: false })

    if (responsesError) {
      console.error("Erro ao buscar respostas:", responsesError)
      return NextResponse.json({ error: "Erro ao buscar respostas" }, { status: 500 })
    }

    // Buscar contagem de emails usados
    const { count, error: emailsError } = await supabase.from("used_emails").select("*", { count: "exact", head: true })

    if (emailsError) {
      console.error("Erro ao contar emails:", emailsError)
      return NextResponse.json({ error: "Erro ao contar emails" }, { status: 500 })
    }

    return NextResponse.json({
      responses: responses || [],
      emailCount: count || 0,
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

