<script setup>
import { ref, computed, onMounted } from "vue"
import { VueFlow } from "@vue-flow/core"
import "@vue-flow/core/dist/style.css"
import "@vue-flow/core/dist/theme-default.css"

import { fetchFactories, fetchCarsByFactory, fetchLineRoutings } from "@/services/line.js"

const factories = ref([])
const cars = ref([])
const selectedFactory = ref(null)
const selectedCar = ref(null)
const selectedLine = ref(null)
const steps = ref([])
const loading = ref(false)

onMounted(async () => {
  factories.value = await fetchFactories()
})

async function selectFactory(factory) {
  selectedFactory.value = factory
  selectedCar.value = null
  selectedLine.value = null
  console.log(factory)
  cars.value = await fetchCarsByFactory(factory.facId)
}

async function selectCar(car) {
  selectedCar.value = car
  loading.value = true
  try {
    const data = await fetchLineRoutings(car.carId)
    steps.value = data.nodes || []
    selectedLine.value = { type: data.productId, steps: steps.value }
  } finally {
    loading.value = false
  }
}

const selectedStep = ref(null)
const showModal = ref(false)

// ㄹ자형 배치 로직
const flowElements = computed(() => {
  if (!selectedLine.value) return { nodes: [], edges: [] }

  const maxPerRow = 4
  const gapX = 250
  const gapY = 150

  const nodes = selectedLine.value.steps.map((step, idx) => {
    const row = Math.floor(idx / maxPerRow)
    const col = idx % maxPerRow
    const actualCol = row % 2 === 0 ? col : maxPerRow - 1 - col
    const sourcePos = row % 2 === 0 ? "right" : "left"
    const targetPos = row % 2 === 0 ? "left" : "right"

    return {
      id: String(step.routingId),
      position: { x: actualCol * gapX, y: row * gapY },
      data: { label: `${step.processType} (${step.lineId})`, raw: step },
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
  selectedLine.value.steps.forEach((step, idx) => {
    const row = Math.floor(idx / maxPerRow)
    const col = idx % maxPerRow
    const isRowEnd =
        (col === maxPerRow - 1 && row % 2 === 0) ||
        (col === 0 && row % 2 === 1)

    if (!isRowEnd && idx < selectedLine.value.steps.length - 1) {
      edges.push({
        id: `e${step.routingId}-${selectedLine.value.steps[idx + 1].routingId}`,
        source: String(step.routingId),
        target: String(selectedLine.value.steps[idx + 1].routingId),
        animated: true,
        style: { stroke: "#2563eb", strokeWidth: 2 },
      })
    }

    if (isRowEnd && idx < selectedLine.value.steps.length - 1) {
      edges.push({
        id: `e${step.routingId}-${selectedLine.value.steps[idx + 1].routingId}`,
        source: String(step.routingId),
        target: String(selectedLine.value.steps[idx + 1].routingId),
        animated: true,
        type: "step",
        style: { stroke: "#2563eb", strokeWidth: 2 },
      })
    }
  })

  return { nodes, edges }
})

function handleNodeClick(event) {
  selectedStep.value = event.node.data.raw
  showModal.value = true
}
function closeModal() {
  showModal.value = false
  selectedStep.value = null
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

    <!-- 차트 -->
    <div v-if="loading" class="text-center text-gray-500">로딩 중...</div>
    <div v-else-if="selectedLine" class="h-[500px] w-full bg-gray-50 border rounded-lg">
      <VueFlow
          :nodes="flowElements.nodes"
          :edges="flowElements.edges"
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
    <div v-if="showModal" class="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div class="bg-white rounded-xl shadow-lg p-8 w-[600px] max-h-[80vh] overflow-y-auto relative">
        <button
            class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            @click="closeModal"
        >
          ✕
        </button>
        <h2 class="text-2xl font-bold text-blue-700 mb-4">
          {{ selectedStep?.processType }} ({{ selectedStep?.lineId }})
        </h2>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">Routing ID</p>
            <p>{{ selectedStep?.routingId }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">순서</p>
            <p>{{ selectedStep?.processSeq }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">라인</p>
            <p>{{ selectedStep?.lineId }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">소요 시간</p>
            <p>{{ selectedStep?.duration }} 분</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
