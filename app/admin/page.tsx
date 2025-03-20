import { SurveyStats } from "@/components/survey-stats"
import { EmailCheckForm } from "@/components/email-check-form"
import { Toaster } from "@/components/ui/toaster"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <SurveyStats />
        </div>

        <div>
          <div className="bg-card border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Verificar Email</h2>
            <p className="text-muted-foreground mb-4">
              Verifique se um email já foi utilizado para responder à pesquisa.
            </p>
            <EmailCheckForm />
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

