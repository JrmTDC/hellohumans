<template>
     <div class="w-full pt-[16px]">
          <div class="flex flex-row justify-start items-center">
               <div class="relative bg-white rounded-[8px] border border-[#e2e8ef] outline-none cursor-pointer pointer-events-auto flex items-center justify-center flex-[1_1_0%] h-[55px] hover:shadow-[0_2px_6px_rgba(0,20,51,0.12)] hover:border-[#0566ff] hover:outline hover:outline-1 hover:outline-[#0566ff]">
                    <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em]">1</p>
               </div>
               <div class="ml-[20px] relative bg-white rounded-[8px] border border-[#e2e8ef] outline-none cursor-pointer pointer-events-auto flex items-center justify-center flex-[1_1_0%] h-[55px] hover:shadow-[0_2px_6px_rgba(0,20,51,0.12)] hover:border-[#0566ff] hover:outline hover:outline-1 hover:outline-[#0566ff]">
                    <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em]">2</p>
               </div>
               <div class="ml-[20px] relative bg-white rounded-[8px] border border-[#e2e8ef] outline-none cursor-pointer pointer-events-auto flex items-center justify-center flex-[1_1_0%] h-[55px] hover:shadow-[0_2px_6px_rgba(0,20,51,0.12)] hover:border-[#0566ff] hover:outline hover:outline-1 hover:outline-[#0566ff]">
                    <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em]">3</p>
               </div>
               <div class="ml-[20px] relative bg-white rounded-[8px] border border-[#e2e8ef] outline-none cursor-pointer pointer-events-auto flex items-center justify-center flex-[1_1_0%] h-[55px] hover:shadow-[0_2px_6px_rgba(0,20,51,0.12)] hover:border-[#0566ff] hover:outline hover:outline-1 hover:outline-[#0566ff]">
                    <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em]">4</p>
               </div>
               <div class="ml-[20px] relative bg-white rounded-[8px] border border-[#e2e8ef] outline-none cursor-pointer pointer-events-auto flex items-center justify-center flex-[1_1_0%] h-[55px] hover:shadow-[0_2px_6px_rgba(0,20,51,0.12)] hover:border-[#0566ff] hover:outline hover:outline-1 hover:outline-[#0566ff]">
                    <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em]">5</p>
               </div>
          </div>
          <div class="flex justify-between mt-[16px]">
               <p class="mt-0 mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-left">Très insatisfait(e)</p>
               <p class="mt-0 mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-right">Très satisfait(e)</p>
          </div>
     </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close'])
const { t } = useI18n()

</script>
