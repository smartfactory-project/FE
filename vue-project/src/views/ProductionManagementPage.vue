<script setup>
import { ref, computed } from "vue"
import { VueFlow } from "@vue-flow/core"
import "@vue-flow/core/dist/style.css"
import "@vue-flow/core/dist/theme-default.css"

import { factories } from "@/data/factories.js"

const selectedFactory = ref(factories[0])
const selectedLine = ref(null)

const selectedStep = ref(null)
const showModal = ref(false)

// 노드/엣지 생성
const flowElements = computed(() => {
  if (!selectedLine.value) return { nodes: [], edges: [] }

  const maxPerRow = 4 // 한 줄에 표시할 공정 수
  const gapX = 250
  const gapY = 150

  const nodes = selectedLine.value.steps.map((step, idx) => {
    const row = Math.floor(idx / maxPerRow)
    const col = idx % maxPerRow

    // 짝수줄: 왼→오, 홀수줄: 오→왼
    const actualCol = row % 2 === 0 ? col : maxPerRow - 1 - col
    const sourcePos = row % 2 === 0 ? "right" : "left"
    const targetPos = row % 2 === 0 ? "left" : "right"

    return {
      id: String(idx + 1),
      position: { x: actualCol * gapX, y: row * gapY },
      data: { label: step.name, raw: step },
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
  selectedLine.value.steps.forEach((_, idx) => {
    const row = Math.floor(idx / maxPerRow)
    const col = idx % maxPerRow
    const isRowEnd = (col === maxPerRow - 1 && row % 2 === 0) || (col === 0 && row % 2 === 1)

    // 같은 row 내부 연결
    if (!isRowEnd && idx < selectedLine.value.steps.length - 1) {
      edges.push({
        id: `e${idx + 1}-${idx + 2}`,
        source: String(idx + 1),
        target: String(idx + 2),
        animated: true,
        style: { stroke: "#2563eb", strokeWidth: 5 },
      })
    }

    // row 끝 ↔ 다음 row 시작 연결
    if (isRowEnd && idx < selectedLine.value.steps.length - 1) {
      edges.push({
        id: `e${idx + 1}-${idx + 2}`,
        source: String(idx + 1),
        target: String(idx + 2),
        animated: true,
        type: "smoothstep", // 꺾이는 라인
        style: { stroke: "#2563eb", strokeWidth: 5 },
      })
    }
  })

  return { nodes, edges }
})



// 노드 클릭 → 모달 열기
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
<!--    <h1 class="text-3xl font-extrabold text-center text-blue-800 mb-8">-->
<!--      자동차 생산 공정 플로우-->
<!--    </h1>-->

    <!-- 공장 선택 -->
    <div class="flex mb-8">
      <select v-model="selectedFactory" class="px-4 py-2 border rounded-lg shadow">
        <option v-for="factory in factories" :key="factory.name" :value="factory">
          {{ factory.name }} 공장
        </option>
      </select>
    </div>

    <!-- 라인 선택 -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div
          v-for="line in selectedFactory.lines"
          :key="line.type"
          class="p-6 bg-white rounded-xl shadow hover:shadow-lg cursor-pointer border transition"
          @click="selectedLine = line"
      >
        <h2 class="text-xl font-bold text-gray-800">{{ line.type }}</h2>
        <p class="text-sm text-gray-500">{{ line.steps.length }}개 공정</p>
      </div>
    </div>

    <!-- 플로우 차트 -->
    <div v-if="selectedLine" class="h-[500px] w-full bg-gray-50 border rounded-lg">
      <VueFlow
          :nodes="flowElements.nodes"
          :edges="flowElements.edges"
          fit-view
          :fit-view-options="{ padding: 0.2 }"
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
          {{ selectedStep?.name }} 상세 현황
        </h2>

        <p class="text-gray-700 mb-2">
          장비: {{ selectedStep?.machines.join(", ") }}
        </p>
        <p v-if="selectedStep?.note" class="text-gray-500 italic mb-4">
          ※ {{ selectedStep.note }}
        </p>

        <!-- 현황 데이터 (performance 필드가 있다면 출력) -->
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">가동률</p>
            <p>{{ selectedStep?.performance?.rate || 'N/A' }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">생산량</p>
            <p>{{ selectedStep?.performance?.output || 'N/A' }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">불량률</p>
            <p>{{ selectedStep?.performance?.defect || 'N/A' }}</p>
          </div>
          <div class="bg-gray-100 p-4 rounded-lg">
            <p class="font-semibold">가동 상태</p>
            <p>{{ selectedStep?.performance?.status || 'N/A' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
