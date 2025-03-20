import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { resetType } = await request.json()
    const supabase = getSupabaseAdmin()

    if (resetType === "emails") {
      // Resetar apenas os emails
      const { error } = await supabase.from("used_emails").delete().neq("id", "00000000-0000-0000-0000-000000000000") // Condição para deletar todos

      if (error) {
        console.error("Erro ao resetar emails:", error)
        return NextResponse.json(
          {
            success: false,
            message: "Erro ao resetar emails",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Emails resetados com sucesso",
      })
    } else if (resetType === "all") {
      // Resetar tudo (emails e respostas)
      const { error: emailsError } = await supabase
        .from("used_emails")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (emailsError) {
        console.error("Erro ao resetar emails:", emailsError)
        return NextResponse.json(
          {
            success: false,
            message: "Erro ao resetar emails",
          },
          { status: 500 },
        )
      }

      const { error: responsesError } = await supabase
        .from("survey_responses")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000")

      if (responsesError) {
        console.error("Erro ao resetar respostas:", responsesError)
        return NextResponse.json(
          {
            success: false,
            message: "Erro ao resetar respostas",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({
        success: true,
        message: "Todos os dados resetados com sucesso",
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Tipo de reset inválido",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}

