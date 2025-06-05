<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import CliLedisIndicator from './CliLedisIndicator.vue'

interface Props {
  focusSignal?: boolean
}

const props = defineProps<Props>()

const text = ref('')
const textArea = ref<HTMLTextAreaElement | null>(null)

function resize() {
  nextTick(() => {
    if (textArea.value) {
      textArea.value.style.height = 'auto'
      textArea.value.style.height = `${textArea.value.scrollHeight}px`
    }
  })
}

onMounted(resize)
watch(text, resize)

watch(
  () => props.focusSignal,
  async () => {
    await nextTick()
    focus()
  },
)
function focus() {
  textArea.value?.focus()
}
onMounted(() => {
  focus()
})
</script>

<template>
  <div class="relative flex-wrap">
    <div class="absolute left-0 top-0">
      <CliLedisIndicator />
    </div>
    <textarea
      ref="textArea"
      type="text"
      class="bg-transparent w-full relative pl-13 flex-1 text-[#d4be98] border-none h-full outline-none resize-none no-scrollbar"
      autofocus
      v-model="text"
      @keydown.enter.prevent="
        () => {
          $emit('update', text.trim())
          text = ''
        }
      "
    />
  </div>
</template>
