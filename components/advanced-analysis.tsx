"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Função para exportar dados para Excel (simplificada)
const exportToExcel = (data: any[], fileName: string) => {
  try {
    // Converter dados para CSV
    const headers = Object.keys(data[0]).join(",")
    const rows = data.map((row) => Object.values(row).join(","))
    const csv = [headers, ...rows].join("\n")

    // Criar blob e link para download
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `${fileName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error)
    toast({
      title: "Erro",
      description: "Ocorreu um erro ao exportar os dados.",
      variant: "destructive",
    })
  }
}

// Função para preparar dados para exportação
const prepareDataForExcel = (responses: any[]) => {
  return responses.map((response) => {
    const { id, created_at, period, responses: responseData } = response

    // Criar um objeto plano com todas as informações
    return {
      ID: id,
      Período: period,
      "Data de Criação": new Date(created_at).toLocaleString("pt-BR"),
      // Adicionar todas as respostas como colunas separadas
      ...Object.entries(responseData || {}).reduce(
        (acc, [key, value]) => {
          acc[`Questão ${key.substring(1)}`] = value
          return acc
        },
        {} as Record<string, any>,
      ),
    }
  })
}

// Função para preparar dados de análise
const prepareAnalysisForExcel = (chartData: Record<string, any[]>) => {
  const result: any[] = []

  Object.entries(chartData).forEach(([blockId, questions]) => {
    questions.forEach((question) => {
      result.push({
        Bloco: blockId.replace("bloco", "Bloco "),
        Questão: question.questionNumber,
        "Texto da Questão": question.question,
        "Discordo Totalmente": question["Discordo Totalmente"],
        Discordo: question["Discordo"],
        Concordo: question["Concordo"],
        "Concordo Totalmente": question["Concordo Totalmente"],
      })
    })
  })

  return result
}

interface AdvancedAnalysisProps {
  responses: any[]
  chartData: Record<string, any[]>
}

export function AdvancedAnalysis({ responses, chartData }: AdvancedAnalysisProps) {
  const [aggregatedData, setAggregatedData] = useState<any[]>([])
  const [questionData, setQuestionData] = useState<Record<string, any[]>>({})

  useEffect(() => {
    if (responses.length > 0 && Object.keys(chartData).length > 0) {
      processAggregatedData()
      processQuestionData()
    }
  }, [responses, chartData])

  const processAggregatedData = () => {
    // Calcular totais por opção de resposta
    const totals = {
      "Discordo Totalmente": 0,
      Discordo: 0,
      Concordo: 0,
      "Concordo Totalmente": 0,
    }

    // Percorrer todos os blocos e questões
    Object.values(chartData).forEach((questions) => {
      questions.forEach((question) => {
        totals["Discordo Totalmente"] += question["Discordo Totalmente"] || 0
        totals["Discordo"] += question["Discordo"] || 0
        totals["Concordo"] += question["Concordo"] || 0
        totals["Concordo Totalmente"] += question["Concordo Totalmente"] || 0
      })
    })

    // Converter para formato de gráfico
    const data = Object.entries(totals).map(([name, value]) => ({ name, value }))
    setAggregatedData(data)
  }

  const processQuestionData = () => {
    const result: Record<string, any[]> = {}

    // Para cada bloco
    Object.entries(chartData).forEach(([blockId, questions]) => {
      // Para cada questão
      questions.forEach((question) => {
        const data = [
          { name: "Discordo Totalmente", value: question["Discordo Totalmente"] || 0 },
          { name: "Discordo", value: question["Discordo"] || 0 },
          { name: "Concordo", value: question["Concordo"] || 0 },
          { name: "Concordo Totalmente", value: question["Concordo Totalmente"] || 0 },
        ]

        const key = `${blockId}-q${question.questionNumber}`
        result[key] = data
      })
    })

    setQuestionData(result)
  }

  const handleExportRawData = () => {
    try {
      const data = prepareDataForExcel(responses)
      exportToExcel(data, "Pesquisa_Dados_Brutos")
      toast({
        title: "Exportação concluída",
        description: "Os dados brutos foram exportados com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao exportar dados brutos:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive",
      })
    }
  }

  const handleExportAnalysis = () => {
    try {
      const data = prepareAnalysisForExcel(chartData)
      exportToExcel(data, "Pesquisa_Análise")
      toast({
        title: "Exportação concluída",
        description: "Os dados de análise foram exportados com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao exportar análise:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao exportar os dados.",
        variant: "destructive",
      })
    }
  }

  const chartColors = [
    "#ef4444", // Vermelho (Discordo Totalmente)
    "#f97316", // Laranja (Discordo)
    "#22c55e", // Verde (Concordo)
    "#0ea5e9", // Azul (Concordo Totalmente)
  ]

  const renderCustomPieLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null
  }

  // Verificar se temos dados para exibir
  if (responses.length === 0 || Object.keys(chartData).length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Análise Avançada</CardTitle>
          <CardDescription>Sem dados disponíveis para análise</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Não há dados suficientes para exibir análises avançadas.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Análise Avançada</CardTitle>
        <CardDescription>Visualizações e análises detalhadas dos dados coletados</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            <h3 className="text-lg font-semibold">Exportar Dados</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={handleExportRawData}>
                Exportar Dados Brutos (CSV)
              </Button>
              <Button variant="outline" onClick={handleExportAnalysis}>
                Exportar Análise (CSV)
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza - Distribuição Geral */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição Geral das Respostas</CardTitle>
                <CardDescription>Visão geral de todas as respostas da pesquisa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={aggregatedData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomPieLabel}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {aggregatedData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [value, ""]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Gráfico de Barras Vertical - Contagem de Respostas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contagem de Respostas por Opção</CardTitle>
                <CardDescription>Total de respostas para cada opção</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={aggregatedData}
                      layout="vertical"
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={150} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Quantidade" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Análise por Questão</h3>

            <Tabs defaultValue={Object.keys(questionData)[0] || ""}>
              <TabsList className="flex flex-wrap">
                {Object.keys(questionData).map((key) => (
                  <TabsTrigger key={key} value={key} className="text-xs">
                    {key.replace("-", " ").toUpperCase()}
                  </TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(questionData).map(([key, data]) => {
                const [blockId, questionId] = key.split("-")
                const block = chartData[blockId]
                const question = block?.find((q) => `q${q.questionNumber}` === questionId)

                return (
                  <TabsContent key={key} value={key}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Gráfico de Pizza por Questão */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{`${questionId.toUpperCase()}: Distribuição`}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">{question?.question || ""}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={data}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  label={renderCustomPieLabel}
                                  outerRadius={120}
                                  fill="#8884d8"
                                  dataKey="value"
                                >
                                  {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => [value, ""]} />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Gráfico de Barras Vertical por Questão */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">{`${questionId.toUpperCase()}: Contagem`}</CardTitle>
                          <CardDescription className="text-xs line-clamp-2">{question?.question || ""}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" />
                                <YAxis dataKey="name" type="category" width={150} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Quantidade" fill="#3b82f6" />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

