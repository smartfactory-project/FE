"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity, Target } from "lucide-react"

export function ChartsOverview() {
  const overviewStats = [
    {
      title: "총 생산량",
      value: "24,847",
      unit: "개",
      change: "+12.5%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-500",
    },
    {
      title: "평균 품질률",
      value: "96.8",
      unit: "%",
      change: "+2.1%",
      trend: "up",
      icon: Target,
      color: "text-green-500",
    },
    {
      title: "전체 효율성",
      value: "89.2",
      unit: "%",
      change: "-1.3%",
      trend: "down",
      icon: Activity,
      color: "text-orange-500",
    },
    {
      title: "분석 리포트",
      value: "47",
      unit: "개",
      change: "+8.7%",
      trend: "up",
      icon: PieChart,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {overviewStats.map((stat, index) => (
        <Card key={index} className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-bold text-foreground">{stat.value}</span>
              <span className="text-sm text-muted-foreground">{stat.unit}</span>
            </div>
            <div
              className={`flex items-center mt-2 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
            >
              {stat.trend === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              <span>{stat.change} 지난 달 대비</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
