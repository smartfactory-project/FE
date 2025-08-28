<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4">
    <!-- 상단 뒤로가기(홈) -->
    <div class="w-full max-w-lg md:max-w-xl mb-3">
      <router-link
        to="/"
        class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="h-4 w-4 mr-1" />
        홈으로 돌아가기
      </router-link>
    </div>

    <Card class="w-full max-w-lg md:max-w-xl">
      <form @submit.prevent="handleSubmit">
        <CardContent class="space-y-4">
          <!-- 에러 메시지 -->
          <p
            v-if="errorMsg"
            class="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2"
          >
            {{ errorMsg }}
          </p>

          <div class="space-y-2">
            <Label for="username">아이디</Label>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="아이디를 입력하세요"
              v-model="formData.username"
              autocomplete="username"
              required
            />
          </div>

          <div class="space-y-2">
            <Label for="password">비밀번호</Label>
            <div class="relative">
              <Input
                id="password"
                name="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="비밀번호를 입력하세요"
                v-model="formData.password"
                autocomplete="current-password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4 text-muted-foreground" />
                <Eye v-else class="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          </div>
        </CardContent>

        <CardFooter class="flex flex-col space-y-4 mt-3 md:mt-4">
          <Button type="submit" class="w-full" :disabled="isLoading" :aria-busy="isLoading">
            <span v-if="!isLoading">로그인</span>
            <span v-else>로그인 중…</span>
          </Button>

          <div class="flex justify-center space-x-4 text-sm">
            <button
              type="button"
              class="text-muted-foreground hover:text-primary"
              @click="onFindId"
            >
              아이디 찾기
            </button>
            <span class="text-muted-foreground">|</span>
            <button
              type="button"
              class="text-muted-foreground hover:text-primary"
              @click="onFindPassword"
            >
              비밀번호 찾기
            </button>
          </div>

          <!-- 회원가입 유도 -->
          <p class="text-sm text-muted-foreground text-center">
            계정이 없으신가요?
            <router-link
              to="/register"
              class="text-primary hover:text-primary/80 font-medium"
            >
              회원가입
            </router-link>
          </p>
        </CardFooter>
      </form>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Eye, EyeOff, ArrowLeft } from 'lucide-vue-next'
import { authAPI } from '@/services/api.js'
import { useAuthStore } from '@/stores/auth.js'

import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'

const router = useRouter()
const auth = useAuthStore()

const showPassword = ref(false)
const isLoading = ref(false)
const errorMsg = ref<string | null>(null)

const formData = reactive({
  username: '',
  password: '',
})

async function handleSubmit() {
  errorMsg.value = null
  if (!formData.username.trim() || !formData.password) {
    errorMsg.value = '아이디와 비밀번호를 입력하세요.'
    return
  }

  try {
    isLoading.value = true

    // 1) 로그인 API 호출
    const data = await authAPI.login({
      username: formData.username.trim(),
      password: formData.password,
    })
    // 2) Pinia 스토어 갱신
    auth.login({
      token: data.token,
      user: {
        userId: data.userId,
        username: data.username,
        email: data.email,
        role: data.role,
      },
    })
    // 3) 이동
    const redirect = (router.currentRoute.value.query.redirect as string) || '/'
    router.push(redirect)
  } catch (e: any) {
    errorMsg.value = e?.error || e?.message || '로그인에 실패했습니다.'
  } finally {
    isLoading.value = false
  }
}

function onFindId() {
  alert('아이디 찾기 기능은 UI만 구현되었습니다.')
}

function onFindPassword() {
  alert('비밀번호 찾기 기능은 UI만 구현되었습니다.')
}
</script>
