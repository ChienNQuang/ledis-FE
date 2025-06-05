<script setup lang="ts">
import { convertToRespStringLines } from '@/lib/resp'
import { SendCommand } from '@/services/commands'
import { useCommandHistory } from '@/stores/useCommandHistory'
import { ref } from 'vue'
import CliInput from './CliInput.vue'
import CliOutput from './CliOutput.vue'

const logs = ref<string[]>([])
const processing = ref(false)
const focusSignal = ref(false)

const { addCommand } = useCommandHistory()

function focusInput() {
  focusSignal.value = !focusSignal.value
}

async function sendCommand(input: string) {
  logs.value.push(`Ledis> ${input}`)
  addCommand(input)
  try {
    processing.value = true
    if (input.trim() === '') {
      return
    }

    const parts = input.split(' ')
    const command = parts[0]
    const args = parts.slice(1)

    const res = await SendCommand(command, args)

    const responseLines = convertToRespStringLines(res.data)
    logs.value.push(...responseLines)
  } catch (error) {
    logs.value.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    processing.value = false
    focusInput()
  }
}
</script>

<template>
  <div class="bg-[#2c2c2c] size-full p-4">
    <div
      class="relative cursor-text border-[#6b6f24] text-[#d4be98] font-semibold border-2 size-full overflow-auto p-2 no-scrollbar"
      @click="focusInput"
    >
      <CliOutput :logs />
      <CliInput
        v-if="!processing"
        :focusSignal="focusSignal"
        @update="sendCommand($event)"
      />
    </div>
  </div>
</template>
