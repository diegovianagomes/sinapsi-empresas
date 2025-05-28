"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { triggerConfetti } from "@/lib/confetti"

export default function SurveyCompletedPage() {
  useEffect(() => {
    triggerConfetti()
  }, [])

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[80vh]">
      <Card className="max-w-lg w-full text-center border-4">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl">Estudo Finalizado!</CardTitle>
          <CardDescription className="text-lg">
            Obrigado por participar do nosso estudo
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <p className="text-muted-foreground mb-4">
            Sua contribuição é muito importante.
          </p>
          <p className="text-muted-foreground">
            Agradecemos seu tempo e dedicação em responder todas as questões.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">Voltar ao Início</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}