<script setup lang="ts">
import { parseCliArgs } from '@/lib/cli'
import { convertToRespStringLines } from '@/lib/resp'
import { RestoreSnapshot, SaveSnapshot, SendCommand } from '@/services/commands'
import { useCommandHistory } from '@/stores/useCommandHistory'
import { ref } from 'vue'
import CliInput from './CliInput.vue'
import CliOutput from './CliOutput.vue'
import CliRestore from './CliRestore.vue'

const logs = ref<string[]>([])
const processing = ref(false)
const focusSignal = ref(false)

const { addCommand } = useCommandHistory()

const file = ref<File | null>(null)

function focusInput() {
  focusSignal.value = !focusSignal.value
}

async function downloadSnapshot() {
  SaveSnapshot()
    .then((blob) => {
      const url = URL.createObjectURL(blob.data)
      const a = document.createElement('a')
      a.href = url
      a.download = 'snapshot.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
    .catch((error) => {
      logs.value.push(`(error) ${error instanceof Error ? error.message : 'Unknown error'}`)
    })
}

async function sendCommand(input: string) {
  logs.value.push(`Ledis> ${input}`)
  addCommand(input)
  try {
    processing.value = true
    if (input.trim() === '') {
      return
    }

    const parts = parseCliArgs(input)
    const command = parts[0]
    const args = parts.slice(1)

    if (command.toUpperCase() === 'SAVE') {
      await downloadSnapshot()
      logs.value.push('OK')
      return
    }

    if (command.toUpperCase() === 'RESTORE') {
      if (!file.value) {
        alert('Please upload a snapshot file first.')
        return
      }

      RestoreSnapshot(file.value)
        .then(() => {
          logs.value.push('OK')
          file.value = null // Clear the file after restoring
        })
        .catch((error) => {
          logs.value.push(`(error) ${error instanceof Error ? error.message : 'Unknown error'}`)
        })
      return
    }

    const res = await SendCommand(command, args)

    const responseLines = convertToRespStringLines(res.data)
    logs.value.push(...responseLines)
  } catch (error) {
    logs.value.push(`(error) ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    processing.value = false
    focusInput()
  }
}
</script>

<template>
  <div class="bg-[#2c2c2c] text-[#d4be98] size-full flex p-4 gap-4">
    <div class="border-2 border-[#6b6f24] p-2 min-w-40 flex flex-col items-center">
      <CliRestore v-model:file="file" />
    </div>
    <div
      class="relative col-span-5 cursor-text border-[#6b6f24] font-semibold border-2 size-full overflow-auto p-2 no-scrollbar"
      @click="focusInput"
    >
      <CliOutput :logs />
      <CliInput v-if="!processing" :focusSignal="focusSignal" @update="sendCommand($event)" />
    </div>
  </div>
</template>
