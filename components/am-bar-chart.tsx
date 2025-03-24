"use client"

import { useLayoutEffect, useRef } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { exportAsImage } from "@/lib/export-utils"

interface AmBarChartProps {
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

export function AmBarChart({ data, title, description, xAxisKey, bars }: AmBarChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<am5.Root | null>(null)

  useLayoutEffect(() => {
    if (!chartRef.current) return

    // Dispose of the previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.dispose()
    }

    // Create root element
    const root = am5.Root.new(chartRef.current)
    chartInstanceRef.current = root

    // Set themes
    root.setThemes([
      am5.Theme.new(root)
    ])

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout
      })
    )

    // Create axes
    const xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: xAxisKey,
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    xAxis.data.setAll(data)

    const yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {})
      })
    )

    // Add legend
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout,
      marginTop: 15
    }))

    // Create series for each bar
    bars.forEach((bar) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: bar.name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: bar.dataKey,
          categoryXField: xAxisKey,
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueY}"
          })
        })
      )

      series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        strokeOpacity: 0,
        fillOpacity: 0.8
      })

      series.columns.template.states.create("hover", {
        fillOpacity: 1,
        scale: 1.1
      })

      // Set custom color
      series.set("fill", am5.color(bar.color))
      series.set("stroke", am5.color(bar.color))

      // Add bounce animation
      series.appear(1000, 100)

      series.data.setAll(data)
      legend.data.push(series)
    })

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {}))

    // Clean up on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
      }
    }
  }, [data, xAxisKey, bars])

  const handleExport = async () => {
    if (chartRef.current) {
      try {
        await exportAsImage(chartRef.current, title.replace(/\s+/g, "_"))
      } catch (error) {
        console.error("Erro ao exportar gráfico:", error)
      }
    }
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
        <div ref={chartRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  )
}