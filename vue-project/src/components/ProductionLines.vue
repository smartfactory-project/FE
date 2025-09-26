<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Card from "@/components/ui/card/Card.vue"
import CardHeader from "@/components/ui/card/CardHeader.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import CardTitle from "@/components/ui/card/CardTitle.vue"
import Progress from "@/components/ui/Progress.vue"
import Badge from "@/components/ui/Badge.vue"
import Button from "@/components/ui/Button.vue"
import { Settings, Play, Pause, AlertTriangle, CheckCircle, Clock } from "lucide-vue-next"
import statisticsAPI from '@/services/statistics.js'

const leftWidth = ref(60)
const rightWidth = ref(40)
const isDraggingLeft = ref(false)
const isDraggingRight = ref(false)

function onLeftMouseDown() {
  isDraggingLeft.value = true
  document.body.style.cursor = 'col-resize'
}
function onRightMouseDown() {
  isDraggingRight.value = true
  document.body.style.cursor = 'col-resize'
}
function onMouseMove(e) {
  const container = document.getElementById('resizable-container')
  if (!container) return
  const rect = container.getBoundingClientRect()
  if (isDraggingLeft.value) {
    let percent = ((e.clientX - rect.left) / rect.width) * 100
    percent = Math.max(20, Math.min(80, percent))
    leftWidth.value = percent
    rightWidth.value = 100 - percent
  }
  if (isDraggingRight.value) {
    let percent = ((e.clientX - rect.left) / rect.width) * 100
    percent = Math.max(20, Math.min(80, percent))
    rightWidth.value = percent
    leftWidth.value = 100 - percent
  }
}
function onMouseUp() {
  isDraggingLeft.value = false
  isDraggingRight.value = false
  document.body.style.cursor = ''
}
onMounted(() => {
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)
})
onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', onMouseUp)
})

const detailedLines = ref([])
const loading = ref(true)
const error = ref(null)

function getStatusBgColor(status) {
  switch (status) {
    case "running": return "#dcfce7" // bg-green-100
    case "warning": return "#fef3c7" // bg-yellow-100
    case "maintenance": return "#fee2e2" // bg-red-100
    default: return "#f3f4f6" // bg-gray-100
  }
}

function getStatusTextColor(status) {
  switch (status) {
    case "running": return "#15803d" // text-green-700
    case "warning": return "#a16207" // text-yellow-700
    case "maintenance": return "#b91c1c" // text-red-700
    default: return "#374151" // text-gray-700
  }
}
function getStatusIcon(status) {
  switch (status) {
    case "running": return CheckCircle
    case "warning": return AlertTriangle
    case "maintenance": return Clock
    default: return Clock
  }
}
onMounted(async () => {
  try {
    loading.value = true
    const lines = await statisticsAPI.getLines()
    detailedLines.value = lines.map(l => ({
      id: l.id,
      name: l.name,
      status: l.status,
      efficiency: l.efficiency,
      currentOutput: l.currentOutput,
      targetOutput: 350,
      quality: l.quality,
      workers: l.workers,
      shift: l.shift,
      lastMaintenance: l.lastMaintenance,
      nextMaintenance: l.nextMaintenance,
      issues: l.issues || []
    }))
  } catch (e) {
    error.value = '데이터를 불러올 수 없습니다.'
  } finally {
    loading.value = false
  }
})

const maintenanceLines = computed(() =>
  detailedLines.value.filter(l => typeof l.efficiency === 'number' && l.efficiency < 10)
)
</script>

<template>
  <div id="resizable-container" class="flex justify-between max-w-none mx-0 px-0">
    <!-- 생산 라인 상세 현황 -->
    <Card
      class="bg-card/50 backdrop-blur-sm border-border h-full flex flex-col w-full"
      :style="{ width: leftWidth + '%' }"
    >
      <!-- 왼쪽 리사이저 (카드 오른쪽) -->
      <div
        style="width:6px;cursor:col-resize;background:#e5e7eb;z-index:10;position:absolute;top:0;right:-3px;height:100%;"
        @mousedown="onLeftMouseDown"
      ></div>
      <CardHeader>
        <CardTitle class="text-xl text-foreground">생산 라인 상세 현황</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <Card
            v-for="line in detailedLines"
            :key="line.id"
            class="bg-background/50 border-border"
          >
            <CardContent class="p-4">
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="font-semibold text-foreground mb-1">{{ line.name }}</h3>
                  <div class="flex items-center space-x-2">
                    <Badge
                        variant="secondary"
                        :style="{
    backgroundColor: getStatusBgColor(line.status),
    color: getStatusTextColor(line.status)
  }"
                    >
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
                <div class="flex space-x-2 ">
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
              <div class="grid grid-cols-2 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p class="text-xs text-muted-foreground">효율성</p>
                  <p class="text-lg font-bold text-foreground">{{ line.efficiency }}%</p>
                  <Progress :value="line.efficiency" class="h-2 mt-1" />
                </div>
                <div>
                  <p class="text-xs text-muted-foreground">생산량</p>
                  <p class="text-lg font-bold text-foreground">{{ line.currentOutput }}/350</p>
                  <Progress :value="(line.currentOutput / line.targetOutput) * 100" class="h-2 mt-1" />
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
                  <span class="text-yellow-600">{{ line.issues.join(', ') }}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
    <!-- 점검 예정 영역 -->
    <Card
      class="bg-card/50 backdrop-blur-sm border-border h-full flex flex-col w-full"
      :style="{ width: rightWidth + '%' }"
    >
      <!-- 오른쪽 리사이저 (카드 오른쪽) -->
      <div
        style="width:6px;cursor:col-resize;background:#e5e7eb;z-index:10;position:absolute;top:0;right:-3px;height:100%;"
        @mousedown="onRightMouseDown"
      ></div>
      <CardHeader>
        <CardTitle class="text-xl text-foreground">점검 예정</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-4 max-h-[600px] overflow-y-auto pr-2">
          <div v-for="line in maintenanceLines" :key="line.id" class="p-4 rounded-lg bg-gray-50">
            <h3 class="font-semibold mb-2 text-red-600">{{ line.name }}</h3>
            <div class="text-xs text-gray-600 mb-1">상태: 점검 예정</div>
            <div class="text-xs text-gray-600">마지막 점검: {{ line.lastMaintenance }}</div>
            <div class="text-xs text-gray-600">다음 점검: {{ line.nextMaintenance }}</div>
          </div>
          <div v-if="maintenanceLines.length === 0" class="text-center text-gray-400 py-8">점검 예정 라인이 없습니다.</div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>