<template>
  <Card class="bg-card/50 backdrop-blur-sm border-border overflow-visible">
    <CardContent class="p-4">
      <div class="flex flex-col sm:flex-row gap-4 items-center">
        <!-- 필터 선택 -->
        <div class="flex gap-2 overflow-visible">
          <!-- 기간 선택 -->
          <Select v-model="selectedPeriod" class="min-w-[180px] z-50 relative">
            <!-- 아이콘 -->
            <template #icon>
              <Calendar class="w-4 h-4 mr-2" />
            </template>

            <!-- placeholder 옵션 -->
            <option disabled value="">기간 선택</option>

            <!-- items 반복 -->
            <option
              v-for="item in sortedPeriodItems"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </Select>

          <!-- 데이터 타입 선택 -->
          <Select v-model="selectedType" class="min-w-[180px] z-50 relative">
            <template #icon>
              <Filter class="w-4 h-4 mr-2" />
            </template>

            <option disabled value="">데이터 타입 선택</option>

            <option
              v-for="item in sortedTypeItems"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </Select>
        </div>

        <!-- 버튼 -->
        <div class="flex gap-2 ml-auto">
          <Button variant="outline" size="sm" class="bg-background" @click="onRefresh">
            <RefreshCw class="w-4 h-4 mr-2" />
            새로고침
          </Button>
          <Button variant="outline" size="sm" class="bg-background" @click="onExport">
            <Download class="w-4 h-4 mr-2" />
            내보내기
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
</template>

<script setup>
import { ref, computed } from "vue"
import Card from "@/components/ui/card/Card.vue"
import CardContent from "@/components/ui/card/CardContent.vue"
import Button from "@/components/ui/Button.vue"
import Select from "@/components/ui/Select.vue"
import { Calendar, Download, Filter, RefreshCw } from "lucide-vue-next"

// 선택 상태
const selectedPeriod = ref("30days")
const selectedType = ref("all")

// Select items
const periodItems = [
  { value: "7days", label: "최근 7일" },
  { value: "30days", label: "최근 30일" },
  { value: "3months", label: "최근 3개월" },
  { value: "6months", label: "최근 6개월" },
  { value: "1year", label: "최근 1년" },
]

const typeItems = [
  { value: "all", label: "전체 데이터" },
  { value: "production", label: "생산 데이터" },
  { value: "quality", label: "품질 데이터" },
  { value: "performance", label: "성과 데이터" },
]

// 선택된 항목이 맨 위로 오도록 정렬
const sortedPeriodItems = computed(() => {
  const selected = periodItems.find(i => i.value === selectedPeriod.value)
  const others = periodItems.filter(i => i.value !== selectedPeriod.value)
  return selected ? [selected, ...others] : periodItems
})

const sortedTypeItems = computed(() => {
  const selected = typeItems.find(i => i.value === selectedType.value)
  const others = typeItems.filter(i => i.value !== selectedType.value)
  return selected ? [selected, ...others] : typeItems
})

// 버튼 클릭 이벤트
const onRefresh = () => {
  console.log("새로고침 클릭", selectedPeriod.value, selectedType.value)
}

const onExport = () => {
  console.log("내보내기 클릭", selectedPeriod.value, selectedType.value)
}
</script>

<style scoped>
.min-w-[180px] .truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
