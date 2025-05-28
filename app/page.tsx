import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-[90vh] flex flex-col items-center justify-center">
      <div className="max-w-3xl mx-auto text-center flex-grow">
        <div className="flex items-center justify-center gap-8 pb-8">
          <img src="/logo1.svg" alt="" className="w-16 md:w-24 h-auto"/>
          <img src="/logo2.svg" alt="" className="w-48 md:w-64 h-auto"/>
        </div>
        <div className="bg-white/35  border-4 shadow-sm dark:bg-gray-800 rounded-lg  p-8 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Percepções e Experiências no Ambiente de Trabalho</h1>
          <p className="text-base md:text-lg mb-6 md:mb-8">
            Este questionário tem como objetivo coletar informações sobre desempenho, bem estar emocional, desafios e perspectivas dos colaboradores no ambiente de trabalho. Suas respostas são anônimas e serão utilizadas apenas para fins de pesquisa.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 p-8">
            <Button asChild size="lg" className="flex w-full sm:w-auto">
              <Link href="/student-auth">Iniciar Estudo</Link>
            </Button>
          </div>
        </div>
      </div>
  
    </div>
  )
}

