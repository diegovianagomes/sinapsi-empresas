"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRef } from "react"
import { exportAsImage } from "@/lib/export-utils"

interface PieChartViewProps {
  data: any[]
  title: string
  description?: string
  colors: string[]
  nameKey: string
  dataKey: string
}

export function PieChartView({ data, title, description, colors, nameKey, dataKey }: PieChartViewProps) {
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

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return percent > 0.05 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12}>
        {`${(percent * 100).toFixed(0)}%`}
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
        <div ref={chartRef} className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey={dataKey}
                nameKey={nameKey}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={(value) => [`${value}`, ""]} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

