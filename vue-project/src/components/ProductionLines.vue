<template>
  <Card class="bg-card/50 backdrop-blur-sm border-border">
    <CardHeader>
      <CardTitle class="text-xl text-foreground">생산 라인 상세 현황</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4">
        <Card
          v-for="line in detailedLines"
          :key="line.id"
          class="bg-background/50 border-border"
        >
          <CardContent class="p-4">
            <!-- 상단: 라인 이름, 상태, 버튼 -->
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="font-semibold text-foreground mb-1">{{ line.name }}</h3>
                <div class="flex items-center space-x-2">
                  <Badge variant="secondary" :class="getStatusColor(line.status)">
                    <component :is="getStatusIcon(line.status)" class="w-4 h-4" />
                    <span class="ml-1">
                      {{
                        line.status === 'running'
                          ? '정상 가동'
                          : line.status === 'warning'
                          ? '주의 필요'
                          : '점검 중'
                      }}
                    </span>
                  </Badge>
                  <span class="text-sm text-muted-foreground">{{ line.shift }} 근무</span>
                </div>
              </div>
              <div class="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Settings class="w-4 h-4" />
                </Button>
                <Button
                  v-if="line.status === 'running'"
                  variant="outline"
                  size="sm"
                >
                  <Pause class="w-4 h-4" />
                </Button>
                <Button
                  v-else-if="line.status === 'warning'"
                  variant="outline"
                  size="sm"
                >
                  <Play class="w-4 h-4" />
                </Button>
              </div>
            </div>

            <!-- 주요 지표 -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p class="text-xs text-muted-foreground">효율성</p>
                <p class="text-lg font-bold text-foreground">{{ line.efficiency }}%</p>
                <Progress :value="line.efficiency" class="h-2 mt-1" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">생산량</p>
                <p class="text-lg font-bold text-foreground">{{ line.currentOutput }}/{{ line.targetOutput }}</p>
                <Progress :value="(line.currentOutput / line.targetOutput) * 100" class="h-2 mt-1" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">품질률</p>
                <p class="text-lg font-bold text-foreground">{{ line.quality }}%</p>
                <Progress :value="line.quality" class="h-2 mt-1" />
              </div>
              <div>
                <p class="text-xs text-muted-foreground">작업 인원</p>
                <p class="text-lg font-bold text-foreground">{{ line.workers }}명</p>
              </div>
            </div>

            <!-- 점검 및 이슈 -->
            <div class="flex justify-between items-center text-sm text-muted-foreground">
              <div>
                <span>마지막 점검: {{ line.lastMaintenance }}</span>
                <span class="mx-2">•</span>
                <span>다음 점검: {{ line.nextMaintenance }}</span>
              </div>
              <div v-if="line.issues.length > 0" class="flex items-center space-x-1">
                <AlertTriangle class="w-4 h-4 text-yellow-500" />
                <span class="text-yellow-600">{{ line.issues.join(", ") }}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import Card from "@/components/ui/card/Card.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import Progress from "@/components/ui/Progress.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import { Settings, Play, Pause, AlertTriangle, CheckCircle, Clock } from "lucide-vue-next"

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

const getStatusColor = (status) => {
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

const getStatusIcon = (status) => {
  switch (status) {
    case "running":
      return CheckCircle
    case "warning":
      return AlertTriangle
    case "maintenance":
      return Clock
    default:
      return Clock
  }
}
</script>
