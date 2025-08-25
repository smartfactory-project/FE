"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

export function ProductionCharts() {
  const productionTrendData = [
    { month: "1월", production: 18500, target: 20000 },
    { month: "2월", production: 19200, target: 20000 },
    { month: "3월", production: 21300, target: 20000 },
    { month: "4월", production: 20800, target: 20000 },
    { month: "5월", production: 22100, target: 20000 },
    { month: "6월", production: 23400, target: 20000 },
    { month: "7월", production: 24200, target: 20000 },
    { month: "8월", production: 23800, target: 20000 },
    { month: "9월", production: 25100, target: 20000 },
    { month: "10월", production: 24600, target: 20000 },
    { month: "11월", production: 26200, target: 20000 },
    { month: "12월", production: 24847, target: 20000 },
  ]

  const dailyProductionData = [
    { day: "월", lineA: 420, lineB: 380, lineC: 290, lineD: 340, lineE: 280 },
    { day: "화", lineA: 410, lineB: 360, lineC: 310, lineD: 320, lineE: 290 },
    { day: "수", lineA: 450, lineB: 390, lineC: 300, lineD: 350, lineE: 310 },
    { day: "목", lineA: 430, lineB: 370, lineC: 280, lineD: 330, lineE: 300 },
    { day: "금", lineA: 387, lineB: 342, lineC: 0, lineD: 298, lineE: 220 },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">월별 생산량 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={productionTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="production"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="실제 생산량"
              />
              <Line
                type="monotone"
                dataKey="target"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 3 }}
                name="목표 생산량"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">라인별 주간 생산량</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dailyProductionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="lineA" fill="#3b82f6" name="라인 A" />
              <Bar dataKey="lineB" fill="#10b981" name="라인 B" />
              <Bar dataKey="lineC" fill="#f59e0b" name="라인 C" />
              <Bar dataKey="lineD" fill="#8b5cf6" name="라인 D" />
              <Bar dataKey="lineE" fill="#ef4444" name="라인 E" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
