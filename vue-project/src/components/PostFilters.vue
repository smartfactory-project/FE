<template>
  <Card class="bg-card/50 backdrop-blur-sm border-border">
    <CardContent class="p-4">
      <div class="flex flex-col sm:flex-row gap-4 items-center">
        <!-- 검색 -->
        <div class="relative flex-1">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="게시글 검색..."
            class="pl-10 bg-background border-border"
            v-model="local.query"
            @input="emitAll"
          />
        </div>

        <!-- 필터/정렬 -->
        <div class="flex gap-2 w-full sm:w-auto">
          <!-- 카테고리 -->
          <div class="relative w-full sm:w-32">
            <Filter class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <!-- <Select v-model="local.category" class="w-full bg-background pl-8" @change="emitAll"> -->
            <Select v-model="local.category" class="w-full bg-background pl-8">
              <option value="all">전체</option>
              <option value="productivity">생산성</option>
              <option value="strategy">전략</option>
              <option value="guide">가이드</option>
              <option value="analysis">분석</option>
            </Select>
          </div>

          <!-- 정렬 -->
          <div class="relative w-full sm:w-32">
            <SortDesc class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <!-- <Select v-model="localSort" class="w-full bg-background pl-8" @change="emitSort"> -->
            <Select v-model="localSort" class="w-full bg-background pl-8">
              <option value="latest">최신순</option>
              <option value="popular">조회순</option>
              <option value="recommended">추천순</option>
            </Select>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
// import { reactive, toRefs, watch, ref } from 'vue'
import { reactive, watch, ref } from 'vue'
import { Search, Filter, SortDesc } from 'lucide-vue-next'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/Input.vue'
import Select from '@/components/ui/Select.vue'

const props = defineProps({
  modelValue: { type: Object, default: () => ({ query: '', category: 'all' }) },
  sort: { type: String, default: 'latest' },
})
const emit = defineEmits(['update:modelValue', 'update:sort'])

const local = reactive({ query: props.modelValue.query, category: props.modelValue.category })
const localSort = ref(props.sort)

watch(() => props.modelValue, v => Object.assign(local, v), { deep: true })
watch(() => props.sort, v => (localSort.value = v))

const emitAll = () => emit('update:modelValue', { ...local })
const emitSort = () => emit('update:sort', localSort.value)

watch(() => local.category, () => emitAll())
watch(localSort, () => emitSort())
</script>
