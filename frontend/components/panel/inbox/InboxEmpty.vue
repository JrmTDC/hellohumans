<template>
     <div class="text-[18px] leading-[23px] tracking-[-0.01em] min-w-[550px] max-w-[550px]">
          <h4 class="mt-0 mb-0 font-medium text-[32px] leading-[41px] tracking-[-0.01em]">{{ title }}</h4>
          <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
          <p>{{ description }}</p>
          <span class="block w-[40px] min-w-[40px] h-[40px] min-h-[40px]"></span>
          <button v-if="button" @click="onClick"
                  class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#0566ff] border border-[#0566ff] text-white rounded-[8px] text-[16px] font-normal h-[38px] min-w-[80px] px-[16px] py-0 hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">
               {{ button }}
          </button>
     </div>
</template>

<script setup lang="ts">
defineProps<{
     title: string
     description: string
     button?: string
     onClick?: () => void
}>()
</script>
