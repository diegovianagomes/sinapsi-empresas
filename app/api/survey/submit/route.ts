import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { period, responses } = await request.json()

    if (!period || !responses) {
      return NextResponse.json(
        {
          success: false,
          message: "Período e respostas são obrigatórios",
        },
        { status: 400 },
      )
    }

    const supabase = getSupabaseAdmin()

    // Salvar a resposta da pesquisa
    const { error } = await supabase.from("survey_responses").insert({
      period,
      responses: responses,
    })

    if (error) {
      console.error("Erro ao salvar resposta:", error)
      return NextResponse.json(
        {
          success: false,
          message: `Erro ao salvar resposta: ${error.message}`,
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Resposta salva com sucesso",
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json(
      {
        success: false,
        message: `Erro interno do servidor: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      },
      { status: 500 },
    )
  }
}

