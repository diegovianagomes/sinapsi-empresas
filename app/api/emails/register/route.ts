import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 })
    }

    const supabase = getSupabaseAdmin()

    // Registrar o email como usado
    const { error } = await supabase.from("used_emails").insert({ email: email.toLowerCase() })

    if (error) {
      // Se o erro for de unicidade, significa que o email já foi usado
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: "Este email já foi utilizado para responder à pesquisa.",
          },
          { status: 409 },
        )
      }

      console.error("Erro ao registrar email:", error)
      return NextResponse.json(
        {
          success: false,
          message: "Erro ao registrar email",
        },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: "Email registrado com sucesso",
    })
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

