<template>
  <!-- 배경/여백 -->
  <main class="container mx-auto px-4 py-12">
    <!-- 가운데 정렬 + 최대 폭 제한 -->
    <div class="mx-auto w-full max-w-md">
      <Card class="w-full shadow-lg border bg-card/50 backdrop-blur-sm">
        <CardHeader class="text-center pb-6">
          <div class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UserPlus class="w-6 h-6 text-primary" />
          </div>
          <CardTitle class="text-2xl font-bold text-foreground">회원가입</CardTitle>
          <CardDescription class="text-muted-foreground">
            계정을 만들어 커뮤니티에 참여하세요
          </CardDescription>
        </CardHeader>

        <CardContent class="space-y-6">
          <form @submit.prevent="handleSubmit" class="space-y-4">
            <div class="space-y-2">
              <Label for="username" class="text-sm font-medium text-foreground">사용자명</Label>
              <div class="relative">
                <User class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="사용자명을 입력하세요"
                  v-model="form.username"
                  class="pl-10 h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
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
                  placeholder="비밀번호를 입력하세요"
                  v-model="form.password"
                  class="pl-10 h-11 bg-background border-border focus:border-primary focus:ring-primary/20"
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
                  required
                />
              </div>
            </div>

            <Button type="submit" class="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
              계정 만들기
            </Button>
          </form>

          <div class="text-center pt-4 border-t border-border">
            <p class="text-sm text-muted-foreground">
              이미 계정이 있으신가요?
              <RouterLink to="/" class="text-primary hover:text-primary/80 font-medium">홈으로 돌아가기</RouterLink>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { User, Mail, Lock, UserPlus } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'

import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import Label from '@/components/ui/Label.vue'

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

function handleSubmit() {
  if (form.value.password !== form.value.confirmPassword) {
    alert('비밀번호가 일치하지 않습니다.')
    return
  }
  console.log('Registration data:', form.value)
}
</script>
