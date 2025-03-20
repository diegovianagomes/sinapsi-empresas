import html2canvas from "html2canvas"
import * as XLSX from "xlsx"

// Função para exportar um elemento como JPG
export async function exportAsImage(element: HTMLElement, fileName: string) {
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Melhor qualidade
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    const image = canvas.toDataURL("image/jpeg", 1.0)
    const link = document.createElement("a")
    link.download = `${fileName}.jpg`
    link.href = image
    link.click()
  } catch (error) {
    console.error("Erro ao exportar imagem:", error)
    throw error
  }
}

// Função para exportar dados para Excel
export function exportToExcel(data: any[], fileName: string) {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Respostas")

    // Ajustar largura das colunas
    const maxWidth = Object.keys(data[0] || {}).reduce((acc, key) => {
      return Math.max(acc, key.length)
    }, 10)

    const colWidths = Object.keys(data[0] || {}).map(() => ({ wch: maxWidth }))
    worksheet["!cols"] = colWidths

    XLSX.writeFile(workbook, `${fileName}.xlsx`)
  } catch (error) {
    console.error("Erro ao exportar para Excel:", error)
    throw error
  }
}

// Função para preparar dados para exportação Excel
export function prepareDataForExcel(responses: any[]) {
  // Mapear as respostas para um formato adequado para Excel
  return responses.map((response) => {
    const { id, created_at, ...rest } = response

    // Extrair as respostas do objeto responses
    const responseData = rest.responses || {}

    // Criar um objeto plano com todas as informações
    return {
      ID: id,
      Período: rest.period,
      "Data de Criação": new Date(created_at).toLocaleString("pt-BR"),
      // Adicionar todas as respostas como colunas separadas
      ...Object.keys(responseData).reduce(
        (acc, key) => {
          acc[`Questão ${key.substring(1)}`] = responseData[key]
          return acc
        },
        {} as Record<string, string>,
      ),
    }
  })
}

// Função para preparar dados de análise para Excel
export function prepareAnalysisForExcel(chartData: Record<string, any[]>) {
  const result: any[] = []

  // Para cada bloco de perguntas
  Object.entries(chartData).forEach(([blockId, questions]) => {
    // Para cada questão no bloco
    questions.forEach((question) => {
      result.push({
        Bloco: blockId.replace("bloco", "Bloco "),
        Questão: question.questionNumber,
        "Texto da Questão": question.question,
        "Discordo Totalmente": question["Discordo Totalmente"],
        Discordo: question["Discordo"],
        Concordo: question["Concordo"],
        "Concordo Totalmente": question["Concordo Totalmente"],
        Total:
          question["Discordo Totalmente"] +
          question["Discordo"] +
          question["Concordo"] +
          question["Concordo Totalmente"],
      })
    })
  })

  return result
}

