"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function ExampleSubmitPage() {
  const [email, setEmail] = useState("")
  const [period, setPeriod] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !period) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Verificar se o email já foi usado
      const checkResponse = await fetch("/api/emails/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      if (checkData.isUsed) {
        toast({
          title: "Email já utilizado",
          description: "Este email já foi utilizado para responder à pesquisa.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // 2. Registrar o email
      const registerResponse = await fetch("/api/emails/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!registerResponse.ok) {
        const registerData = await registerResponse.json()
        throw new Error(registerData.message || "Erro ao registrar email")
      }

      // 3. Enviar uma resposta de exemplo
      const exampleResponses = {
        q1: "4",
        q2: "2",
        q3: "3",
        q4: "1",
        q5: "2",
        // Adicione mais respostas conforme necessário
      }

      const submitResponse = await fetch("/api/survey/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          period,
          responses: exampleResponses,
        }),
      })

      if (!submitResponse.ok) {
        const submitData = await submitResponse.json()
        throw new Error(submitData.message || "Erro ao enviar resposta")
      }

      toast({
        title: "Sucesso!",
        description: "Resposta de exemplo enviada com sucesso.",
      })

      // Limpar formulário
      setEmail("")
      setPeriod("")
    } catch (error) {
      console.error("Erro:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Enviar Resposta de Exemplo</CardTitle>
          <CardDescription>Este formulário demonstra como enviar uma resposta para o Supabase</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Selecione um período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1º Período</SelectItem>
                  <SelectItem value="2">2º Período</SelectItem>
                  <SelectItem value="3">3º Período</SelectItem>
                  <SelectItem value="4">4º Período</SelectItem>
                  <SelectItem value="5">5º Período</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Enviando..." : "Enviar Resposta de Exemplo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  )
}

