<script setup lang="ts">
interface Props {
  logs?: string[]
}

const props = defineProps<Props>()
</script>

<template>
  <div class="">
    <div v-for="log in props.logs" :key="log">
      {{ log }}
    </div>
  </div>
</template>
