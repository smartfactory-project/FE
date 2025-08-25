<template>
  <div class="space-y-6">
    <!-- 추천 게시글 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <TrendingUp class="w-5 h-5 mr-2 text-primary" />
          추천 게시글
        </CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div
          v-for="(post, index) in recommendedPosts"
          :key="index"
          class="p-3 rounded-lg bg-background/50 hover:bg-background/70 transition-colors cursor-pointer"
        >
          <h4 class="font-medium text-foreground text-sm mb-2 line-clamp-2">{{ post.title }}</h4>
          <div class="flex items-center justify-between text-xs">
            <span class="text-muted-foreground">by {{ post.author }}</span>
            <div class="flex items-center space-x-2">
              <Badge variant="secondary" class="text-xs">
                {{ post.category }}
              </Badge>
              <span class="text-muted-foreground">❤️ {{ post.likes }}</span>
            </div>
          </div>
        </div>

        <Button variant="outline" size="sm" class="w-full bg-transparent">
          더 많은 추천 보기
          <ArrowRight class="w-3 h-3 ml-1" />
        </Button>
      </CardContent>
    </Card>

    <!-- 인기 토픽 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <Star class="w-5 h-5 mr-2 text-primary" />
          인기 토픽
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="(topic, index) in trendingTopics"
            :key="index"
            class="flex items-center justify-between"
          >
            <span class="text-sm text-foreground hover:text-primary cursor-pointer transition-colors">
              #{{ topic.name }}
            </span>
            <span class="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
              {{ topic.count }}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- 활발한 사용자 -->
    <Card class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle class="flex items-center text-lg text-foreground">
          <Users class="w-5 h-5 mr-2 text-primary" />
          활발한 사용자
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="space-y-3">
          <div
            v-for="(user, index) in activeUsers"
            :key="index"
            class="flex items-center space-x-3"
          >
            <!-- <Avatar class="w-8 h-8">
              <AvatarImage :src="user.avatar || '/placeholder.svg'" :alt="user.name" />
              <AvatarFallback class="text-xs">{{ user.name[0] }}</AvatarFallback>
            </Avatar> -->

            <Avatar class="w-8 h-8">
              <AvatarImage
                v-if="user.avatar && !imgErr[index]"
                :src="user.avatar"
                :alt="user.name"
                class="object-contain object-center"
                @error="imgErr[index] = true"
              />
              <AvatarFallback class="text-xs font-semibold">
                {{ user.name?.[0] || '?' }}
              </AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <p class="text-sm font-medium text-foreground">{{ user.name }}</p>
              <p class="text-xs text-muted-foreground">{{ user.posts }}개 게시글</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { TrendingUp, Users, Star, ArrowRight } from 'lucide-vue-next'
import { ref } from 'vue'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

import Badge from '@/components/ui/Badge.vue'
import Button from '@/components/ui/Button.vue'

import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'


const recommendedPosts = [
  { title: 'AI 기반 생산성 도구 활용법', author: '최민호', likes: 67, category: '기술' },
  { title: '효과적인 팀 커뮤니케이션 방법', author: '한지영', likes: 45, category: '소통' },
  { title: '데이터 분석으로 보는 업무 패턴', author: '송준혁', likes: 38, category: '분석' },
]

const trendingTopics = [
  { name: '생산성향상', count: 124 },
  { name: '팀워크', count: 89 },
  { name: '데이터분석', count: 76 },
  { name: '워크플로우', count: 65 },
  { name: '품질관리', count: 54 },
]

const activeUsers = [
  { name: '김철수', posts: 23, avatar: '/abstract-geometric-shapes.png' },
  { name: '이영희', posts: 19, avatar: '/abstract-geometric-shapes.png' },
  { name: '박민수', posts: 16, avatar: '/diverse-group-collaborating.png' },
  { name: '정수진', posts: 14, avatar: '/abstract-geometric-shapes.png' },
]

const imgErr = ref({})

</script>
