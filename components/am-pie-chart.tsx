"use client"

import { useEffect, useRef } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5percent from "@amcharts/amcharts5/percent"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
//import { exportAsImage } from "@/lib/utils"

interface AmPieChartProps {
  data: Array<{ name: string; value: number }>
  title: string
  description: string
  colors: string[]
  nameKey: string
  dataKey: string
}

export function AmPieChart({ data, title, description, colors, nameKey, dataKey }: AmPieChartProps) {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstanceRef = useRef<am5.Root | null>(null)

  useEffect(() => {
    // Create root element
    const root = am5.Root.new(chartRef.current!)
    chartInstanceRef.current = root

    // Set themes
    root.setThemes([
      am5.Theme.new(root)
    ])

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(50)
      })
    )

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: dataKey,
        categoryField: nameKey,
        endAngle: 270
      })
    )

    // Set custom colors if provided
    if (colors) {
      series.set("colors", am5.ColorSet.new(root, {
        colors: colors.map(color => am5.color(color))
      }))
    }

    // Set data
    series.data.setAll(data)

    // Create legend
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      marginTop: 15,
      marginBottom: 15
    }))

    legend.data.setAll(series.dataItems)

    // Add slice labels
    series.labels.template.setAll({
      text: "{category}: {valuePercentTotal.formatNumber('0.0')}%",
      radius: 10
    })

    // Add hover state
    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      tooltipText: "{category}: {valuePercentTotal.formatNumber('0.0')}%"
    })

    series.slices.template.states.create("hover", {
      scale: 1.1,
      strokeWidth: 3
    })

    // Play initial series animation
    series.appear(1000, 100)

    // Clean up on unmount
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.dispose()
      }
    }
  }, [data, colors, nameKey, dataKey])

 /* const handleExport = async () => {
    if (chartRef.current) {
      try {
        await exportAsImage(chartRef.current, title.replace(/\s+/g, "_"))
      } catch (error) {
        console.error("Error exporting chart:", error)
      }
    }
  }*/

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          {description && <CardDescription className="text-xs line-clamp-2">{description}</CardDescription>}
        </div>
        {/*<Button variant="outline" size="sm" onClick={handleExport}>
          Export JPG
        </Button>*/}
      </CardHeader>
      <CardContent>
        <div ref={chartRef} className="w-full h-[400px]" />
      </CardContent>
    </Card>
  )
}