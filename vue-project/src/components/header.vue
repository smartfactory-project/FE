

<template>
  <header
      class="relative backdrop-blur-xl border-b border-border/50 shadow-sm transition-all duration-300"
      :class="isHovered ? 'bg-white' : 'bg-blue-950'"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
  >
    <div class="container mx-auto px-12">
      <div class="flex items-center justify-between h-24">
        <!-- 로고 -->
        <RouterLink
            to="/"
            class="flex items-center space-x-3 hover:opacity-80 transition-all duration-200"
        >
          <!-- 원래 주석은 그대로 두었음 -->
          <!--          <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">-->
          <!--            <Building2 class="w-7 h-7 text-white" />-->
          <!--          </div>-->
          <!--          <div>-->
          <!--            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">-->
          <!--              SAMJO-->
          <!--            </h1>-->
          <!--            <p class="text-xs text-muted-foreground font-medium">Smart Management System</p>-->
          <!--          </div>-->
          <img
              v-if="!isHovered"
              src="https://www.hyundai-autoever.com/common/images/typea-logo-wht.png"
              alt="Hyundai AutoEver Logo White"
              class="h-10"
          />
          <img
              v-else
              src="https://www.hyundai-autoever.com/common/images/typea-logo.png"
              alt="Hyundai AutoEver Logo Blue"
              class="h-10"
          />
        </RouterLink>

        <!-- Nav -->
        <nav class="flex-1 flex items-center justify-center gap-5 h-full text-xl font-extrabold">
          <RouterLink
              to="/"
              class="relative h-full flex items-center px-6 transition-all duration-200 group"
              :class="isHovered ? 'text-black' : 'text-white'"
          >
            대시보드
            <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-900 scale-x-0
           group-hover:scale-x-100 transition-transform origin-left duration-300"
            />
          </RouterLink>
          <RouterLink
              to="/production"
              class="relative h-full flex items-center px-6 transition-all duration-200 group"
              :class="isHovered ? 'text-black' : 'text-white'"
          >
            생산현황
            <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-900 scale-x-0
           group-hover:scale-x-100 transition-transform origin-left duration-300"
            />
          </RouterLink>
          <RouterLink
              to="/charts"
              class="relative h-full flex items-center px-6 transition-all duration-200 group"
              :class="isHovered ? 'text-black' : 'text-white'"
          >
            차트보기
            <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-900 scale-x-0
           group-hover:scale-x-100 transition-transform origin-left duration-300"
            />
          </RouterLink>


          <RouterLink
              to="/productionManagement"
              class="relative h-full flex items-center px-6 transition-all duration-200 group"
              :class="isHovered ? 'text-black' : 'text-white'"
          >
            생산관리
            <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-900 scale-x-0
           group-hover:scale-x-100 transition-transform origin-left duration-300"
            />
          </RouterLink>

          <RouterLink
              to="/cellProductionManagement"
              class="relative h-full flex items-center px-6 transition-all duration-200 group"
              :class="isHovered ? 'text-black' : 'text-white'"
          >
            셀 생산라인
            <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-900 scale-x-0
           group-hover:scale-x-100 transition-transform origin-left duration-300"
            />
          </RouterLink>

          <RouterLink
              to="/posts"
              class="relative h-full flex items-center px-6 transition-all duration-200 group"
              :class="isHovered ? 'text-black' : 'text-white'"
          >
            커뮤니티
            <span
                class="absolute bottom-0 left-0 w-full h-[3px] bg-blue-900 scale-x-0
           group-hover:scale-x-100 transition-transform origin-left duration-300"
            />
          </RouterLink>


        </nav>

        <!-- Right Nav -->
        <nav class="flex items-center space-x-2">
          <!--          <RouterLink to="/">-->
          <!--            <button
                        class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
                      >
                        <Home class="w-4 h-4 mr-2 inline-block" />홈
                      </button>
                    </RouterLink>-->

          <button
              class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
              @click="goMyPage"
          >
            <User class="w-5 h-5 mr-2 inline-block" :class="isHovered ? 'text-blue-900' : 'text-white'" />
          </button>

          <!-- 로그인 상태 -->
          <template v-if="isAuth">
            <Button
                variant="ghost"
                class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
                @click="handleLogout"
            >
              <LogOut class="w-4 h-4 mr-2 inline-block" />
              로그아웃
            </Button>
          </template>

          <!-- 원래 주석은 그대로 둠 -->
          <!--          <template v-else>-->
          <!--            <RouterLink to="/login">-->
          <!--              <Button
                          variant="ghost"
                          class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
                        >
                          <LogIn class="w-4 h-4 mr-2 inline-block" />
                          로그인하기
                        </Button>
                      </RouterLink>-->
          <!--          </template>-->
          <!--          <RouterLink to="/register" v-if="!isAuth">-->
          <!--              <button
                          class="px-3 py-2 rounded-md bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-md hover:shadow-lg text-white transition-all duration-200"
                        >
                          <UserPlus class="w-4 h-4 mr-2 inline-block" />
                          회원가입하기
                        </button>
                    </RouterLink>-->



<!-- 토큰/로그인 상태에 따른 분기 -->
<!--          <template v-if="isAuth">-->
<!--            <Button-->
<!--              variant="ghost"-->
<!--              class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"-->
<!--              @click="handleLogout"-->
<!--            >-->
<!--              <LogOut class="w-4 h-4 mr-2 inline-block" />-->
<!--              로그아웃-->
<!--            </Button>-->
<!--          </template>-->
<!--          <template v-else>-->
<!--            <RouterLink to="/login">-->
<!--              <Button-->
<!--                variant="ghost"-->
<!--                class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"-->
<!--              >-->
<!--                <LogIn class="w-4 h-4 mr-2 inline-block" />-->
<!--                로그인하기-->
<!--              </Button>-->
<!--            </RouterLink>-->
<!--          </template>-->
<!--          <RouterLink to="/register" v-if="!isAuth">-->
<!--              <button-->
<!--                class="px-3 py-2 rounded-md bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-md hover:shadow-lg text-white transition-all duration-200"-->
<!--              >-->
<!--                <UserPlus class="w-4 h-4 mr-2 inline-block" />-->
<!--                회원가입하기-->
<!--              </button>-->
<!--          </RouterLink>-->
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Building2, User, LogIn, UserPlus, Home, LogOut } from 'lucide-vue-next'
import Button from '@/components/ui/Button.vue'
import { ref } from "vue"

const isHovered = ref(false)

// Pinia auth 스토어 사용
import { useAuthStore } from '@/stores/auth.js'
const auth = useAuthStore()
const router = useRouter()

// 스토어의 반응형 값 사용 (스토어 없을 때를 대비해 토큰 존재도 fallback)
const isAuth = computed(() => {
  // 스토어에 isAuthenticated 게터가 있다면 우선 사용
  if ('isAuthenticated' in auth) return auth.isAuthenticated
  // 없으면 localStorage 토큰 존재로 간단 판별 (비반응성)
  return !!localStorage.getItem('token')
})

async function goMyPage() {
  if (isAuth.value) {
    router.push('/mypage')
  } else {
    // 로그인 후 돌아올 목적지 전달
    router.push({ path: '/login', query: { redirect: '/mypage' } })
  }
}

function handleLogout() {
  if (auth?.logout) {
    auth.logout()
    window.location.reload()
  } else {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    
  }
  router.push('/')
}
</script>
