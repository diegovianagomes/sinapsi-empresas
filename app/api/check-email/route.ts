import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { compareEmailWithHash } from "@/lib/utils/email-crypto"

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

    if (error) {
      console.error("Erro ao verificar email:", error)
      return NextResponse.json({ error: "Erro ao verificar email" }, { status: 500 })
    }

    // Verifica se o email termina com @sounilavras.com
    if (!email.toLowerCase().endsWith("@souunilavras.com")) {
      return NextResponse.json({
        isUsed: false,
        message: "Email inválido. Use um email @souunilavras.com"
      })
    }

    // Verifica se o email já foi usado comparando com os hashes armazenados
    let isUsed = false
    for (const record of data || []) {
      if (await compareEmailWithHash(email, record.email)) {
        isUsed = true
        break
      }
    }

    return NextResponse.json({
      isUsed: isUsed,
      message: isUsed ? "Email já utilizado" : "Email disponível",
    })
  } catch (error) {
    console.error("Erro ao processar requisição:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

