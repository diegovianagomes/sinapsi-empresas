"use client"

import { useLayoutEffect, useRef } from "react"
import * as am5 from "@amcharts/amcharts5"
import * as am5xy from "@amcharts/amcharts5/xy"
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"

interface AmSurveyChartProps {
  data: Array<{
    questionNumber: string
    questionShort: string
    question: string
    "Discordo Totalmente": number
    Discordo: number
    Concordo: number
    "Concordo Totalmente": number
  }>
  isMobile: boolean
  isHorizontal: boolean
  chartColors: string[]
}

export function AmSurveyChart({ data, isMobile, isHorizontal, chartColors }: AmSurveyChartProps) {
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
    root.setThemes([am5themes_Animated.new(root)])

    // Create chart
    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
        paddingRight: isMobile ? 20 : 80
      })
    )

    // Create axes
    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: isHorizontal ? "questionNumber" : "questionShort",
        renderer: am5xy.AxisRendererY.new(root, {
          minGridDistance: 30,
          inversed: !isHorizontal
        }),
        tooltip: am5.Tooltip.new(root, {})
      })
    )

    yAxis.data.setAll(data)

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {}),
        min: 0
      })
    )

    // Add legend
    const legend = chart.children.push(am5.Legend.new(root, {
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout,
      marginTop: 15
    }))

    // Create series
    const createSeries = (name: string, field: string, color: string) => {
      const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: isHorizontal ? "questionNumber" : "questionShort",
          sequencedInterpolation: true,
          tooltip: am5.Tooltip.new(root, {
            labelText: "{name}: {valueX}",
            pointerOrientation: "horizontal"
          })
        })
      )

      series.columns.template.setAll({
        cornerRadiusTL: 3,
        cornerRadiusTR: 3,
        strokeOpacity: 0,
        fillOpacity: 0.8,
        fill: am5.color(color)
      })

      series.columns.template.states.create("hover", {
        fillOpacity: 1
      })

      series.data.setAll(data)
      return series
    }

    // Add series
    const series1 = createSeries("Discordo Totalmente", "Discordo Totalmente", chartColors[0])
    const series2 = createSeries("Discordo", "Discordo", chartColors[1])
    const series3 = createSeries("Concordo", "Concordo", chartColors[2])
    const series4 = createSeries("Concordo Totalmente", "Concordo Totalmente", chartColors[3])

    // Add series to legend
    legend.data.setAll(chart.series.values)

    // Add cursor
    chart.set("cursor", am5xy.XYCursor.new(root, {
      behavior: "none",
      xAxis: xAxis,
      yAxis: yAxis
    }))

    // Make stuff animate on load
    chart.appear(1000, 100)

    return () => {
      root.dispose()
    }
  }, [data, isMobile, isHorizontal, chartColors])

  return (
    <div ref={chartRef} style={{ width: "100%", height: "100%" }} />
  )
}