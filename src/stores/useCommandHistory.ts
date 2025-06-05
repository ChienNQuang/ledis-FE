import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCommandHistory = defineStore('command-history', () => {
  const history = localStorage.getItem('command-history')

  const commands = ref<string[]>(history ? JSON.parse(history) : [])

  const addCommand = (command: string) => {
    commands.value.push(command)
    localStorage.setItem('command-history', JSON.stringify(commands.value))
  }

  return { commands, addCommand }
})
