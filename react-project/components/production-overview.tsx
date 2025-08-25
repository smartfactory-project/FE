"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, Users, CheckCircle, Activity } from "lucide-react"

export function ProductionOverview() {
  const overviewStats = [
    {
      title: "오늘 생산량",
      value: "1,247",
      unit: "개",
      target: "1,500",
      progress: 83,
      trend: "+12%",
      trendUp: true,
      icon: Target,
      color: "text-blue-500",
    },
    {
      title: "품질 합격률",
      value: "96.8",
      unit: "%",
      target: "95%",
      progress: 97,
      trend: "+2.1%",
      trendUp: true,
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      title: "가동률",
      value: "87.5",
      unit: "%",
      target: "90%",
      progress: 87,
      trend: "-1.2%",
      trendUp: false,
      icon: Activity,
      color: "text-orange-500",
    },
    {
      title: "작업 인원",
      value: "42",
      unit: "명",
      target: "45",
      progress: 93,
      trend: "-3명",
      trendUp: false,
      icon: Users,
      color: "text-purple-500",
    },
  ]

  const productionLines = [
    { name: "라인 A", status: "정상", efficiency: 94, output: 387 },
    { name: "라인 B", status: "정상", efficiency: 91, output: 342 },
    { name: "라인 C", status: "점검", efficiency: 0, output: 0 },
    { name: "라인 D", status: "정상", efficiency: 88, output: 298 },
    { name: "라인 E", status: "경고", efficiency: 76, output: 220 },
  ]

  return (
    <div className="space-y-6">
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
              <div className="space-y-3">
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl font-bold text-foreground">{stat.value}</span>
                  <span className="text-sm text-muted-foreground">{stat.unit}</span>
                  <div className={`flex items-center text-xs ${stat.trendUp ? "text-green-600" : "text-red-600"}`}>
                    {stat.trendUp ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {stat.trend}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>목표: {stat.target}</span>
                    <span>{stat.progress}%</span>
                  </div>
                  <Progress value={stat.progress} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">생산 라인 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {productionLines.map((line, index) => (
              <div key={index} className="p-4 rounded-lg bg-background/50 text-center">
                <h3 className="font-semibold text-foreground mb-2">{line.name}</h3>
                <Badge
                  variant="secondary"
                  className={`mb-3 ${
                    line.status === "정상"
                      ? "bg-green-100 text-green-700"
                      : line.status === "경고"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                  }`}
                >
                  {line.status}
                </Badge>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">효율성</p>
                    <p className="text-lg font-bold text-foreground">{line.efficiency}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">생산량</p>
                    <p className="text-sm font-medium text-foreground">{line.output}개</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
