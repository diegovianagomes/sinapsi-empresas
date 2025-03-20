"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function StudentAuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [period, setPeriod] = useState("")
  const [errors, setErrors] = useState<{ email?: string; period?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset errors
    setErrors({})

    // Validate inputs
    const newErrors: { email?: string; period?: string } = {}

    if (!email) {
      newErrors.email = "O email é obrigatório"
    } else if (!validateEmail(email)) {
      newErrors.email = "Por favor, insira um email válido"
    }

    if (!period) {
      newErrors.period = "O período é obrigatório"
    }

    // If there are errors, show them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)

    try {
      // Verificar se o email já foi usado
      const checkResponse = await fetch("/api/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const checkData = await checkResponse.json()

      if (checkData.isUsed) {
        toast({
          title: "E-mail já tá em uso!",
          description: "Ops, esse e-mail já participou do estudo.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Registrar o email como usado
      const registerResponse = await fetch("/api/register-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const registerData = await registerResponse.json()

      if (!registerResponse.ok) {
        toast({
          title: "Erro",
          description: registerData.message || "Ops, deu ruim no registro do e-mail! Tenta de novo?",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Store student period in session storage (not the email)
      sessionStorage.setItem("studentPeriod", period)
      sessionStorage.setItem("studentAuthenticated", "true")

      // Redirect to survey
      router.push("/survey")
    } catch (error) {
      console.error("Erro ao processar autenticação:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Acesso ao Estudo</CardTitle>
          <CardDescription>
            Por favor, informe seu e-mail e o seu período para prosseguir. Apenas o período será registrado para análise e cada e-mail poderá ser utilizado apenas uma vez.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email Institucional</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                  placeholder="oscarniemeyer@souunilavras.com"
                />
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              <div className="grid gap-2">
                <Label htmlFor="period">Período</Label>
                <Select value={period} onValueChange={setPeriod}>
                  <SelectTrigger id="period" className={errors.period ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecione seu período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1º Período</SelectItem>
                    <SelectItem value="2">2º Período</SelectItem>
                    <SelectItem value="3">3º Período</SelectItem>
                    <SelectItem value="4">4º Período</SelectItem>
                    <SelectItem value="5">5º Período</SelectItem>
                    <SelectItem value="6">6º Período</SelectItem>
                    <SelectItem value="7">7º Período</SelectItem>
                    <SelectItem value="8">8º Período</SelectItem>
                    <SelectItem value="9">9º Período</SelectItem>
                    <SelectItem value="10">10º Período</SelectItem>
                  </SelectContent>
                </Select>
                {errors.period && <p className="text-sm text-red-500">{errors.period}</p>}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Verificando..." : "Continuar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  )
}

