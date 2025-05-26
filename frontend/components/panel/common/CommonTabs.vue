<template>
     <div class="flex border-b border-[#e2e8ef]">
          <button v-for="tab in tabs" :key="tab.value" @click="$emit('update:modelValue', tab.value)" class="relative px-3 pt-4 pb-5 text-[16px] transition-colors cursor-pointer" :class="[ modelValue === tab.value ? 'text-[#0566ff] border-b-[3px] border-[#0566ff]' : 'text-[#080f1a] border-b-[3px] border-transparent']">
               {{ tab.label }}
          </button>
     </div>
</template>

<script setup lang="ts">
defineProps<{
     tabs: { value: string; label: string }[]
     modelValue: string
}>()

defineEmits(['update:modelValue'])
</script>
