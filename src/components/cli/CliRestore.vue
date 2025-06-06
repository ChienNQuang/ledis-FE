<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  file: File | null
}>()
const emit = defineEmits(['update:file'])

const fileName = computed(() => {
  return props.file ? props.file.name : 'No file selected'
})

function handleFileUpload(e: Event) {
  const uploadedFile = (e.target as HTMLInputElement).files?.[0]
  if (uploadedFile) {
    // only allow .json files
    if (uploadedFile.type !== 'application/json') {
      alert('Please upload a valid JSON file.')
      return
    }

    emit('update:file', uploadedFile)
  }
}
</script>

<template>
  <div>
    <div class="relative flex items-center justify-between mb-2">
      <button class="relative border bg-[#d4be98] text-[#2c2c2c] rounded-xl text-sm p-2">
        Upload snapshot
      </button>
      <input
        type="file"
        class="absolute inset-0 opacity-0 cursor-pointer"
        @change="handleFileUpload"
      />
    </div>
    {{ fileName }}
  </div>
</template>
