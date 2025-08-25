<template>
  <header class="bg-white/80 backdrop-blur-xl border-b border-border/50 shadow-sm">
    <div class="container mx-auto px-4 py-4">
      <div class="flex items-center justify-between">
        <RouterLink
          to="/"
          class="flex items-center space-x-3 hover:opacity-80 transition-all duration-200"
        >
          <div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg">
            <Building2 class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              SAMJO
            </h1>
            <p class="text-xs text-muted-foreground font-medium">Smart Management System</p>
          </div>
        </RouterLink>

        <nav class="flex items-center space-x-2">
          <RouterLink to="/">
            <button
              class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
            >
              <Home class="w-4 h-4 mr-2 inline-block" />홈
            </button>
          </RouterLink>

          <button
            class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
          >
            <User class="w-4 h-4 mr-2 inline-block" />
            마이페이지
          </button>

          <button
            class="text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 px-3 py-2 rounded-md"
          >
            <LogIn class="w-4 h-4 mr-2 inline-block" />
            로그인하기
          </button>

          <RouterLink to="/register">
            <button
              class="px-3 py-2 rounded-md bg-gradient-to-r from-secondary to-accent hover:from-secondary/90 hover:to-accent/90 shadow-md hover:shadow-lg text-white transition-all duration-200"
            >
              <UserPlus class="w-4 h-4 mr-2 inline-block" />
              회원가입하기
            </button>
          </RouterLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Building2, User, LogIn, UserPlus, Home } from 'lucide-vue-next'
</script>
