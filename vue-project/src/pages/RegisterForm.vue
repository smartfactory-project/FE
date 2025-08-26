<template>
  <main class="container mx-auto px-4 py-12">
    <div class="mx-auto w-full max-w-md">
      <Card class="w-full shadow-lg border bg-card/50 backdrop-blur-sm">
        <CardHeader class="text-center pb-6">
          <div class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus class="w-6 h-6 text-primary" />
          </div>
          <CardTitle class="text-2xl font-bold text-foreground">회원가입</CardTitle>
          <CardDescription class="text-muted-foreground">
            MES 시스템에 가입하여 시작하세요
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <!-- 에러 메시지 -->
          <div v-if="errorMessage" class="p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ errorMessage }}</p>
          </div>

          <!-- 성공 메시지 -->
          <div v-if="successMessage" class="p-3 bg-green-50 border border-green-200 rounded-md">
            <p class="text-sm text-green-600">{{ successMessage }}</p>
          </div>

          <!-- 연결 테스트 버튼 -->
          <div class="text-center">
            <Button
              @click="testConnection"
              variant="outline"
              size="sm"
              :disabled="isTestingConnection"
            >
              <span v-if="isTestingConnection">연결 확인 중...</span>
              <span v-else>서버 연결 테스트</span>
            </Button>
            <p v-if="connectionStatus" class="text-xs mt-1" :class="connectionStatus.success ? 'text-green-600' : 'text-red-600'">
              {{ connectionStatus.message }}
            </p>
          </div>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="username" class="text-sm font-medium text-foreground">사용자명</Label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="사용자명을 입력하세요 (3자 이상)"
                  v-model="form.username"
                  class="pl-10 h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
                  :disabled="isLoading"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="email" class="text-sm font-medium text-foreground">이메일</Label>
              <div class="relative">
                <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요"
                  v-model="form.email"
                  class="pl-10 h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
                  :disabled="isLoading"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="password" class="text-sm font-medium text-foreground">비밀번호</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="비밀번호를 입력하세요 (6자 이상)"
                  v-model="form.password"
                  class="pl-10 h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
                  :disabled="isLoading"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="confirmPassword" class="text-sm font-medium text-foreground">비밀번호 확인</Label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  v-model="form.confirmPassword"
                  class="pl-10 h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
                  :disabled="isLoading"
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              :disabled="isLoading"
            >
              <span v-if="isLoading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                가입 중...
              </span>
              <span v-else>계정 만들기</span>
            </Button>
          </form>

          <div class="text-center pt-4 border-t border-border">
            <p class="text-sm text-muted-foreground">
              이미 계정이 있으신가요?
              <router-link to="/login" class="text-primary hover:text-primary/80 font-medium">
                로그인하기
              </router-link>
            </p>
            <p class="text-sm text-muted-foreground mt-2">
              <router-link to="/" class="text-primary hover:text-primary/80 font-medium">
                홈으로 돌아가기
              </router-link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Lucide Vue Icons
import { User, Mail, Lock, UserPlus } from 'lucide-vue-next'

// UI 컴포넌트들
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

// API 서비스
import { authAPI } from '@/services/api.js'

// Vue Router
const router = useRouter()

// 반응형 데이터
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 연결 테스트 관련
const isTestingConnection = ref(false)
const connectionStatus = ref(null)

// 서버 연결 테스트
const testConnection = async () => {
  isTestingConnection.value = true
  connectionStatus.value = null
  
  try {
    const response = await authAPI.healthCheck()
    connectionStatus.value = {
      success: true,
      message: '서버 연결 성공!'
    }
    console.log('Health check response:', response)
  } catch (error) {
    connectionStatus.value = {
      success: false,
      message: '서버에 연결할 수 없습니다.'
    }
    console.error('Health check failed:', error)
  } finally {
    isTestingConnection.value = false
  }
}

// 폼 유효성 검사
function validateForm() {
  errorMessage.value = ''

  // 사용자명 검사
  if (form.value.username.length < 3) {
    errorMessage.value = '사용자명은 3자 이상이어야 합니다.'
    return false
  }

  if (form.value.username.length > 50) {
    errorMessage.value = '사용자명은 50자 이하여야 합니다.'
    return false
  }

  // 이메일 검사
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    errorMessage.value = '올바른 이메일 형식이 아닙니다.'
    return false
  }

  // 비밀번호 길이 검사
  if (form.value.password.length < 6) {
    errorMessage.value = '비밀번호는 6자 이상이어야 합니다.'
    return false
  }

  // 비밀번호 확인
  if (form.value.password !== form.value.confirmPassword) {
    errorMessage.value = '비밀번호가 일치하지 않습니다.'
    return false
  }

  return true
}

// 폼 제출 처리
const handleSubmit = async () => {
  // 메시지 초기화
  errorMessage.value = ''
  successMessage.value = ''

  // 폼 유효성 검사
  if (!validateForm()) {
    return
  }

  isLoading.value = true

  try {
    console.log('회원가입 시도:', {
      username: form.value.username,
      email: form.value.email
    })

    // 백엔드 API 호출
    const response = await authAPI.register({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      confirmPassword: form.value.confirmPassword
    })

    console.log('회원가입 성공:', response)
    
    // 성공 메시지 표시
    successMessage.value = '회원가입이 완료되었습니다! 자동으로 로그인되었습니다.'
    
    // 폼 초기화
    form.value = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    }

    // 회원가입 성공 시 홈 페이지로 리다이렉트
    setTimeout(() => {
      router.push('/') // 홈 페이지로 이동
    }, 2000)

  } catch (error) {
    console.error('회원가입 실패:', error)
    
    // 에러 메시지 표시
    if (typeof error.error === 'string') {
      errorMessage.value = error.error
    } else if (error.message) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = '회원가입 중 오류가 발생했습니다. 서버 연결을 확인해주세요.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>