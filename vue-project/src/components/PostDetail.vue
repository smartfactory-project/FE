<template>
  <!-- <div class="space-y-6"> -->
  <div class="space-y-6 mx-auto w-full max-w-3xl lg:max-w-4xl">
    <!-- 돌아가기 -->
    <RouterLink to="/posts">
      <Button variant="ghost" class="mb-4">
        <ArrowLeft class="w-4 h-4 mr-2" />
        게시판으로 돌아가기
      </Button>
    </RouterLink>

    <Card v-if="post" class="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader class="pb-6">
        <!-- 작성자 헤더 -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <Avatar class="w-12 h-12">
              <AvatarImage
                v-if="post.avatar && !imgErr"
                :src="post.avatar"
                :alt="post.author"
                class="object-contain object-center"
                @error="imgErr = true"
              />
              <AvatarFallback>{{ post.author?.[0] || '?' }}</AvatarFallback>
            </Avatar>
            <div>
              <div class="flex items-center space-x-2">
                <h3 class="font-semibold text-foreground text-lg">{{ post.author }}</h3>
                <Badge
                  v-if="post.isRecommended"
                  variant="secondary"
                  class="bg-primary/10 text-primary border-primary/20"
                >
                  <TrendingUp class="w-3 h-3 mr-1" /> 추천
                </Badge>
              </div>
              <p class="text-sm text-muted-foreground">{{ post.timestamp }}</p>
            </div>
          </div>
          <Badge variant="outline" class="bg-background/50">
            {{ post.category }}
          </Badge>
        </div>

        <!-- 제목 & 태그 -->
        <h1 class="text-3xl font-bold text-foreground mb-4">{{ post.title }}</h1>
        <div class="flex flex-wrap gap-2">
          <Badge
            v-for="(tag, i) in post.tags"
            :key="i"
            variant="secondary"
            class="bg-muted/50 text-muted-foreground"
          >
            #{{ tag }}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <!-- 본문 -->
        <div class="max-w-none mb-8 text-foreground leading-relaxed whitespace-pre-line">
          {{ post.content }}
        </div>

        <!-- 액션 -->
        <div class="flex items-center justify-between pt-6 border-t border-border">
          <div class="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              :class="[isLiked ? 'text-red-500' : 'text-muted-foreground', 'hover:text-red-500']"
              @click="handleLike"
            >
              <Heart class="w-4 h-4 mr-1" :class="isLiked ? 'fill-current' : ''" />
              {{ likes }}
            </Button>

            <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-blue-500">
              <MessageCircle class="w-4 h-4 mr-1" />
              {{ post.comments }}
            </Button>

            <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-green-500">
              <Share2 class="w-4 h-4 mr-1" />
              공유
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            :class="[isBookmarked ? 'text-yellow-500' : 'text-muted-foreground', 'hover:text-yellow-500']"
            @click="handleBookmark"
          >
            <Bookmark class="w-4 h-4" :class="isBookmarked ? 'fill-current' : ''" />
          </Button>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft, TrendingUp } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'

import postAPI from '@/services/post.js'
import { useRoute } from 'vue-router'

const route = useRoute()
onMounted(() => loadPost(route.params.id))
watch(() => route.params.id, (id) => loadPost(id))

const catMap = {
  productivity: '생산성',
  strategy: '전략',
  guide: '가이드',
  analysis: '분석',
  discussion: '토론',
  announcement: '공지사항',
}

const post = ref(null)              // 서버에서 받은 포스트
const loading = ref(false)
const errorMsg = ref('')
const imgErr = ref(false)
const likes = ref(0)
const isLiked = ref(false)
const isBookmarked = ref(false)

async function loadPost(id) {
  if (!id) return
  try {
    loading.value = true
    errorMsg.value = ''
    imgErr.value = false

    const data = await postAPI.detail(id)

    // 서버 필드 → 화면 필드 매핑
    post.value = {
      id: data.id,
      title: data.title,
      content: data.content,
      category: catMap[data.category] || data.category,
      author: data.author ?? `사용자 #${data.userId ?? '?'}`,
      avatar: data.avatar ?? '/abstract-profile.png',
      timestamp: toRelativeTime(data.createdAt),
      tags: Array.isArray(data.tags) ? data.tags : [],
      comments: data.comments ?? 0,
      isRecommended: data.isRecommended ?? false,
    }

    // 액션 초기화
    likes.value = data.likes ?? 0
    isLiked.value = false
    isBookmarked.value = false
  } catch (e) {
    console.error(e)
    errorMsg.value = e?.response?.data?.message || '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

// 상대시간
function toRelativeTime(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, Math.floor((now - then) / 1000))
  if (diff < 60) return `${diff}초 전`
  const m = Math.floor(diff / 60)
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  return `${d}일 전`
}

// 액션 핸들러 (로컬 토글; 실제 서버 연동 시 PATCH API 붙이면 됨)
function handleLike() {
  isLiked.value = !isLiked.value
  likes.value = isLiked.value ? likes.value + 1 : Math.max(0, likes.value - 1)
}

function handleBookmark() {
  isBookmarked.value = !isBookmarked.value
}
</script>
