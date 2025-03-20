import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[90vh] flex items-center justify-center">
      <div className="max-w-3xl mx-auto text-center">
        <img src="/logo.webp" alt="" className="mx-auto mb-4 md:mb-6 w-48 md:w-64 h-auto"/>
        <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Diagnóstico Organizacional</h1>
        <p className="text-base md:text-lg mb-6 md:mb-8">
          Esta pesquisa tem como objetivo coletar informações sobre percepções acadêmicas. Suas respostas são anônimas e
          serão utilizadas apenas para fins de pesquisa.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/student-auth">Iniciar Pesquisa</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
            <Link href="/researcher-login">Ver Resultados (Área do Pesquisador)</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

