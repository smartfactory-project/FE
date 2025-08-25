"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

export function PerformanceCharts() {
  const performanceData = [
    { month: "1월", efficiency: 85.2, output: 18500, workers: 45 },
    { month: "2월", efficiency: 87.1, output: 19200, workers: 44 },
    { month: "3월", efficiency: 91.3, output: 21300, workers: 46 },
    { month: "4월", efficiency: 89.8, output: 20800, workers: 45 },
    { month: "5월", efficiency: 92.1, output: 22100, workers: 47 },
    { month: "6월", efficiency: 94.4, output: 23400, workers: 48 },
    { month: "7월", efficiency: 93.2, output: 24200, workers: 46 },
    { month: "8월", efficiency: 91.8, output: 23800, workers: 45 },
    { month: "9월", efficiency: 95.1, output: 25100, workers: 49 },
    { month: "10월", efficiency: 92.6, output: 24600, workers: 47 },
    { month: "11월", efficiency: 96.2, output: 26200, workers: 50 },
    { month: "12월", efficiency: 89.2, output: 24847, workers: 42 },
  ]

  const departmentPerformance = [
    { department: "생산성", A: 92, B: 88, fullMark: 100 },
    { department: "품질", A: 96, B: 94, fullMark: 100 },
    { department: "효율성", A: 89, B: 85, fullMark: 100 },
    { department: "안전성", A: 98, B: 95, fullMark: 100 },
    { department: "혁신", A: 78, B: 82, fullMark: 100 },
    { department: "협업", A: 85, B: 88, fullMark: 100 },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">효율성 vs 생산량</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis yAxisId="left" stroke="#64748b" />
              <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar yAxisId="left" dataKey="output" fill="#3b82f6" name="생산량" opacity={0.7} />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="efficiency"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="효율성 (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">부서별 성과 비교</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={departmentPerformance}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="department" tick={{ fontSize: 12, fill: "#64748b" }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#64748b" }} tickCount={6} />
              <Radar name="현재 분기" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} strokeWidth={2} />
              <Radar name="이전 분기" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">종합 성과 지표</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-blue-600 mb-2">89.2%</div>
              <div className="text-sm text-muted-foreground">전체 효율성</div>
              <div className="text-xs text-green-600 mt-1">+2.1% ↑</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-green-600 mb-2">96.8%</div>
              <div className="text-sm text-muted-foreground">품질 지수</div>
              <div className="text-xs text-green-600 mt-1">+0.5% ↑</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-orange-600 mb-2">87.5%</div>
              <div className="text-sm text-muted-foreground">가동률</div>
              <div className="text-xs text-red-600 mt-1">-1.2% ↓</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-background/50">
              <div className="text-3xl font-bold text-purple-600 mb-2">93.3%</div>
              <div className="text-sm text-muted-foreground">인력 활용률</div>
              <div className="text-xs text-green-600 mt-1">+1.8% ↑</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
