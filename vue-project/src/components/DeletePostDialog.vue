<template>
  <teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @keydown.esc.prevent="cancel"
    >
      <!-- overlay -->
      <div class="absolute inset-0 bg-black/50" @click="cancel" />

      <!-- dialog -->
      <div
        class="relative z-10 w-[90%] max-w-md rounded-lg bg-background border border-border shadow-xl"
        role="dialog" aria-modal="true"
      >
        <div class="px-6 pt-6">
          <h3 class="text-lg font-semibold">게시글을 삭제하시겠습니까?</h3>
          <p class="mt-2 text-sm text-muted-foreground">
            이 작업은 되돌릴 수 없습니다. 게시글과 모든 댓글이 영구적으로 삭제됩니다.
          </p>
        </div>

        <div class="flex justify-end gap-2 px-6 py-4">
          <Button variant="outline" @click="cancel">취소</Button>
          <Button class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  @click="confirm">
            삭제
          </Button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'

const props = defineProps({
  open: { type: Boolean, default: false }
})
const emit = defineEmits(['update:open', 'confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel  = () => { emit('cancel'); emit('update:open', false) }
</script>
