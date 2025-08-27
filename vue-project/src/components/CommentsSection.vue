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
            {{ submitting ? '작성 중...' : '댓글 작성' }}
            <!-- 댓글 작성 -->
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
import { ref, onMounted, watch } from 'vue'
import { Heart, Reply, MoreHorizontal } from 'lucide-vue-next'
import { commentAPI } from '@/services/comments'  // ✅ 추가

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'

const props = defineProps({
  postId: { type: [String, Number], required: true },
})
const emit = defineEmits(['loaded', 'created'])

const newComment = ref('')
const comments = ref([])          // ✅ 서버에서 채울 것
const submitting = ref(false)     // ✅ 추가
const loading = ref(false)        // (선택) 로딩 표기 쓰고 싶으면
const error = ref('')             // (선택) 에러 메시지
const imgErr = ref({})

function mapServerComment(c) {
  // 백엔드 응답 필드명에 맞춰 안전하게 매핑
  return {
    id: c.id ?? c.commentId,
    author: c.authorName ?? c.username ?? '익명',
    avatar: c.avatarUrl ?? null,
    content: c.content,
    timestamp: (c.createdAt ?? '').replace('T', ' ').slice(0, 16) || '방금 전',
    likes: c.likes ?? 0,
    isLiked: false,
  }
}

async function fetchComments() {
  loading.value = true
  error.value = ''
  try {
    const data = await commentAPI.list(props.postId)
    comments.value = (data ?? []).map(mapServerComment)
    emit('loaded', comments.value.length)
  } catch (e) {
    console.error(e)
    error.value = '댓글을 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}

async function handleSubmitComment() {
  const content = newComment.value.trim()
  if (!content) return

  submitting.value = true
  error.value = ''
  try {
    const saved = await commentAPI.create(props.postId, { content })
    comments.value.unshift(mapServerComment(saved))

    newComment.value = ''
    emit('created', comments.value.length)
  } catch (e) {
    console.error(e)
    error.value = '댓글 작성에 실패했습니다.'
  } finally {
    submitting.value = false
  }
}

function handleLikeComment(commentId) {
  const idx = comments.value.findIndex(c => c.id === commentId)
  if (idx === -1) return
  const target = comments.value[idx]
  const toggled = !target.isLiked
  comments.value[idx] = {
    ...target,
    isLiked: toggled,
    likes: toggled ? target.likes + 1 : Math.max(0, target.likes - 1),
  }
}

onMounted(fetchComments)           // ✅ 마운트 시 서버에서 목록 로딩
watch(() => props.postId, fetchComments)  // ✅ postId 바뀌면 재로딩
</script>