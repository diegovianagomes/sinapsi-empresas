"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Define the survey questions
const surveyBlocks = [
  {
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

export default function SurveyPage() {
  const router = useRouter()
  const [responses, setResponses] = useState<Record<string, string>>({})
  const [currentBlock, setCurrentBlock] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if student is authenticated
    const authenticated = sessionStorage.getItem("studentAuthenticated") === "true"
    setIsAuthenticated(authenticated)

    if (!authenticated) {
      router.push("/student-auth")
      return
    }

    setIsLoading(false)
  }, [router])

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }))
  }

  const isBlockComplete = () => {
    const currentQuestions = surveyBlocks[currentBlock].questions
    return currentQuestions.every((q) => responses[q.id])
  }

  const handleNext = async () => {
    if (isBlockComplete()) {
      if (currentBlock < surveyBlocks.length - 1) {
        setCurrentBlock(currentBlock + 1)
        window.scrollTo(0, 0)
      } else {
        setIsSubmitting(true)

        try {
          // Get student period
          const studentPeriod = sessionStorage.getItem("studentPeriod") || "Não informado"

          // Enviar respostas para o servidor
          const submitResponse = await fetch("/api/submit-survey", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              period: studentPeriod,
              responses: responses,
            }),
          })

          if (!submitResponse.ok) {
            const errorData = await submitResponse.json()
            console.error("Erro na resposta do servidor:", errorData)
            throw new Error(errorData.message || "Erro ao enviar as respostas")
          }

          const submitData = await submitResponse.json()

          toast({
            title: "Respostas enviado com sucesso!",
            description: "Obrigado por participar da nosso estudo.",
          })

          // Clear student session data
          sessionStorage.removeItem("studentAuthenticated")
          sessionStorage.removeItem("studentPeriod")

          setTimeout(() => {
            router.push("/")
          }, 2000)
        } catch (error) {
          console.error("Erro ao enviar o estudo:", error)
          toast({
            title: "Erro",
            description:
              error instanceof Error ? error.message : "Ocorreu um erro ao enviar suas respostas. Tente novamente.",
            variant: "destructive",
          })
          setIsSubmitting(false)
        }
      }
    } else {
      toast({
        title: "Por favor, responda todas as perguntas",
        description: "É necessário responder todas as perguntas antes de prosseguir.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    if (currentBlock > 0) {
      setCurrentBlock(currentBlock - 1)
      window.scrollTo(0, 0)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
        <p>Verificando autenticação...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">{surveyBlocks[currentBlock].title}</CardTitle>
          <CardDescription>
            Selecione uma opção para cada pergunta (1 = Discordo Totalmente, 4 = Concordo Totalmente)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {surveyBlocks[currentBlock].questions.map((question) => (
              <div key={question.id} className="space-y-3">
                <p className="font-medium">{question.text}</p>
                <RadioGroup
                  value={responses[question.id] || ""}
                  onValueChange={(value) => handleResponseChange(question.id, value)}
                  className="flex flex-wrap gap-2 sm:gap-3"
                >
                  {[1, 2, 3, 4].map((value) => (
                    <div key={value} className="flex items-center space-x-1">
                      <RadioGroupItem
                        value={value.toString()}
                        id={`${question.id}-${value}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${question.id}-${value}`}
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-md border border-muted bg-popover peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground"
                      >
                        {value}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentBlock === 0 || isSubmitting}
            className="w-full sm:w-auto"
          >
            Anterior
          </Button>
          <div className="text-sm text-muted-foreground">
            Bloco {currentBlock + 1} de {surveyBlocks.length}
          </div>
          <Button onClick={handleNext} disabled={isSubmitting} className="w-full sm:w-auto">
            {isSubmitting ? "Enviando..." : currentBlock < surveyBlocks.length - 1 ? "Próximo" : "Enviar"}
          </Button>
        </CardFooter>
      </Card>
      <Toaster />
    </div>
  )
}

