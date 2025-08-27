<template>
  <div class="space-y-6">
    <!-- 상단 액션 바 -->
    <div class="flex items-center justify-between">
      <RouterLink to="/posts">
        <Button variant="ghost" class="text-muted-foreground hover:text-foreground">
          <ArrowLeft class="w-4 h-4 mr-2" />
          게시판으로 돌아가기
        </Button>
      </RouterLink>

      <div class="flex gap-2">
        <Button type="button" variant="outline" @click="isPreview = !isPreview">
          <Eye class="w-4 h-4 mr-2" />
          {{ isPreview ? '편집' : '미리보기' }}
        </Button>
        <!-- 폼 외부에 있어도 동작하도록 수동 제출도 함께 처리 -->
        <Button
          type="submit"
          form="post-form"
          class="bg-primary hover:bg-primary/90"
          @click.prevent="submitForm"
        >
          <Save class="w-4 h-4 mr-2" />
          게시글 저장
        </Button>
      </div>
    </div>

    <Card class="bg-card/50 backdrop-blur-sm border-border mx-auto w-full max-w-2xl lg:max-w-3xl">
      <CardHeader>
        <CardTitle class="text-xl font-semibold">게시글 작성</CardTitle>
      </CardHeader>

      <CardContent>
        <!-- 편집 모드 -->
        <form
          v-if="!isPreview"
          id="post-form"
          ref="formRef"
          class="space-y-6"
          @submit.prevent="handleSubmit"
        >
          <!-- 제목 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">제목 *</label>
            <Input
              v-model="title"
              placeholder="게시글 제목을 입력하세요"
              class="text-lg font-medium bg-background border-border"
              required
            />
          </div>

          <!-- 카테고리 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">카테고리 *</label>
            <Select v-model="category" class="w-full bg-background" required>
              <option value="" disabled>카테고리를 선택하세요</option>
              <option value="productivity">생산성</option>
              <option value="strategy">전략</option>
              <option value="guide">가이드</option>
              <option value="analysis">분석</option>
              <option value="discussion">토론</option>
              <option value="announcement">공지사항</option>
            </Select>
          </div>

          <!-- 태그 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">태그 (최대 5개)</label>
            <div class="flex gap-2">
              <Input
                v-model="newTag"
                placeholder="태그를 입력하고 Enter를 누르세요"
                class="bg-background border-border"
                :disabled="tags.length >= 5"
                @keydown.enter.prevent="handleAddTag"
              />
              <Button
                type="button"
                variant="outline"
                :disabled="!newTag.trim() || tags.length >= 5"
                @click="handleAddTag"
              >
                <Plus class="w-4 h-4" />
              </Button>
            </div>

            <div v-if="tags.length" class="flex flex-wrap gap-2 mt-2">
              <Badge
                v-for="tag in tags"
                :key="tag"
                variant="secondary"
                class="flex items-center gap-1"
              >
                #{{ tag }}
                <button
                  type="button"
                  class="ml-1 hover:text-destructive"
                  @click="handleRemoveTag(tag)"
                  aria-label="태그 삭제"
                >
                  <X class="w-3 h-3" />
                </button>
              </Badge>
            </div>
          </div>

          <!-- 내용 -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">내용 *</label>
            <Textarea
              v-model="content"
              placeholder="게시글 내용을 입력하세요..."
              class="min-h-[500px] bg-background border-border resize-none"
              required
            />
            <p class="text-xs text-muted-foreground">
              마크다운 문법을 사용할 수 있습니다. (예: <strong>**굵게**</strong>, <em>*기울임*</em>, <code>코드</code>)
            </p>
          </div>
        </form>

        <!-- 미리보기 모드 -->
        <div v-else class="space-y-6">
          <div class="border-b border-border pb-4">
            <h1 class="text-2xl font-bold text-foreground mb-2">
              {{ title || '제목을 입력하세요' }}
            </h1>

            <div class="flex items-center gap-2 text-sm text-muted-foreground">
              <Badge v-if="category" variant="outline">
                {{ categoryText }}
              </Badge>

              <div v-if="tags.length" class="flex gap-1">
                <Badge
                  v-for="tag in tags"
                  :key="tag"
                  variant="secondary"
                  class="text-xs"
                >
                  #{{ tag }}
                </Badge>
              </div>
            </div>
          </div>

          <div class="prose prose-sm max-w-none">
            <div class="whitespace-pre-wrap text-foreground">
              {{ content || '내용을 입력하세요' }}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { ArrowLeft, Plus, X, Save, Eye } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'

import Input from '@/components/ui/Input.vue'
import Textarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'
import Badge from '@/components/ui/Badge.vue'

import postAPI from '@/services/post.js'

const router = useRouter()

const title = ref('')
const content = ref('')
const category = ref('')
const tags = ref([])
const newTag = ref('')
const isPreview = ref(false)

const formRef = ref(null)

const categoryText = computed(() => {
  switch (category.value) {
    case 'productivity': return '생산성'
    case 'strategy':     return '전략'
    case 'guide':        return '가이드'
    case 'analysis':     return '분석'
    case 'discussion':   return '토론'
    case 'announcement': return '공지사항'
    default:             return ''
  }
})

function handleAddTag() {
  const t = newTag.value.trim()
  if (!t) return
  if (tags.value.includes(t)) return
  if (tags.value.length >= 5) return
  tags.value = [...tags.value, t]
  newTag.value = ''
}

function handleRemoveTag(tagToRemove) {
  tags.value = tags.value.filter(t => t !== tagToRemove)
}

function handleSubmit() {
  // 간단 유효성
  if (!title.value.trim() || !content.value.trim() || !category.value) return

  // 실제 앱: API 호출 후 성공 시 이동
  console.log('게시글 저장:', {
    title: title.value,
    content: content.value,
    category: category.value,
    tags: tags.value,
  })
  savePost()
  router.push('/posts')
}

async function savePost() {
   try {
     const payload = {
       title: title.value.trim(),
       content: content.value.trim(),
       category: category.value,
       tags: tags.value,
     }
     const { data } = await postAPI.create(payload)
     // 보통 data.id(생성된 게시글 PK)를 반환하도록 백엔드 구성
     console.log(data)
     if (data?.id) {
       router.push({ name: 'post-detail', params: { id: data.id } })
     } else {
       router.push('/posts')
     }
   } catch (e) {
     console.error(e)
     alert(e?.response?.data?.message || '게시글 저장에 실패했습니다.')
   }
 }


function submitForm() {
  // 폼의 required 검사도 통과시키고 싶으면 네이티브 submit 트리거
  if (formRef.value) {
    const ok = formRef.value.reportValidity?.() ?? true
    if (!ok) return
  }
  handleSubmit()
}
</script>