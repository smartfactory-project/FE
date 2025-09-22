<script setup>
import { ref, onUnmounted, watch } from "vue"
import SockJS from "sockjs-client"
import Stomp from "stompjs"

const props = defineProps({
  station: { type: Object, required: true },
  show: { type: Boolean, required: true }
})
const emit = defineEmits(["close"])

const stationData = ref(null)
let stompClient = null

function connect(stationId) {
  const socket = new SockJS("http://localhost:8080/ws")
  stompClient = Stomp.over(socket)
  stompClient.connect({}, () => {
    stompClient.subscribe(`/topic/station/${stationId}`, (msg) => {
      stationData.value = JSON.parse(msg.body)
    })
  })
}

function disconnect() {
  if (stompClient) {
    stompClient.disconnect()
    stompClient = null
  }
}

watch(
    () => props.show,
    (newVal) => {
      if (newVal && props.station?.stationId) {
        stationData.value = null
        connect(props.station.stationId)
      } else {
        disconnect()
      }
    }
)

onUnmounted(() => disconnect())
</script>

<template>
  <div
      v-if="show"
      class="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
      @click.self="$emit('close')"
  >
    <div class="bg-white rounded-xl shadow-lg p-8 w-[600px] max-h-[80vh] overflow-y-auto relative">
      <!-- 닫기 버튼 -->
      <button
          class="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          @click="$emit('close')"
      >
        ✕
      </button>

      <h2 class="text-2xl font-bold text-blue-700 mb-4">
        {{ station?.stationName }}
      </h2>

      <!-- station 기본 정보 -->
      <div class="grid grid-cols-2 gap-4 text-sm mb-6">
        <div class="bg-gray-100 p-4 rounded-lg">
          <p class="font-semibold">Station ID</p>
          <p>{{ station?.stationId }}</p>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg">
          <p class="font-semibold">라인</p>
          <p>{{ station?.lineName }}</p>
        </div>
      </div>

      <!-- Kafka 실시간 데이터 -->
      <div v-if="stationData" class="bg-blue-50 p-4 rounded-lg">
        <h3 class="font-bold mb-2">실시간 현황</h3>
        <pre class="text-sm">{{ stationData }}</pre>
      </div>
      <p v-else class="text-gray-500">데이터 수신 대기 중...</p>
    </div>
  </div>
</template>
