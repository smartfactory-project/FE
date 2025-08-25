"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Settings, Play, Pause, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export function ProductionLines() {
  const detailedLines = [
    {
      id: "A",
      name: "라인 A - 메인 어셈블리",
      status: "running",
      efficiency: 94,
      currentOutput: 387,
      targetOutput: 400,
      quality: 98.2,
      workers: 8,
      shift: "주간",
      lastMaintenance: "2일 전",
      nextMaintenance: "5일 후",
      issues: [],
    },
    {
      id: "B",
      name: "라인 B - 부품 가공",
      status: "running",
      efficiency: 91,
      currentOutput: 342,
      targetOutput: 380,
      quality: 96.8,
      workers: 6,
      shift: "주간",
      lastMaintenance: "1주 전",
      nextMaintenance: "3일 후",
      issues: ["소음 증가"],
    },
    {
      id: "C",
      name: "라인 C - 품질 검사",
      status: "maintenance",
      efficiency: 0,
      currentOutput: 0,
      targetOutput: 300,
      quality: 0,
      workers: 2,
      shift: "점검",
      lastMaintenance: "진행 중",
      nextMaintenance: "완료 후",
      issues: ["정기 점검"],
    },
    {
      id: "D",
      name: "라인 D - 포장",
      status: "running",
      efficiency: 88,
      currentOutput: 298,
      targetOutput: 350,
      quality: 99.1,
      workers: 5,
      shift: "주간",
      lastMaintenance: "3일 전",
      nextMaintenance: "1주 후",
      issues: [],
    },
    {
      id: "E",
      name: "라인 E - 최종 조립",
      status: "warning",
      efficiency: 76,
      currentOutput: 220,
      targetOutput: 320,
      quality: 94.5,
      workers: 7,
      shift: "주간",
      lastMaintenance: "5일 전",
      nextMaintenance: "내일",
      issues: ["온도 상승", "속도 저하"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-700"
      case "warning":
        return "bg-yellow-100 text-yellow-700"
      case "maintenance":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="w-4 h-4" />
      case "warning":
        return <AlertTriangle className="w-4 h-4" />
      case "maintenance":
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">생산 라인 상세 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {detailedLines.map((line) => (
            <Card key={line.id} className="bg-background/50 border-border">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{line.name}</h3>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className={getStatusColor(line.status)}>
                        {getStatusIcon(line.status)}
                        <span className="ml-1">
                          {line.status === "running"
                            ? "정상 가동"
                            : line.status === "warning"
                              ? "주의 필요"
                              : "점검 중"}
                        </span>
                      </Badge>
                      <span className="text-sm text-muted-foreground">{line.shift} 근무</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                    {line.status === "running" ? (
                      <Button variant="outline" size="sm">
                        <Pause className="w-4 h-4" />
                      </Button>
                    ) : line.status === "warning" ? (
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4" />
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">효율성</p>
                    <p className="text-lg font-bold text-foreground">{line.efficiency}%</p>
                    <Progress value={line.efficiency} className="h-2 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">생산량</p>
                    <p className="text-lg font-bold text-foreground">
                      {line.currentOutput}/{line.targetOutput}
                    </p>
                    <Progress value={(line.currentOutput / line.targetOutput) * 100} className="h-2 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">품질률</p>
                    <p className="text-lg font-bold text-foreground">{line.quality}%</p>
                    <Progress value={line.quality} className="h-2 mt-1" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">작업 인원</p>
                    <p className="text-lg font-bold text-foreground">{line.workers}명</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <div>
                    <span>마지막 점검: {line.lastMaintenance}</span>
                    <span className="mx-2">•</span>
                    <span>다음 점검: {line.nextMaintenance}</span>
                  </div>
                  {line.issues.length > 0 && (
                    <div className="flex items-center space-x-1">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-yellow-600">{line.issues.join(", ")}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
