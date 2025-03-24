"use client"

import { useEffect, useState } from "react"
import { infinity } from 'ldrs'
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
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Toaster } from "sonner"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Adicione a importação do componente AdvancedAnalysis
import { AdvancedAnalysis } from "@/components/advanced-analysis"

// Define the survey blocks for reference
const surveyBlocks = [
  {
    id: "bloco1",
    title: "Bloco 01: Como eu me vejo",
    questions: [
      { id: "q1", text: "Sou capaz de desenvolver as habilidades exigidas pelo curso." },
      { id: "q2", text: "Costumo duvidar da qualidade dos meus projetos em comparação com os dos colegas." },
      { id: "q3", text: "Quando recebo críticas nos, sou capaz de usá-las de forma construtiva." },
      { id: "q4", text: "Sou impedido de arriscar ideias novas nos projetos por medo de errar." },
      { id: "q5", text: "Sou emocionalmente afetado(a) por críticas negativas no geral." },
      { id: "q6", text: "Acho que as coisas têm que ser como penso, do contrário isso me afeta." },
    ],
  },
  {
    id: "bloco2",
    title: "Bloco 02: Como eu vejo o mundo",
    questions: [
      { id: "q7", text: "O esforço e dedicação sempre resultam em sucesso." },
      { id: "q8", text: "O aprendizado é um processo contínuo e posso melhorar ao longo do tempo." },
      { id: "q9", text: "Os desafios acadêmicos fazem parte do meu crescimento pessoal." },
      { id: "q10", text: "O ambiente acadêmico é competitivo e difícil de lidar." },
      { id: "q11", text: "O fracasso em um projeto reflete diretamente minha capacidade." },
    ],
  },
  {
    id: "bloco3",
    title: "Bloco 03: Como eu vejo as pessoas e o futuro",
    questions: [
      { id: "q12", text: "Os professores e colegas estão dispostos a me ajudar em meu desenvolvimento acadêmico." },
      { id: "q13", text: "As críticas feitas pelos professores e colegas são justas e ajudam no meu aprendizado." },
      { id: "q14", text: "Comparar meu trabalho com o dos outros me causa insegurança." },
      { id: "q15", text: "Os feedbacks que recebo são construtivos e ajudam no meu desenvolvimento." },
      { id: "q16", text: "Trabalhar em equipe me deixa desconfortável." },
      { id: "q17", text: "Me vejo atuando como futuro Arquiteto(a)." },
      { id: "q18", text: "Consigo passar pelos desafios comuns a um estudante de arquitetura." },
      {
        id: "q19",
        text: "Estou disposto a aprender coisas novas e fora da minha área de conforto ao longo do meu caminho profissional.",
      },
      { id: "q20", text: "Acredito que na jornada da vida temos que aprender diferentes perspectivas e orientações." },
    ],
  },
  {
    id: "bloco4",
    title: "Bloco 04: Universidade",
    questions: [
      { id: "q21", text: "A universidade fornece suporte adequado para meu desenvolvimento acadêmico e emocional." },
      { id: "q22", text: "A carga horária e os prazos estabelecidos pela universidade são realistas." },
      { id: "q23", text: "O curso está alinhado com minhas expectativas profissionais e acadêmicas." },
      { id: "q24", text: "O suporte da instituição é suficiente para meu aprendizado." },
      { id: "q25", text: "A estrutura da universidade favorece meu desempenho acadêmico." },
      { id: "q26", text: "Estou aberto a mudanças e o que pode me fazer bem." },
    ],
  },
]

// Custom label formatter for question text
const formatQuestionText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..."
  }
  return text
}

// Custom label for bar values
const renderCustomBarLabel = (props: any) => {
  const { x, y, width, value } = props
  return value > 0 ? (
    <text x={x + width + 5} y={y + 4} fill="#666" fontSize={12} textAnchor="start">
      {value}
    </text>
  ) : null
}

// Custom label for pie chart
const renderCustomPieLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value } = props
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
      {`${name}: ${value}`}
    </text>
  )
}

export default function ResultsPage() {
  // Register the infinity loader
  infinity.register()
  const router = useRouter()
  const [responses, setResponses] = useState<any[]>([])
  const [chartData, setChartData] = useState<Record<string, any[]>>({})
  const [periodData, setPeriodData] = useState<any[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedView, setSelectedView] = useState<"horizontal" | "vertical">("horizontal")
  const [selectedPeriod, setSelectedPeriod] = useState<string>("all")
  const [availablePeriods, setAvailablePeriods] = useState<string[]>([])
  const [emailCount, setEmailCount] = useState(0)
  const [isResetting, setIsResetting] = useState(false)

  // Check if screen is mobile
  const isMobile = useMediaQuery("(max-width: 768px)")
  const isSmallScreen = useMediaQuery("(max-width: 1024px)")

  useEffect(() => {
    // Check if user is authenticated
    const authenticated = localStorage.getItem("researcherAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    if (!authenticated) {
      router.push("/researcher-login")
      return
    }

    fetchData()
  }, [router, selectedPeriod])

  const fetchData = async () => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/get-responses")

      if (!response.ok) {
        throw new Error("Erro ao buscar dados")
      }

      const data = await response.json()

      // Processar respostas - ajustando para acessar o campo 'responses'
      const allResponses = data.responses.map((item: any) => ({
        id: item.id,
        period: item.period,
        responses: item.responses, // Mantendo a estrutura original
        created_at: item.created_at,
      }))

      setResponses(allResponses)
      setEmailCount(data.emailCount)

      // Get unique periods from responses
      const periods = allResponses
        .map((response: any) => response.period || "Não informado")
        .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
        .sort()

      setAvailablePeriods(periods)

      // Process period distribution data
      const periodCounts: Record<string, number> = {}
      allResponses.forEach((response: any) => {
        const period = response.period || "Não informado"
        periodCounts[period] = (periodCounts[period] || 0) + 1
      })

      const periodChartData = Object.entries(periodCounts).map(([period, count]) => ({
        name: `${period}º Período`,
        value: count,
      }))

      setPeriodData(periodChartData)

      // Process data for charts based on selected period
      processChartData(allResponses, selectedPeriod)

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

  const processChartData = (responses: any[], periodFilter: string) => {
    // Filter responses by period if needed
    const filteredResponses = periodFilter === "all" ? responses : responses.filter((r) => r.period === periodFilter)

    // Process data for charts
    const processedData: Record<string, any[]> = {}

    surveyBlocks.forEach((block) => {
      const blockData = block.questions.map((question) => {
        // Count responses for each option (1-4)
        const counts = [0, 0, 0, 0]

        filteredResponses.forEach((response) => {
          // Acessar as respostas do campo 'responses' em vez de diretamente no objeto
          const responseData = response.responses || {}
          const value = Number.parseInt(responseData[question.id] || "0")
          if (value >= 1 && value <= 4) {
            counts[value - 1]++
          }
        })

        // Use different text lengths based on screen size
        const maxTextLength = isMobile ? 20 : isSmallScreen ? 40 : 60

        return {
          question: question.text,
          questionShort: formatQuestionText(question.text, maxTextLength),
          questionId: question.id,
          questionNumber: question.id.substring(1),
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

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period)
  }

  const handleResetEmails = async () => {
    setIsResetting(true)

    try {
      const response = await fetch("/api/reset-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetType: "emails" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao resetar emails")
      }

      toast({
        title: "Lista de emails resetada",
        description: "A lista de emails utilizados foi limpa com sucesso.",
      })

      // Atualizar dados
      fetchData()
    } catch (error) {
      console.error("Erro ao resetar emails:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao resetar a lista de emails.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  const handleResetAllData = async () => {
    setIsResetting(true)

    try {
      const response = await fetch("/api/reset-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetType: "all" }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Erro ao resetar dados")
      }

      toast({
        title: "Dados resetados",
        description: "Todas as respostas da pesquisa foram removidas com sucesso.",
        variant: "destructive",
      })

      // Atualizar dados
      fetchData()
    } catch (error) {
      console.error("Erro ao resetar dados:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao resetar os dados.",
        variant: "destructive",
      })
    } finally {
      setIsResetting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <l-infinity
          size="55"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3" 
          color="black"
        ></l-infinity>
      </div>
    )
  }

  const chartColors = [
    "#ef4444", // Vermelho (Discordo Totalmente)
    "#f97316", // Laranja (Discordo)
    "#22c55e", // Verde (Concordo)
    "#0ea5e9", // Azul (Concordo Totalmente)
  ]

  const periodColors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
    "#84cc16",
    "#6366f1",
    "#14b8a6",
    "#f43f5e",
    "#d946ef",
  ]

  // Determine chart height based on screen size and number of questions
  const getChartHeight = (blockId: string) => {
    const questionCount = surveyBlocks.find((b) => b.id === blockId)?.questions.length || 0

    if (isMobile) {
      // On mobile, make height proportional to number of questions
      return Math.max(400, questionCount * 60)
    }

    if (isSmallScreen) {
      return Math.max(500, questionCount * 50)
    }

    return 700 // Default height for larger screens
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <Card className="mb-4 sm:mb-8">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl">Resultados do Estudo</CardTitle>
            <CardDescription>Visualização dos dados coletados ({responses.length} respostas)</CardDescription>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Button
                variant={selectedView === "horizontal" ? "default" : "outline"}
                onClick={() => setSelectedView("horizontal")}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Horizontal
              </Button>
              <Button
                variant={selectedView === "vertical" ? "default" : "outline"}
                onClick={() => setSelectedView("vertical")}
                size="sm"
                className="flex-1 sm:flex-none"
              >
                Vertical
              </Button>
            </div>
            <Button variant="outline" onClick={handleLogout} size="sm" className="w-full sm:w-auto">
              Sair
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Email Management */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Gerenciamento de Dados</CardTitle>
          <CardDescription>Controle os emails e respostas do estudo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <p className="mb-2">
                Total de emails utilizados: <strong>{emailCount}</strong>
              </p>
              <p className="mb-2">
                Total de respostas coletadas: <strong>{responses.length}</strong>
              </p>

              

            </div>
          </div>
        </CardContent>
      </Card>

      {/* Period Distribution Chart */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Distribuição por Período</CardTitle>
          <CardDescription>Número de respostas por período acadêmico</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={periodData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomPieLabel}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {periodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={periodColors[index % periodColors.length]} />
                  ))}
                </Pie>
                <Legend />
                <ChartTooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Period Filter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtrar por Período</CardTitle>
          <CardDescription>Selecione um período específico para visualizar os resultados</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-full sm:w-[300px]">
              <SelectValue placeholder="Selecione um período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              {availablePeriods.map((period) => (
                <SelectItem key={period} value={period}>
                  {period === "Não informado" ? period : `${period}º Período`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-2 text-sm text-muted-foreground">
            {selectedPeriod === "all"
              ? "Mostrando dados de todos os períodos"
              : `Mostrando dados apenas do ${selectedPeriod}º período`}
          </p>
        </CardContent>
      </Card>

      <Tabs defaultValue="bloco1">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-4 sm:mb-8">
          {surveyBlocks.map((block) => (
            <TabsTrigger key={block.id} value={block.id}>
              {isMobile ? block.id.replace("bloco", "B") : block.title.split(":")[0]}
            </TabsTrigger>
          ))}
        </TabsList>

        {surveyBlocks.map((block) => (
          <TabsContent key={block.id} value={block.id}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">{block.title}</CardTitle>
                <CardDescription>
                  Distribuição das respostas para cada pergunta (1 = Discordo Totalmente, 4 = Concordo Totalmente)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ height: `${getChartHeight(block.id)}px` }} className="w-full">
                  {chartData[block.id] && (
                    <ChartContainer
                      config={{
                        "Discordo Totalmente": {
                          label: "Discordo Totalmente",
                          color: chartColors[0],
                        },
                        Discordo: {
                          label: "Discordo",
                          color: chartColors[1],
                        },
                        Concordo: {
                          label: "Concordo",
                          color: chartColors[2],
                        },
                        "Concordo Totalmente": {
                          label: "Concordo Totalmente",
                          color: chartColors[3],
                        },
                      }}
                      className="h-full"
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
                              label={{
                                value: "Número da Questão",
                                position: "insideBottom",
                                offset: -10,
                              }}
                            />
                            <YAxis
                              label={
                                isMobile
                                  ? undefined
                                  : {
                                      value: "Número de Respostas",
                                      angle: -90,
                                      position: "insideLeft",
                                    }
                              }
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  indicator="dot" //dot ou bar
                                  nameKey="option"
                                  valueKey="value"
                                  formatter={(value, name, props) => {
                                    return [value, name, props.payload.question]
                                  }}
                                />
                              }
                            />
                            <Legend
                              verticalAlign="top"
                              height={36}
                              wrapperStyle={isMobile ? { fontSize: "10px" } : undefined}
                            />
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
                            <YAxis
                              dataKey="questionShort"
                              type="category"
                              width={isSmallScreen ? 160 : 280}
                              tick={{ fontSize: 12 }}
                            />
                            <ChartTooltip
                              content={
                                <ChartTooltipContent
                                  indicator="dot"
                                  nameKey="option"
                                  valueKey="value"
                                  formatter={(value, name, props) => {
                                    return [value, name, props.payload.question]
                                  }}
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

                {/* Tabela de detalhes das perguntas */}
                <div className="mt-8 border rounded-md overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="p-2 text-left">Nº</th>
                        <th className="p-2 text-left">Pergunta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {block.questions.map((question) => (
                        <tr key={question.id} className="border-t">
                          <td className="p-2 font-medium whitespace-nowrap">{question.id.substring(1)}</td>
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
        <h2 className="text-2xl font-bold mb-4">Análise Avançada</h2>
        <AdvancedAnalysis responses={responses} chartData={chartData} />
      </div>

      <Toaster />
    </div>
  )
}

