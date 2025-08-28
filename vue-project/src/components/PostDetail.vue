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
           <div class="flex items-center gap-2">
            <Badge variant="outline" class="bg-background/50">{{ post.category }}</Badge>
            <Button
                v-if="owns(post)"  
                variant="ghost"
                size="sm"
                class="text-destructive hover:text-destructive hover:bg-destructive/10"
                @click.stop="handleDeleteClick(post.id)"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
           </div>
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
    <CommentsSection
      v-if="post"
      :postId="post.id"
      @loaded="updateCommentCount"
      @created="updateCommentCount"
    />
  </div>
  <DeletePostDialog
    v-model:open="deleteOpen"
    @confirm="confirmDelete"
    @cancel="cancelDelete"
  />
</template>

<script setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth.js' 
import { RouterLink } from 'vue-router'
import { Heart, MessageCircle, Share2, Bookmark, ArrowLeft, TrendingUp } from 'lucide-vue-next'
import CommentsSection from '@/components/CommentsSection.vue' 

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'

import postAPI from '@/services/post.js'
import { Trash2 } from 'lucide-vue-next'
import DeletePostDialog from '@/components/DeletePostDialog.vue'
import { useRouter, useRoute } from 'vue-router'

const route = useRoute()
const router = useRouter()
const postId = computed(() => Number(route.params.id))
const auth = useAuthStore()  

onMounted(async () => {
  if (!postId.value) return
  try {
   await postAPI.view(postId.value)
   await Promise.all([
     loadPost(postId.value),
     loadLikeStatus(postId.value),
     loadBookmarkStatus(postId.value),
   ])
 } catch (e) {
   console.error(e)
 }
})

watch(postId, async (id) => {
  if (!id) return
  await Promise.all([
    loadPost(id),
    loadLikeStatus(id),
    loadBookmarkStatus(id),
  ])
})

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
const deleteOpen = ref(false)
const deleteTargetId = ref(null)

async function loadPost(id) {
  if (!id) return
  try {
    loading.value = true
    errorMsg.value = ''
    imgErr.value = false

    const data = await postAPI.detail(id)
    console.log(data)
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
      
      userId: (data.userId ?? data.user_id ?? data.authorId ?? data.author_id ?? null),
    }

    } catch (e) {
      console.error(e)
      errorMsg.value = e?.response?.data?.message || '게시글을 불러오지 못했습니다.'
    } finally {
      loading.value = false
    }
  }
function updateCommentCount(n) {
  if (post.value) post.value.comments = n
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

async function loadLikeStatus(id) {
  try {
    const status = await postAPI.likeStatus(id) // GET /posts/{id}/like
    likes.value   = status.likes ?? 0
    isLiked.value = !!status.liked
  } catch (e) {
    console.error(e)
    // 비로그인/오류 시 기본값 유지
    likes.value   = likes.value ?? 0
    isLiked.value = false
  }
}

async function handleLike() {
  if (!post.value) return
  try {
    if (!isLiked.value) {
      const r = await postAPI.like(post.value.id)    // PUT /posts/{id}/like
      likes.value   = r.likes
      isLiked.value = r.liked
    } else {
      const r = await postAPI.unlike(post.value.id)  // DELETE /posts/{id}/like
      likes.value   = r.likes
      isLiked.value = r.liked
    }
  } catch (e) {
    console.error(e)
  }
}

async function loadBookmarkStatus(id) {
  const r = await postAPI.bookmarkStatus(id) // ✅ id만
  isBookmarked.value = !!r.bookmarked
}

async function handleBookmark() {
  if (!post.value) return
  const r = isBookmarked.value
    ? await postAPI.unbookmark(post.value.id)
    : await postAPI.bookmark(post.value.id)
  isBookmarked.value = r.bookmarked
}
const currentUserId = computed(() =>
   auth?.user?.id ??
   auth?.user?.userId ??
   auth?.user?.user_id ??
   null
 )

 // 포스트 작성자 id를 안전하게 추출 (백엔드 키명 다양성 대비)
 function getPostUserId(p) {
   if (!p) return null
   return p.userId ?? p.user_id ?? p.authorId ?? p.author_id ?? null
 }

 // 소유자 판별: id 우선, 없으면 username로 보조 판별
 function owns(p) {
   const me  = currentUserId.value
   const pid = getPostUserId(p)
   if (me != null && pid != null && String(me) === String(pid)) return true
   const myName = auth?.user?.username ?? auth?.user?.name ?? null
   const postAuthorName = p?.authorUsername ?? p?.author ?? null
   return !!(myName && postAuthorName && myName === postAuthorName)
 }


function handleDeleteClick(id) {
  if (!owns(post.value)) return
  deleteTargetId.value = id
  deleteOpen.value = true
}

async function confirmDelete() {
  try {
    await postAPI.remove(deleteTargetId.value)
    deleteOpen.value = false
    router.push('/posts') // 삭제 후 목록으로 이동
  } catch (e) {
    console.error(e)
    alert(e?.response?.data?.message || '삭제에 실패했습니다.')
  }
}
function cancelDelete() { deleteOpen.value = false }

</script>
