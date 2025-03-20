"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"

export function SurveyStats() {
  const [stats, setStats] = useState({
    emailCount: 0,
    responseCount: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isResetting, setIsResetting] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/survey/responses")

      if (!response.ok) {
        throw new Error("Erro ao buscar estatísticas")
      }

      const data = await response.json()

      setStats({
        emailCount: data.emailCount || 0,
        responseCount: data.responses?.length || 0,
      })
    } catch (error) {
      console.error("Erro ao buscar estatísticas:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar as estatísticas da pesquisa.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetAll = async () => {
    if (
      !confirm("ATENÇÃO: Tem certeza que deseja limpar TODOS os dados da pesquisa? Esta ação não pode ser desfeita.")
    ) {
      return
    }

    setIsResetting(true)

    try {
      const response = await fetch("/api/admin/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetType: "all" }),
      })

      if (!response.ok) {
        throw new Error("Erro ao resetar dados")
      }

      toast({
        title: "Dados resetados",
        description: "Todos os dados da pesquisa foram removidos com sucesso.",
      })

      // Atualizar estatísticas
      fetchStats()
    } catch (error) {
      console.error("Erro ao resetar dados:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao resetar os dados da pesquisa.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estatísticas da Pesquisa</CardTitle>
        <CardDescription>Resumo dos dados coletados</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>Carregando estatísticas...</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Emails Registrados</p>
                <p className="text-2xl font-bold">{stats.emailCount}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Respostas Coletadas</p>
                <p className="text-2xl font-bold">{stats.responseCount}</p>
              </div>
            </div>

            <div className="pt-4">
              <Button variant="destructive" onClick={handleResetAll} disabled={isResetting}>
                {isResetting ? "Processando..." : "Resetar Todos os Dados"}
              </Button>
              <p className="mt-2 text-sm text-muted-foreground">
                Atenção: Esta ação irá remover permanentemente todos os emails e respostas da pesquisa.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

