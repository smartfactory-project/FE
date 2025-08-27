<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-foreground">최신 게시글</h2>
      <RouterLink to="/posts/create">
        <Button class="bg-primary hover:bg-primary/90">
          <Plus class="w-4 h-4 mr-2" />새 게시글 작성
        </Button>
      </RouterLink>
    </div>

    <div class="space-y-4">
      <Card
        v-for="post in visiblePosts"
        :key="post.id"
        class="bg-card/50 backdrop-blur-sm border-border hover:shadow-lg transition-all duration-200"
      >
        <CardHeader class="pb-4">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <Avatar class="w-10 h-10">
                 <AvatarImage
                    v-if="post.avatar && !imgErr[post.id]"
                    :src="post.avatar"
                    :alt="post.author"
                    class="object-contain object-center"
                    @error="imgErr[post.id] = true"
                    />
                <AvatarFallback>{{ post.author?.[0] || '?' }}</AvatarFallback>
              </Avatar>
              <div>
                <div class="flex items-center space-x-2">
                  <h3 class="font-semibold text-foreground">{{ post.author }}</h3>
                  <Badge
                    v-if="post.isRecommended"
                    variant="secondary"
                    class="bg-primary/10 text-primary border-primary/20"
                  >
                    <TrendingUp class="w-3 h-3 mr-1" />추천
                  </Badge>
                </div>
                <p class="text-sm text-muted-foreground">{{ post.timestamp }}</p>
              </div>
            </div>
            <Badge variant="outline" class="bg-background/50">
              {{ post.category }}
            </Badge>
          </div>
        </CardHeader>

        <CardContent class="pt-0">
          <RouterLink
          :to="`/posts/${post.id}`"
           class="block text-xl font-bold text-foreground mb-3 hover:text-primary transition-colors">
           {{ post.title }}
          </RouterLink>
          <p class="text-muted-foreground mb-4 line-clamp-3">{{ post.content }}</p>

          <div class="flex flex-wrap gap-2 mb-4">
            <Badge
              v-for="(tag, i) in post.tags"
              :key="i"
              variant="secondary"
              class="bg-muted/50 text-muted-foreground"
            >
              #{{ tag }}
            </Badge>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-border">
            <div class="flex items-center space-x-4">
              <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-red-500">
                <Heart class="w-4 h-4 mr-1" />{{ post.likes }}
              </Button>
              <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-blue-500">
                <MessageCircle class="w-4 h-4 mr-1" />{{ post.comments }}
              </Button>
              <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-green-500">
                <Share2 class="w-4 h-4 mr-1" />공유
              </Button>
            </div>
            <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-yellow-500">
              <Bookmark class="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import postAPI from '@/services/post.js'

import { Plus, Heart, MessageCircle, Share2, Bookmark, TrendingUp } from 'lucide-vue-next'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
const imgErr = ref({})

const props = defineProps({
  filters: { type: Object, default: () => ({ query: '', category: 'all' }) },
  sort: { type: String, default: 'latest' },
})



const catMap = {
  productivity: '생산성',
  strategy: '전략',
  guide: '가이드',
  analysis: '분석',
  discussion: '토론',
  announcement: '공지사항',
}

const posts = ref([])
const loading = ref(false)
const errorMsg = ref('')

onMounted(fetchPosts)

async function fetchPosts() {
  try {
    loading.value = true
    errorMsg.value = ''
    const list = await postAPI.list()
    posts.value = list.map((p) => ({
      id: p.id,
      title: p.title,
      content: p.content,
      category: catMap[p.category] || p.category,      // 한글 라벨
      isRecommended: false,                             // 서버 필드 없으면 기본값
      likes: p.likes ?? 0,
      comments: p.comments ?? 0,
      author: p.author ?? `사용자 #${p.userId ?? '?'}`, // 서버에 author 없으면 userId로 대체
      avatar: p.avatar ?? '/abstract-profile.png',
      timestamp: toRelativeTime(p.createdAt),
      tags: Array.isArray(p.tags) ? p.tags : [],        // ['테스트'] 형태 지원
    }))
  } catch (e) {
    console.error(e)
    errorMsg.value = e?.response?.data?.message || '게시글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

// createdAt → “n분/시간/일 전” 간단 변환
function toRelativeTime(iso) {
  if (!iso) return ''
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, Math.floor((now - then) / 1000)) // sec
  if (diff < 60) return `${diff}초 전`
  const m = Math.floor(diff / 60)
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  const d = Math.floor(h / 24)
  return `${d}일 전`
}




// 기존 코드
const visiblePosts = computed(() => {
  let arr = posts.value.slice()

  // 검색
  const q = (props.filters.query || '').trim().toLowerCase()
  if (q) {
    arr = arr.filter(
      p =>
        p.title.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        (Array.isArray(p.tags) && p.tags.some(t => (t || '').toLowerCase().includes(q))),
    )
  }

  // 카테고리
  if (props.filters.category && props.filters.category !== 'all') {
    const target = catMap[props.filters.category]
    if (target) arr = arr.filter(p => p.category === target)
  }

  // 정렬
  switch (props.sort) {
    case 'popular':
      arr.sort((a, b) => b.likes - a.likes)
      break
    case 'recommended':
      arr.sort((a, b) => Number(b.isRecommended) - Number(a.isRecommended))
      break
    default:
      // 'latest'는 샘플 데이터 순서를 유지
      break
  }

  return arr
})
</script>