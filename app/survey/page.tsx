"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Toaster } from "sonner"
import { toast } from "@/components/ui/use-toast"

// Define the survey questions
const surveyBlocks = [
  {
    title: "Como eu me vejo",
    questions: [
      { id: "01", text: "Sou capaz de desenvolver as habilidades exigidas pela empresa." },
      { id: "02", text: "Costumo duvidar da qualidade das tarefas confiadas a mim em comparação com as confiadas aos colegas." },
      { id: "03", text: "Quando recebo críticas nos projetos, sou capaz de usá-las de forma construtiva." },
      { id: "04", text: "Sou capaz de melhorar meu desempenho profissional com esforço e novas estratégias." },
      { id: "05", text: "Sou impedido de arriscar ideias novas nos campo de atuação por medo de errar." },
      { id: "06", text: "Sou ansioso(a) ou estressado(a) devido à carga de trabalho." },
      { id: "07", text: "Fico nervoso(a) ao apresentar meus projetos para coordenadores e colegas." },
      { id: "08", text: "Sou motivado(a) e sinto prazer ao desenvolver tarefas criativas." },
      { id: "09", text: "Sou emocionalmente afetado(a) por críticas negativas." },
      { id: "10", text: "Sou capaz de equilibrar minha vida profissional e minha vida pessoal." },
    ],
  },
  {
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
            router.push("/survey-completed")
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
      <Card className="max-w-4xl mx-auto border-4">
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
            {currentBlock + 1} de {surveyBlocks.length}
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

