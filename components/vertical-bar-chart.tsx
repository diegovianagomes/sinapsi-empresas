"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend, Tooltip, LabelList } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { exportAsImage } from "@/lib/export-utils"

interface VerticalBarChartProps {
  data: any[]
  title: string
  description?: string
  xAxisKey: string
  bars: {
    dataKey: string
    color: string
    name: string
  }[]
}

export function VerticalBarChart({ data, title, description, xAxisKey, bars }: VerticalBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  const handleExport = async () => {
    if (chartRef.current) {
      try {
        await exportAsImage(chartRef.current, title.replace(/\s+/g, "_"))
      } catch (error) {
        console.error("Erro ao exportar gráfico:", error)
      }
    }
  }

  const renderCustomBarLabel = (props: any) => {
    const { x, y, width, value } = props
    return value > 0 ? (
      <text x={x + width / 2} y={y - 5} fill="#666" fontSize={12} textAnchor="middle">
        {value}
      </text>
    ) : null
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        <Button variant="outline" size="sm" onClick={handleExport}>
          Exportar JPG
        </Button>
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 30, right: 30, left: 20, bottom: 30 }} barSize={30} barGap={5}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey={xAxisKey}
                label={{
                  value: "Opções de Resposta",
                  position: "insideBottom",
                  offset: -10,
                }}
              />
              <YAxis
                label={{
                  value: "Número de Respostas",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              {bars.map((bar, index) => (
                <Bar key={index} dataKey={bar.dataKey} fill={bar.color} name={bar.name}>
                  <LabelList dataKey={bar.dataKey} content={renderCustomBarLabel} />
                </Bar>
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

