<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="mb-8">
      <RouterLink to="/">
        <Button variant="ghost" class="mb-4">
          <ArrowLeft class="w-4 h-4 mr-2" />
          홈으로 돌아가기
        </Button>
      </RouterLink>

      <Card>
        <CardHeader>
          <div class="flex items-center gap-6">
            <Avatar class="w-20 h-20">
              <!-- <AvatarImage :src="profile?.avatar || '/placeholder-user.jpg'" :alt="profile?.username || 'user'" /> -->
              <AvatarImage
                v-if="avatarSrc && !imgErr"
                :src="avatarSrc"
                :alt="profile?.username || 'user'"
                class="object-cover"
                @error="imgErr = true"
                />
              <AvatarFallback>{{ (profile?.username || 'U').charAt(0) }}</AvatarFallback>
            </Avatar>
            <div class="flex-1">
              <CardTitle class="text-2xl mb-2">{{ profile?.username || '' }}</CardTitle>
              <CardDescription class="text-base mb-4">{{ profile?.email || '' }}</CardDescription>
              <div class="flex gap-6 text-sm text-muted-foreground">
                <span>가입일: {{ (profile?.joinDate || '').toString().slice(0, 10) }}</span>
                <span>작성글: {{ profile?.postCount ?? 0 }}개</span>
                <span>좋아요: {{ profile?.likeCount ?? 0 }}개</span>
                <span>스크랩: {{ profile?.scrapCount ?? 0 }}개</span>
              </div>
            </div>
            <Button variant="outline">프로필 편집</Button>
          </div>
        </CardHeader>
      </Card>
    </div>

    <!-- Tabs -->
    <div>
      <!-- 탭 버튼 리스트 -->
      <div class="grid w-full grid-cols-3 rounded-md border border-border bg-background p-1">
        <button
          type="button"
          class="flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors"
          :class="activeTab === 'written' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'written'"
        >
          <Edit3 class="w-4 h-4" />
          작성한 글 ({{ writtenCount }})
        </button>

        <button
          type="button"
          class="flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors"
          :class="activeTab === 'liked' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'liked'"
        >
          <Heart class="w-4 h-4" />
          좋아요한 글 ({{ likedCount }})
        </button>

        <button
          type="button"
          class="flex items-center justify-center gap-2 py-2 rounded-md text-sm transition-colors"
          :class="activeTab === 'scrapped' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
          @click="activeTab = 'scrapped'"
        >
          <BookOpen class="w-4 h-4" />
          스크랩한 글 ({{ scrappedCount }})
        </button>
      </div>

      <!-- 탭 콘텐츠 -->
      <div class="mt-6">
        <!-- 작성한 글 -->
        <div v-if="activeTab === 'written'" class="space-y-4">
          <template v-if="writtenPosts.length">
            <Card v-for="post in writtenPosts" :key="post.id" class="hover:shadow-md transition-shadow">
              <CardHeader>
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <RouterLink :to="`/posts/${post.id}`">
                      <CardTitle class="text-lg mb-2 hover:text-primary cursor-pointer">{{ post.title }}</CardTitle>
                    </RouterLink>
                    <CardDescription v-if="post.content" class="text-sm text-muted-foreground mb-3">
                      {{ post.content }}
                    </CardDescription>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                      <span class="flex items-center gap-1">
                        <Calendar class="w-4 h-4" /> {{ (post.createdAt || '').toString().slice(0,10) }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Eye class="w-4 h-4" /> {{ post.views }}
                      </span>
                      <span class="flex items-center gap-1">
                        <Heart class="w-4 h-4" /> {{ post.likes }}
                      </span>
                      <span class="flex items-center gap-1">
                        <MessageCircle class="w-4 h-4" /> {{ post.comments }}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary">{{ post.category }}</Badge>
                </div>
              </CardHeader>
            </Card>
          </template>
          <template v-else>
            <Card><CardContent class="text-center py-12">
              <Edit3 class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p class="text-muted-foreground">아직 작성한 글이 없습니다.</p>
              <RouterLink to="/posts/create"><Button class="mt-4">첫 글 작성하기</Button></RouterLink>
            </CardContent></Card>
          </template>
        </div>

        <!-- 좋아요한 글 -->
        <div v-else-if="activeTab === 'liked'" class="space-y-4">
          <template v-if="likedPosts.length">
            <Card v-for="post in likedPosts" :key="post.id" class="hover:shadow-md transition-shadow">
              <CardHeader>
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <RouterLink :to="`/posts/${post.id}`">
                      <CardTitle class="text-lg mb-2 hover:text-primary cursor-pointer">{{ post.title }}</CardTitle>
                    </RouterLink>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>작성자: {{ post.author }}</span>
                      <span class="flex items-center gap-1"><Calendar class="w-4 h-4" /> {{ (post.createdAt || '').toString().slice(0,10) }}</span>
                      <span class="flex items-center gap-1"><Eye class="w-4 h-4" /> {{ post.views }}</span>
                      <span class="flex items-center gap-1"><Heart class="w-4 h-4" /> {{ post.likes }}</span>
                      <span class="flex items-center gap-1"><MessageCircle class="w-4 h-4" /> {{ post.comments }}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{{ post.category }}</Badge>
                </div>
              </CardHeader>
            </Card>
          </template>
          <template v-else>
            <Card><CardContent class="text-center py-12">
              <Heart class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p class="text-muted-foreground">좋아요한 글이 없습니다.</p>
            </CardContent></Card>
          </template>
        </div>

        <!-- 스크랩한 글 -->
        <div v-else class="space-y-4">
          <template v-if="scrappedPosts.length">
            <Card v-for="post in scrappedPosts" :key="post.id" class="hover:shadow-md transition-shadow">
              <CardHeader>
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <RouterLink :to="`/posts/${post.id}`">
                      <CardTitle class="text-lg mb-2 hover:text-primary cursor-pointer">{{ post.title }}</CardTitle>
                    </RouterLink>
                    <div class="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>작성자: {{ post.author }}</span>
                      <span class="flex items-center gap-1"><Calendar class="w-4 h-4" /> {{ (post.createdAt || '').toString().slice(0,10) }}</span>
                      <span class="flex items-center gap-1"><Eye class="w-4 h-4" /> {{ post.views }}</span>
                      <span class="flex items-center gap-1"><Heart class="w-4 h-4" /> {{ post.likes }}</span>
                      <span class="flex items-center gap-1"><MessageCircle class="w-4 h-4" /> {{ post.comments }}</span>
                    </div>
                  </div>
                  <Badge variant="secondary">{{ post.category }}</Badge>
                </div>
              </CardHeader>
            </Card>
          </template>
          <template v-else>
            <Card><CardContent class="text-center py-12">
              <BookOpen class="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p class="text-muted-foreground">스크랩한 글이 없습니다.</p>
            </CardContent></Card>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowLeft, BookOpen, Heart, Edit3, Eye, MessageCircle, Calendar } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Button from '@/components/ui/Button.vue'
import Badge from '@/components/ui/Badge.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'

import mypageAPI from '@/services/mypage.js'

// 상태
const activeTab = ref('written')
const profile = ref(null)
const writtenPosts = ref([])
const likedPosts = ref([])
const scrappedPosts = ref([])

const loading = ref(false)
const errorMsg = ref('')

// 카운트
const writtenCount   = computed(() => writtenPosts.value.length)
const likedCount     = computed(() => likedPosts.value.length)
const scrappedCount  = computed(() => scrappedPosts.value.length)

// 카테고리 한글 라벨 (옵션)
const catMap = {
  productivity: '생산성',
  strategy: '전략',
  guide: '가이드',
  analysis: '분석',
  discussion: '토론',
  announcement: '공지사항',
}

// 응답(PostWithStatsResponse) -> 화면용 매핑
function mapPost(p) {
  return {
    id: p.id,
    title: p.title,
    content: p.content,
    category: catMap[p.category] || p.category,
    createdAt: p.createdAt,
    views: p.viewCount ?? 0,
    likes: p.likesCount ?? 0,
    comments: p.commentsCount ?? 0,
    author: p.author, // liked/scrapped 탭에서 사용
  }
}

onMounted(loadAll)

async function loadAll() {
  try {
    loading.value = true
    errorMsg.value = ''

    const [prof, mine, liked, scraps] = await Promise.all([
      mypageAPI.profile(),
      mypageAPI.written({ page: 0, size: 50 }),
      mypageAPI.liked({ page: 0, size: 50 }),
      mypageAPI.scraps({ page: 0, size: 50 }),
    ])

    profile.value = prof
    writtenPosts.value  = (mine   || []).map(mapPost)
    likedPosts.value    = (liked  || []).map(mapPost)
    scrappedPosts.value = (scraps || []).map(mapPost)
  } catch (e) {
    console.error(e)
    errorMsg.value = e?.response?.data?.message || '마이페이지 정보를 불러오지 못했습니다.'
  } finally {
    loading.value = false
  }
}
</script>