"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

export function QualityCharts() {
  const qualityDistributionData = [
    { name: "합격", value: 96.8, color: "#10b981" },
    { name: "재작업", value: 2.1, color: "#f59e0b" },
    { name: "불량", value: 1.1, color: "#ef4444" },
  ]

  const qualityTrendData = [
    { week: "1주", quality: 94.2, defects: 12 },
    { week: "2주", quality: 95.1, defects: 8 },
    { week: "3주", quality: 96.3, defects: 6 },
    { week: "4주", quality: 97.1, defects: 4 },
    { week: "5주", quality: 96.8, defects: 5 },
    { week: "6주", quality: 98.2, defects: 3 },
    { week: "7주", quality: 97.5, defects: 4 },
    { week: "8주", quality: 96.8, defects: 5 },
  ]

  return (
    <div className="space-y-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">품질 분포</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={qualityDistributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {qualityDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">품질률 추이</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={qualityTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" domain={[90, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="quality"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                strokeWidth={3}
                name="품질률 (%)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
