<template>
  <div class="mb-6">
    <form @submit.prevent="handleUpload" enctype="multipart/form-data">
      <label class="block mb-2 font-semibold">시뮬레이션 리포트(HTML) 업로드</label>
      <input type="file" accept=".htm,.html" @change="onFileChange" required />
      <button type="submit" class="ml-2 px-4 py-2 bg-blue-600 text-white rounded" :disabled="loading">
        업로드
      </button>
      <span v-if="success" class="ml-2 text-green-600">업로드 성공!</span>
      <span v-if="error" class="ml-2 text-red-600">{{ error }}</span>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiClient from '@/services/api.js' // axios 인스턴스
import { useFactoryStore } from '@/stores/factoryStore.js'

const factoryStore = useFactoryStore()

const file = ref(null)
const loading = ref(false)
const success = ref(false)
const error = ref('')

function onFileChange(e) {
  file.value = e.target.files[0]
  success.value = false
  error.value = ''
}

async function handleUpload() {
  if (!file.value) return
  loading.value = true
  error.value = ''
  success.value = false
  try {
    const formData = new FormData()
    formData.append('file', file.value)
    await apiClient.post('/api/statistics/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    // 파일명에서 확장자 제거 후 factory 값 자동 변경
    const filename = file.value.name.replace(/\.[^.]+$/, '')
    factoryStore.setFactory(filename)
    success.value = true
  } catch (err) {
    error.value = err?.response?.data?.message || '업로드 실패'
  } finally {
    loading.value = false
  }
}
</script>