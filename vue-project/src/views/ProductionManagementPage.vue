<script setup>
import { ref, computed, onMounted } from "vue"
import { VueFlow } from "@vue-flow/core"
import "@vue-flow/core/dist/style.css"
import "@vue-flow/core/dist/theme-default.css"

import {
  fetchFactories,
  fetchCarsByFactory,
  fetchLineRoutings,
  fetchStations
} from "@/services/line.js"
// import StationModal from "@/components/StationModal.vue";

const factories = ref([])
const cars = ref([])
const lines = ref([])
const stations = ref([])

const selectedFactory = ref(null)
const selectedCar = ref(null)
const selectedLine = ref(null)

const loading = ref(false)

onMounted(async () => {
  factories.value = await fetchFactories()
})

async function selectFactory(factory) {
  selectedFactory.value = factory
  selectedCar.value = null
  selectedLine.value = null
  stations.value = []
  cars.value = await fetchCarsByFactory(factory.facId)
}

async function selectCar(car) {
  selectedCar.value = car
  selectedLine.value = null
  stations.value = []
  loading.value = true
  try {
    const data = await fetchLineRoutings(car.carId)
    lines.value = data.nodes || []
  } finally {
    loading.value = false
  }
}

async function selectLine(line) {
  console.log("선택한 라인:", line.lineId, line)
  selectedLine.value = line
  loading.value = true
  console.log(selectedFactory.value.facId, line.lineId)
  try {
    const data = await fetchStations(selectedFactory.value.facId, line.lineId)
    console.log(data)
    stations.value = data
  } finally {
    loading.value = false
  }
}

// ==== ㄹ자형 배치 ====
function buildLFlow(items, idKey, labelKey, maxPerRow = 4) {
  if (!items.length) return { nodes: [], edges: [] }

  const gapX = 250
  const gapY = 150

  const nodes = items.map((item, idx) => {
    const row = Math.floor(idx / maxPerRow)
    const col = idx % maxPerRow
    const actualCol = row % 2 === 0 ? col : maxPerRow - 1 - col
    const sourcePos = row % 2 === 0 ? "right" : "left"
    const targetPos = row % 2 === 0 ? "left" : "right"

    return {
      id: String(item[idKey]),
      position: { x: actualCol * gapX + 75 , y: row * gapY + 75 },
      data: { label: typeof labelKey === "function" ? labelKey(item) : item[labelKey], raw: item },
      style: {
        width: 200,
        height: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "3px solid #2563eb",
        borderRadius: "12px",
        background: "white",
        fontWeight: "600",
        textAlign: "center",
        fontSize: "14px",
        cursor: "pointer",
      },
      sourcePosition: sourcePos,
      targetPosition: targetPos,
    }
  })

  const edges = []
  items.forEach((item, idx) => {
    const row = Math.floor(idx / maxPerRow)
    const col = idx % maxPerRow
    const isRowEnd =
        (col === maxPerRow - 1 && row % 2 === 0) ||
        (col === 0 && row % 2 === 1)

    if (!isRowEnd && idx < items.length - 1) {
      edges.push({
        id: `e${items[idx][idKey]}-${items[idx + 1][idKey]}`,
        source: String(items[idx][idKey]),
        target: String(items[idx + 1][idKey]),
        animated: true,
        style: { stroke: "#2563eb", strokeWidth: 2 },
      })
    }

    if (isRowEnd && idx < items.length - 1) {
      edges.push({
        id: `e${items[idx][idKey]}-${items[idx + 1][idKey]}`,
        source: String(items[idx][idKey]),
        target: String(items[idx + 1][idKey]),
        animated: true,
        type: "step",
        style: { stroke: "#2563eb", strokeWidth: 2 },
      })
    }
  })

  return { nodes, edges }
}

const stationFlow = computed(() =>
    buildLFlow(stations.value, "stationId", (s) => s.stationName)
)

// ==== 모달 상태 ====
const showModal = ref(false)
const selectedStation = ref(null)

const MAX_BY_PROCESS = { press: 4, body: 4, paint: 4, assy: 6 }

function toUrl(processType, stationNo) {
  const proc = String(processType || "").toLowerCase() // press/body/paint/assy
  const maxN = MAX_BY_PROCESS[proc] ?? 6
  const n = Math.max(1, Math.min(stationNo, maxN))
  return `http://192.168.203.84:11005/?Pro=${proc}_station${n}#MONITORING`
}

function getStationNumber(node) {
  // ① stations 배열에서 순서 기반 번호 (1..N)
  const raw = node.data.raw
  const idx = stations.value.findIndex(s => s.stationId === raw.stationId)
  if (idx >= 0) return idx + 1

  // ② 혹시 stationName에 숫자가 있으면 그걸 우선 사용 (예: "...-03")
  const m = String(raw?.stationName || "").match(/(\d{1,2})$/)
  if (m) return parseInt(m[1], 10)

  return 1
}

// function handleNodeClick(event) {
//   selectedStation.value = event.node.data.raw
//   showModal.value = true
// }

let lastPopupAt = 0
function openPopup(url, { width = 1200, height = 800, name = "monitoring_popup" } = {}) {
  const now = Date.now()
  if (now - lastPopupAt < 500) return
  lastPopupAt = now
  // 화면 가운데 정렬
  const dualScreenLeft = window.screenLeft ?? window.screenX ?? 0
  const dualScreenTop  = window.screenTop  ?? window.screenY ?? 0
  const w = window.innerWidth  ?? document.documentElement.clientWidth  ?? screen.width
  const h = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height
  const left = Math.max(0, dualScreenLeft + (w - width) / 2)
  const top  = Math.max(0, dualScreenTop  + (h - height) / 2)

  const features = [
    `width=${width}`, `height=${height}`,
    `left=${left}`, `top=${top}`,
    "resizable=yes", "scrollbars=yes",
    "menubar=no", "toolbar=no", "location=no", "status=no",
    "noopener=yes"
  ].join(",")
  const win = window.open(url, name, features)
  if (win == null) {
   console.warn("Popup was blocked. Please allow popups for this site.")
   return false
 }
 win.focus()
 return true
}
function handleNodeClick({ node }) {
  const stationNo = getStationNumber(node)
  const processType = selectedLine.value?.processType
  const url = toUrl(processType, stationNo)
  openPopup(url, { width: 1280, height: 820, name: `mon_${processType}_${stationNo}` })
}
</script>

<template>
  <div class="p-10">
    <!-- 공장 선택 -->
    <h2 class="text-xl font-bold mb-4">공장 선택</h2>
    <div class="flex flex-wrap gap-4 mb-10">
      <button
          v-for="factory in factories"
          :key="factory.facId + factory.facName"
          @click="selectFactory(factory)"
          class="px-6 py-3 rounded-lg border shadow hover:bg-blue-100"
          :class="{ 'bg-blue-600 text-white': selectedFactory?.facId === factory.facId }"
      >
        {{ factory.facName }}
      </button>
    </div>

    <!-- 차종 선택 -->
    <div v-if="selectedFactory" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
      <div
          v-for="car in cars"
          :key="car.carId"
          class="p-4 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer border transition flex flex-col items-center"
          @click="selectCar(car)"
          :class="{ 'border-blue-600 ring-2 ring-blue-300': selectedCar?.carId === car.carId }"
      >
        <img :src="car.imageUrl" :alt="car.carName" class="h-24 object-contain mb-2" />
        <h2 class="text-lg font-bold text-gray-800">{{ car.carName }}</h2>
      </div>
    </div>

    <!-- 라인 선택 -->
    <div v-if="selectedCar && lines.length" class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div
          v-for="line in lines"
          :key="line.lineId"
          class="p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer border transition"
          @click="selectLine(line)"
          :class="{ 'border-blue-600 ring-2 ring-blue-300': selectedLine?.lineId === line.lineId }"
      >
        <h2 class="text-xl font-bold text-gray-800">{{ line.processType }}</h2>
        <p class="text-sm text-gray-500">라인: {{ line.lineId }}</p>
        <p class="text-xs text-gray-400">소요 시간: {{ line.duration }}분</p>
      </div>
    </div>

    <!-- Station 차트 -->
    <div v-if="stations.length" class="h-[500px] w-full bg-gray-50 border rounded-lg">
      <VueFlow
          :nodes="stationFlow.nodes"
          :edges="stationFlow.edges"
          fit-view
          :zoom-on-scroll="false"
          :zoom-on-double-click="false"
          :nodes-draggable="false"
          :zoom-on-pinch="false"
          :pan-on-drag="false"
          :pan-on-scroll="false"
          :zoom-activation-key-code="null"
          @node-click="handleNodeClick"
      />
    </div>

    <!-- 모달 -->
<!--    <StationModal-->
<!--        :station="selectedStation"-->
<!--        :show="showModal"-->
<!--        @close="showModal = false"-->
<!--    />-->
  </div>
</template>
