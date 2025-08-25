<!-- src/components/ScheduleFilters.vue -->
<template>
  <Card class="bg-card/50 backdrop-blur-sm border-border">
    <CardContent class="p-4">
      <div class="flex flex-col sm:flex-row gap-4 items-center">
        <!-- 왼쪽: 필터 셀렉트 3개 -->
        <div class="flex gap-2 w-full sm:w-auto">
          <!-- 카테고리 -->
          <div class="relative w-full sm:w-44">
            <Filter class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="local.category" class="w-full bg-background pl-8" @change="emitAll">
              <option value="all">전체</option>
              <option value="meeting">회의</option>
              <option value="review">검토</option>
              <option value="training">교육</option>
              <option value="milestone">마일스톤</option>
            </Select>
            <ChevronDown class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          <!-- 범위(팀/개인 등) -->
          <div class="relative w-full sm:w-44">
            <Users class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="local.scope" class="w-full bg-background pl-8" @change="emitAll">
              <option value="team">팀 전체</option>
              <option value="personal">개인</option>
              <option value="production">생산팀</option>
              <option value="management">관리팀</option>
            </Select>
            <ChevronDown class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>

          <!-- 장소 -->
          <div class="relative w-full sm:w-44">
            <MapPin class="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <Select v-model="local.place" class="w-full bg-background pl-8" @change="emitAll">
              <option value="office">사무실</option>
              <option value="online">온라인</option>
              <option value="external">외부</option>
            </Select>
            <ChevronDown class="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <!-- 오른쪽: 오늘로 이동 -->
        <div class="flex gap-2 ml-auto w-full sm:w-auto justify-end">
          <Button variant="outline" size="sm" class="bg-background" @click="goToday">
            <Calendar class="w-4 h-4 mr-2" />
            오늘로 이동
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { reactive, watch } from 'vue'
import { Filter, Calendar, Users, MapPin, ChevronDown } from 'lucide-vue-next'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Button from '@/components/ui/Button.vue'
import Select from '@/components/ui/Select.vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ category: 'all', scope: 'team', place: 'office' }),
  },
})
const emit = defineEmits(['update:modelValue', 'go-today'])

const local = reactive({ ...props.modelValue })
watch(() => props.modelValue, v => Object.assign(local, v), { deep: true })

const emitAll = () => emit('update:modelValue', { ...local })
const goToday = () => emit('go-today')
</script>
