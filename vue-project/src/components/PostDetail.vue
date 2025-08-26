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

    <Card class="bg-card/50 backdrop-blur-sm border-border">
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
import { computed, ref, watch } from 'vue'
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

const props = defineProps({
  postId: { type: String, required: true },
})


const SAMPLE_POSTS = [
  {
    id: 1,
    title: 'SAMJO 생산성 향상을 위한 새로운 워크플로우 제안',
    content:
      '팀 협업 효율성을 높이기 위한 새로운 워크플로우를 제안합니다. 이 방법을 통해 프로젝트 완료 시간을 30% 단축할 수 있었습니다...',
    author: '김철수',
    avatar: '/abstract-profile.png',
    timestamp: '2시간 전',
    likes: 24,
    comments: 8,
    category: '생산성',
    isRecommended: true,
    tags: ['워크플로우', '효율성', '팀워크'],
  },
  {
    id: 2,
    title: 'Q4 생산 목표 달성을 위한 전략 공유',
    content:
      '올해 4분기 생산 목표를 달성하기 위해 우리 팀에서 시도하고 있는 전략들을 공유합니다. 특히 품질 관리 부분에서 좋은 결과를 얻고 있습니다...',
    author: '이영희',
    avatar: '/confident-businesswoman.png',
    timestamp: '4시간 전',
    likes: 18,
    comments: 12,
    category: '전략',
    isRecommended: false,
    tags: ['목표달성', '전략', '품질관리'],
  },
  {
    id: 3,
    title: '신입사원을 위한 SAMJO 시스템 가이드',
    content:
      '새로 입사하신 분들을 위해 SAMJO 시스템 사용법을 정리했습니다. 처음 사용하시는 분들도 쉽게 따라할 수 있도록 스크린샷과 함께 설명드립니다...',
    author: '박민수',
    avatar: '/young-man.png',
    timestamp: '6시간 전',
    likes: 31,
    comments: 15,
    category: '가이드',
    isRecommended: true,
    tags: ['신입사원', '가이드', '시스템'],
  },
  {
    id: 4,
    title: '월간 생산성 리포트 및 개선 제안',
    content:
      '지난 달 생산성 데이터를 분석한 결과와 개선 방안을 제안합니다. 데이터 기반의 인사이트로 더 나은 성과를 만들어봅시다...',
    author: '정수진',
    avatar: '/professional-woman.png',
    timestamp: '1일 전',
    likes: 42,
    comments: 23,
    category: '분석',
    isRecommended: false,
    tags: ['리포트', '분석', '개선'],
  },
]

const post = computed(() => {
  const idNum = Number(props.postId)
  return SAMPLE_POSTS.find(p => p.id === idNum) || null
})

const likes = ref(0)
const isLiked = ref(false)
const isBookmarked = ref(false)
const imgErr = ref(false)

// id(=post) 변경될 때 상태 동기화
watch(post, (p) => {
  if (!p) return
  likes.value = p.likes
  isLiked.value = p.isLiked ?? false
  isBookmarked.value = p.isBookmarked ?? false
  imgErr.value = false
}, { immediate: true })


function handleLike() {
  isLiked.value = !isLiked.value
  likes.value = isLiked.value ? likes.value + 1 : likes.value - 1
}

function handleBookmark() {
  isBookmarked.value = !isBookmarked.value
}
</script>
