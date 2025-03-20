"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

export function EmailCheckForm() {
  const [email, setEmail] = useState("")
  const [isChecking, setIsChecking] = useState(false)

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Erro",
        description: "Por favor, informe um email",
        variant: "destructive",
      })
      return
    }

    setIsChecking(true)

    try {
      const response = await fetch("/api/emails/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (data.isUsed) {
        toast({
          title: "Email já utilizado",
          description: "Este email já foi utilizado para responder à pesquisa.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Email disponível",
          description: "Este email pode ser utilizado para responder à pesquisa.",
        })
      }
    } catch (error) {
      console.error("Erro ao verificar email:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao verificar o email. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsChecking(false)
    }
  }

  return (
    <form onSubmit={handleCheck} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu.email@exemplo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isChecking}>
        {isChecking ? "Verificando..." : "Verificar Email"}
      </Button>
    </form>
  )
}

