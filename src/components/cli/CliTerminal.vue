<script setup lang="ts">
import { ref } from 'vue'
import CliInput from './CliInput.vue'
import CliOutput from './CliOutput.vue'

const logs = ref<string[]>([])
</script>

<template>
  <div class="bg-[#2c2c2c] size-full p-4">
    <div
      class="relative border-[#6b6f24] text-[#d4be98] font-semibold border-2 size-full overflow-auto p-2 no-scrollbar"
    >
      <CliOutput :logs />
      <CliInput @update="logs.push($event)" />
    </div>
  </div>
</template>
