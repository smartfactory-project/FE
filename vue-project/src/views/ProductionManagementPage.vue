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

function handleNodeClick(event) {
  selectedStation.value = event.node.data.raw
  showModal.value = true
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
