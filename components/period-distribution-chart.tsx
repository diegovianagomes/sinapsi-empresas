"use client"

import { useLayoutEffect, useRef } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5percent from "@amcharts/amcharts5/percent"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"

interface PeriodDistributionChartProps {
  data: Array<{ name: string; value: number }>
  isMobile: boolean
}

export function PeriodDistributionChart({ data, isMobile }: PeriodDistributionChartProps) {
  const chartRef = useRef<am5.Root | null>(null)

  useLayoutEffect(() => {
    // Create root element
    const root = am5.Root.new("periodChartDiv")

    // Set themes
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        innerRadius: am5.percent(isMobile ? 40 : 50),
      })
    )

    // Create series
    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "value",
        categoryField: "name",
        radius: am5.percent(isMobile ? 80 : 90),
      })
    )

    // Set custom colors
    series.set("colors", am5.ColorSet.new(root, {
      colors: [
        am5.color(0x6366f1),
        am5.color(0x8b5cf6),
        am5.color(0xd946ef),
        am5.color(0xf43f5e),
        am5.color(0xf97316),
        am5.color(0xeab308),
        am5.color(0x22c55e),
        am5.color(0x06b6d4),
      ]
    }))

    // Configure labels
    series.labels.template.setAll({
      fontSize: isMobile ? 12 : 14,
      text: "{category}: {value}",
      maxWidth: 150,
      oversizedBehavior: "wrap"
    })

    // Add legend
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout,
      height: am5.percent(20)
    }))

    legend.data.setAll(series.dataItems)

    // Set data
    series.data.setAll(data)

    // Add hover state
    series.slices.template.setAll({
      strokeWidth: 2,
      stroke: am5.color(0xffffff),
      tooltipText: "{category}: {value} respostas"
    })

    series.slices.template.states.create("hover", {
      scale: 1.05
    })

    // Add animation
    series.appear(1000, 100)

    // Store chart instance
    chartRef.current = root

    return () => {
      root.dispose()
    }
  }, [data, isMobile])

  return (
    <div id="periodChartDiv" style={{ width: "100%", height: "100%" }} />
  )
}