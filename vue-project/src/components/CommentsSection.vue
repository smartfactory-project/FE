<template>
  <!-- <Card class="bg-card/50 backdrop-blur-sm border-border"> -->
  <Card class="bg-card/50 backdrop-blur-sm border-border mx-auto w-full max-w-3xl lg:max-w-4xl">
    <CardHeader>
      <h2 class="text-2xl font-bold text-foreground">
        댓글 {{ comments.length }}개
      </h2>
    </CardHeader>

    <CardContent class="space-y-6">
      <!-- 새 댓글 입력 -->
      <div class="space-y-4">
        <textarea
          v-model="newComment"
          placeholder="댓글을 작성해주세요..."
          class="min-h-[100px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/50"
        />
        <div class="flex justify-end">
          <Button :disabled="!newComment.trim()" @click="handleSubmitComment">
            댓글 작성
          </Button>
        </div>
      </div>

      <!-- 댓글 목록 -->
      <div class="space-y-4">
        <div
          v-for="comment in comments"
          :key="comment.id"
          class="border-b border-border pb-4 last:border-b-0"
        >
          <div class="flex items-start space-x-3">
            <!-- 아바타 -->
            <Avatar class="w-10 h-10">
              <AvatarImage
                v-if="comment.avatar && !imgErr[comment.id]"
                :src="comment.avatar"
                :alt="comment.author"
                class="object-contain object-center"
                @error="imgErr[comment.id] = true"
              />
              <AvatarFallback>{{ comment.author?.[0] || '?' }}</AvatarFallback>
            </Avatar>

            <!-- 본문 -->
            <div class="flex-1 space-y-2">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <h4 class="font-semibold text-foreground">{{ comment.author }}</h4>
                  <span class="text-sm text-muted-foreground">{{ comment.timestamp }}</span>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal class="w-4 h-4" />
                </Button>
              </div>

              <p class="text-foreground leading-relaxed">
                {{ comment.content }}
              </p>

              <div class="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  :class="[
                    comment.isLiked ? 'text-red-500' : 'text-muted-foreground',
                    'hover:text-red-500'
                  ]"
                  @click="handleLikeComment(comment.id)"
                >
                  <Heart
                    class="w-4 h-4 mr-1"
                    :class="comment.isLiked ? 'fill-current' : ''"
                  />
                  {{ comment.likes }}
                </Button>

                <Button variant="ghost" size="sm" class="text-muted-foreground hover:text-blue-500">
                  <Reply class="w-4 h-4 mr-1" />
                  답글
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref } from 'vue'
import { Heart, Reply, MoreHorizontal } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'

const props = defineProps({
  postId: { type: String, required: true },
})

const newComment = ref('')
const comments = ref([
  {
    id: 1,
    author: '이영희',
    avatar: '/confident-businesswoman.png',
    content:
      '정말 유용한 정보네요! 우리 팀에서도 비슷한 문제를 겪고 있었는데, 제안해주신 워크플로우를 적용해보겠습니다.',
    timestamp: '1시간 전',
    likes: 5,
    isLiked: false,
  },
  {
    id: 2,
    author: '박민수',
    avatar: '/young-man.png',
    content:
      '자동화 도구 관련해서 더 자세한 정보를 알 수 있을까요? 어떤 도구들을 사용하셨는지 궁금합니다.',
    timestamp: '45분 전',
    likes: 3,
    isLiked: false,
  },
  {
    id: 3,
    author: '정수진',
    avatar: '/professional-woman.png',
    content:
      '30% 시간 단축은 정말 인상적인 성과네요! 다른 부서에서도 벤치마킹할 수 있도록 더 구체적인 가이드라인을 공유해주시면 좋겠습니다.',
    timestamp: '30분 전',
    likes: 8,
    isLiked: true,
  },
])

// 아바타 이미지 로드 실패 여부 (댓글 id별로 저장)
const imgErr = ref({})

function handleSubmitComment() {
  if (!newComment.value.trim()) return
  comments.value.push({
    id: comments.value.length + 1,
    author: '현재 사용자', // 실제 앱에서는 로그인 사용자명
    avatar: '/placeholder.svg',
    content: newComment.value,
    timestamp: '방금 전',
    likes: 0,
    isLiked: false,
  })
  newComment.value = ''
}

function handleLikeComment(commentId) {
  const idx = comments.value.findIndex(c => c.id === commentId)
  if (idx === -1) return
  const target = comments.value[idx]
  const toggled = !target.isLiked
  // 불변 업데이트(원하면 바로 mutate 해도 됨)
  comments.value[idx] = {
    ...target,
    isLiked: toggled,
    likes: toggled ? target.likes + 1 : target.likes - 1,
  }
}
</script>
