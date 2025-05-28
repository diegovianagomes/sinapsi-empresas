"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Toaster } from "sonner"
import { toast } from "@/components/ui/use-toast"


import { AdvancedAnalysis } from "@/components/advanced-analysis"

// Definição dos blocos da pesquisa
const surveyBlocks = [
  {
    id: "b01",
    title: "Como eu me vejo",
    questions: [
      { id: "01", text: "Sou capaz de desenvolver as habilidades exigidas pela empresa." },
      { id: "02", text: "Costumo duvidar da qualidade das tarefas confiadas a mim em comparação com os dos colegas." },
      { id: "03", text: "Quando recebo críticas nos projetos, sou capaz de usá-las de forma construtiva." },
      { id: "04", text: "Sou capaz de melhorar meu desempenho profissional com esforço e novas estratégias." },
      { id: "05", text: "Sou impedido de arriscar ideias novas nos campo de atuação por medo de errar." },
      { id: "06", text: "Sou ansioso(a) ou estressado(a) devido à carga de trabalho." },
      { id: "07", text: "Fico nervoso(a) ao apresentar meus projetos para coordenadores e colegas." },
      { id: "08", text: "Sou motivado(a) e sinto prazer ao desenvolver tarefas criativos." },
      { id: "09", text: "Sou emocionalmente afetado(a) por críticas negativas." },
      { id: "10", text: "Sou capaz de equilibrar minha vida profissional e minha vida pessoal." },
    ],
  },
  {
    id: "b02",
    title: "Como eu vejo o mundo",
    questions: [
      { id: "11", text: "O mundo profissional é um ambiente justo." },
      { id: "12", text: "O esforço e dedicação sempre resultam em sucesso profissional." },
      { id: "13", text: "O fracasso em um projeto é um reflexo direto da minha capacidade." },
      { id: "14", text: "O aprendizado é um processo contínuo e posso melhorar ao longo do tempo." },
      { id: "15", text: "Os desafios profissionais fazem parte do meu crescimento pessoal." },
    ],
  },
  {
    id: "b03",
    title: "Como eu vejo as pessoas",
    questions: [
      { id: "16", text: "Os meus colegas estão dispostos a me ajudar em meu desenvolvimento profissional." },
      { id: "17", text: "As críticas feitas pelas outras pessoas são justas e ajudam no meu aprendizado." },
      { id: "18", text: " As pessoas ao meu redor me veem como um profissional competente." },
      { id: "19", text: "Ao comparar meu trabalho ao dos outros, me sinto inseguro(a)" },
      { id: "20", text: " Os feedbacks que recebo são construtivos e ajudam no meu desenvolvimento." },
    ],
  },
  {
    id: "b04",
    title: "Empresa",
    questions: [
      { id: "21", text: "A empresa fornece suporte adequado para meu desenvolvimento profissional e emocional." },
      { id: "22", text: " O ambiente de trabalho é acolhedor e estimula meu crescimento profissional." },
      { id: "23", text: "A carga horária e os prazos estabelecidos pela empresa são realistas." },
      { id: "24", text: " A empresa oferece oportunidades suficientes para práticas e aplicações do conhecimento." },
      { id: "25", text: "As tarefas estabelecidas estão alinhadas com minhas expectativas profissionais e pessoais." },
    ],
  },
]

// Formata o texto da pergunta para um tamanho máximo, adicionando "..." se necessário
const formatQuestionText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    //return text.substring(0, maxLength) + "..."
    return `${text.substring(0, maxLength)}...`
  }
  return text
}

// Renderiza um rótulo customizado para os valores nas barras do gráfico
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const renderCustomBarLabel = (props: any) => {
  const { x, y, width, value } = props
  return value > 0 ? (
    <text x={x + width + 5} y={y + 4} fill="#666" fontSize={12} textAnchor="start">
      {value}
    </text>
  ) : null
}
export default function ResultsPage() {
  const router = useRouter()
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [responses, setResponses] = useState<any[]>([])
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [chartData, setChartData] = useState<Record<string, any[]>>({})
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<"horizontal" | "vertical">("horizontal")
  const [emailCount, setEmailCount] = useState(0)
  const [isResetting, setIsResetting] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 1024px)")

  useEffect(() => {
    const authenticated = localStorage.getItem("researcherAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    if (!authenticated) {
      router.push("/researcher-login")
      return
    }

    fetchData()
  }, [router]) // Dependência do router para o caso de redirecionamento

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/get-responses")
      if (!response.ok) {
        throw new Error("Erro ao buscar dados")
      }
      const data = await response.json()

      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      const allResponses = data.responses.map((item: any) => ({
        id: item.id,
        // period: item.period, // Removido
        responses: item.responses,
        created_at: item.created_at,
      }))

      setResponses(allResponses)
      setEmailCount(data.emailCount)
      processChartData(allResponses)
      setIsLoading(false)
    } catch (error) {
      console.error("Erro ao buscar dados:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao buscar os dados da pesquisa.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const processChartData = (currentResponses: any[]) => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const processedData: Record<string, any[]> = {}

    // biome-ignore lint/complexity/noForEach: <explanation>
    surveyBlocks.forEach((block) => {
      const blockData = block.questions.map((question) => {
        const counts = [0, 0, 0, 0] // [Discordo Totalmente, Discordo, Concordo, Concordo Totalmente]

        // biome-ignore lint/complexity/noForEach: <explanation>
        currentResponses.forEach((response) => {
          const responseData = response.responses || {}
          const value = Number.parseInt(responseData[question.id] || "0")
          if (value >= 1 && value <= 4) {
            counts[value - 1]++
          }
        })

        const maxTextLength = isMobile ? 20 : isSmallScreen ? 40 : 60

        return {
          question: question.text,
          questionShort: formatQuestionText(question.text, maxTextLength),
          questionId: question.id,
          questionNumber: question.id.startsWith("q") ? question.id.substring(1) : question.id, // Trata IDs como "01" e "q21"
          "Discordo Totalmente": counts[0],
          Discordo: counts[1],
          Concordo: counts[2],
          "Concordo Totalmente": counts[3],
        }
      })
      processedData[block.id] = blockData
    })
    setChartData(processedData)
  }

  const handleLogout = () => {
    localStorage.removeItem("researcherAuthenticated")
    router.push("/")
  }

  const resetData = async (resetType: "emails" | "all") => {
    setIsResetting(true)
    try {
      const apiResponse = await fetch("/api/reset-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resetType }),
      })

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(data.message || `Erro ao resetar ${resetType === "emails" ? "emails" : "todos os dados"}`)
      }

      toast({
        title: resetType === "emails" ? "Lista de emails resetada" : "Dados resetados",
        description: resetType === "emails"
          ? "A lista de emails utilizados foi limpa com sucesso."
          : "Todas as respostas da pesquisa foram removidas com sucesso.",
        variant: resetType === "all" ? "destructive" : undefined,
      })
      fetchData() // Re-fetch data to update counts
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (error: any) {
      console.error(`Erro ao resetar ${resetType}:`, error)
      toast({
        title: "Erro",
        description: error.message || `Ocorreu um erro ao resetar os ${resetType === "emails" ? "emails" : "dados"}.`,
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }


  if (!isAuthenticated || isLoading) { // Mostrar loading se não autenticado ou carregando
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  const chartColors = [
    "#ef4444", // Vermelho (Discordo Totalmente)
    "#f97316", // Laranja (Discordo)
    "#22c55e", // Verde (Concordo)
    "#0ea5e9", // Azul (Concordo Totalmente)
  ]

  const getChartHeight = (blockId: string) => {
    const questionCount = surveyBlocks.find((b) => b.id === blockId)?.questions.length || 0
    if (isMobile) return Math.max(400, questionCount * 60)
    if (isSmallScreen) return Math.max(500, questionCount * 50)
    return 700
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
      <Card>
        <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-2">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold">Resultados do Estudo</CardTitle>
            <CardDescription className="text-base">Visualização dos dados coletados ({responses.length} respostas)</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 shadow-sm rounded-lg border p-1 bg-background/50 w-full sm:w-auto">
              <Button
                variant={selectedView === "horizontal" ? "default" : "ghost"}
                onClick={() => setSelectedView("horizontal")}
                size="sm"
                className="flex-1 sm:flex-none transition-colors"
              >
                Horizontal
              </Button>
              <Button
                variant={selectedView === "vertical" ? "default" : "ghost"}
                onClick={() => setSelectedView("vertical")}
                size="sm"
                className="flex-1 sm:flex-none transition-colors"
              >
                Vertical
              </Button>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm" className="w-full sm:w-auto hover:bg-destructive/10">
              Sair
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl font-semibold">Gerenciamento de Dados</CardTitle>
          <CardDescription>Controle os emails e respostas do estudo.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
            <div className="p-4 rounded-lg bg-background/80 border shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-1">Emails utilizados</p>
              <p className="text-2xl font-bold">{emailCount}</p>
            </div>
            <div className="p-4 rounded-lg bg-background/80 border shadow-sm">
              <p className="text-sm font-medium text-muted-foreground mb-1">Respostas coletadas</p>
              <p className="text-2xl font-bold">{responses.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue={surveyBlocks[0]?.id || "b01"} className="space-y-4">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 gap-2 bg-muted/30 p-1">
          {surveyBlocks.map((block) => (
            <TabsTrigger
              key={block.id}
              value={block.id}
              className="data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
            >
              {isMobile ? block.id.replace("b", "B") : block.title.split(":")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {surveyBlocks.map((block) => (
          <TabsContent key={block.id} value={block.id}>
            <Card className="bg-card/50 border-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-semibold">{block.title}</CardTitle>
                <CardDescription className="text-sm">
                  Distribuição das respostas (1 = Discordo Totalmente, 4 = Concordo Totalmente)
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <div
                  style={{ height: `${getChartHeight(block.id)}px` }}
                  className="w-full bg-background/80 p-4 rounded-lg border shadow-sm"
                >
                  {chartData[block.id] && (
                    <ChartContainer
                      config={{
                        "Discordo Totalmente": { label: "Discordo Totalmente", color: chartColors[0] },
                        Discordo: { label: "Discordo", color: chartColors[1] },
                        Concordo: { label: "Concordo", color: chartColors[2] },
                        "Concordo Totalmente": { label: "Concordo Totalmente", color: chartColors[3] },
                      }}
                      className="h-full transition-all hover:opacity-95"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        {selectedView === "horizontal" || isMobile ? (
                          <BarChart
                            data={chartData[block.id]}
                            layout="horizontal"
                            margin={
                              isMobile
                                ? { top: 20, right: 20, left: 0, bottom: 60 }
                                : { top: 20, right: 80, left: 20, bottom: 60 }
                            }
                            barSize={isMobile ? 15 : 20}
                            barGap={4}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="questionNumber"
                              label={{ value: "Número da Questão", position: "insideBottom", offset: -10 }}
                            />
                            <YAxis
                              label={ isMobile ? undefined : { value: "Número de Respostas", angle: -90, position: "insideLeft" }}
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  indicator="dot"
                                  formatter={(value, name, props) => [value, name, props.payload.question]}
                                />
                              }
                            />
                            <Legend verticalAlign="top" height={36} wrapperStyle={isMobile ? { fontSize: "10px" } : undefined} />
                            <Bar dataKey="Discordo Totalmente" fill={chartColors[0]} name="Discordo Totalmente" />
                            <Bar dataKey="Discordo" fill={chartColors[1]} name="Discordo" />
                            <Bar dataKey="Concordo" fill={chartColors[2]} name="Concordo" />
                            <Bar dataKey="Concordo Totalmente" fill={chartColors[3]} name="Concordo Totalmente" />
                          </BarChart>
                        ) : (
                          <BarChart
                            data={chartData[block.id]}
                            layout="vertical"
                            margin={
                              isSmallScreen
                                ? { top: 20, right: 60, left: 180, bottom: 20 }
                                : { top: 20, right: 80, left: 300, bottom: 20 }
                            }
                            barSize={15}
                            barGap={4}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" />
                            <YAxis dataKey="questionShort" type="category" width={isSmallScreen ? 160 : 280} tick={{ fontSize: 12 }} />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  indicator="dot"
                                  formatter={(value, name, props) => [value, name, props.payload.question]}
                                />
                              }
                            />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="Discordo Totalmente" fill={chartColors[0]} name="Discordo Totalmente">
                              <LabelList dataKey="Discordo Totalmente" content={renderCustomBarLabel} />
                            </Bar>
                            <Bar dataKey="Discordo" fill={chartColors[1]} name="Discordo">
                              <LabelList dataKey="Discordo" content={renderCustomBarLabel} />
                            </Bar>
                            <Bar dataKey="Concordo" fill={chartColors[2]} name="Concordo">
                              <LabelList dataKey="Concordo" content={renderCustomBarLabel} />
                            </Bar>
                            <Bar dataKey="Concordo Totalmente" fill={chartColors[3]} name="Concordo Totalmente">
                              <LabelList dataKey="Concordo Totalmente" content={renderCustomBarLabel} />
                            </Bar>
                          </BarChart>
                        )}
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>

                <div className="mt-8 border rounded-md overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left font-medium">Nº</th>
                        <th className="p-2 text-left font-medium">Pergunta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.questions.map((question) => (
                        <tr key={question.id} className="border-t">
                          <td className="p-2 font-medium whitespace-nowrap">
                            {question.id.startsWith("q") ? question.id.substring(1) : question.id}
                          </td>
                          <td className="p-2">{question.text}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8">
        <AdvancedAnalysis responses={responses} chartData={chartData} />
      </div>

      <Toaster />
    </div>
  )
}