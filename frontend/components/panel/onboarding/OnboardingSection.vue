<template>
     <div class="hhcss_onboardingBox flex flex-col justify-start items-[normal]">
          <div class="flex flex-col justify-start items-[normal]">
               <h2 class="font-medium text-[16px] sm:text-[20px] leading-[20px] sm:leading-[26px] tracking-[-0.01em]">
                    {{ title }}
               </h2>
               <p v-if="description" class="text-[#647491] text-[16px] leading-[20px] mt-[2px] tracking-[-0.01em]">
                    {{ description }}
               </p>
          </div>
          <div class="mt-[16px]">
               <slot />
          </div>
     </div>
</template>

<script setup lang="ts">
defineProps<{
     title: string
     description?: string
}>()
</script>
