<template>
     <div class="border border-[rgb(226,232,239)] rounded-[12px] mt-[16px] w-full">
          <div class="flex flex-col justify-start items-start p-[20px] w-full">
               <div class="flex flex-row justify-start items-center">
                    <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">{{ item.title }}</h2>
               </div>

               <div class="flex flex-row justify-start items-center mt-[16px]">

                    <div class="w-[24px] h-[24px] relative">
                         <ProgressCircle
                              :percentage="item.percentage"
                              :progressColor="progressColor"
                              :bgColor="item.bgColor"
                              :center-content="item.centerContent"
                              :number-content="item.numberContent"
                              :sizeCircle=24
                              :sizeFont=16
                              :sizeInfinity=10
                              :strokeWidth=4
                         />
                    </div>
                    <div class="flex flex-row justify-start items-center ml-[8px]">
                         <h2 class="mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-[#acb8cb]">{{ item.usage }}</h2>
                         <h2 class="mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-[#acb8cb]">&nbsp;/&nbsp;</h2>

                         <template v-if="item.limit === null || item.limit === '∞'">
                              <h2 class="mt-0 mb-0 font-normal text-[32px] tracking-[-0.01em] text-[#acb8cb] leading-[18px]">∞</h2>
                         </template>
                         <template v-else>
                              <h2 class="mt-0 mb-0 font-medium text-[28px] leading-[33px] tracking-[-0.01em] text-[#acb8cb]">{{ item.limit }}</h2>
                         </template>
                    </div>
               </div>
               <div class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-right text-[rgb(100,116,145)]">{{ item.titleUsage }}</div>
          </div>
     </div>
</template>

<script setup lang="ts">
import ProgressCircle from '@/components/panel/ProgressCircle.vue'
const props = defineProps({
     item: Object,
});

const isUnlimited = computed(() => props.item.limit === null || props.item.limit === '∞')

// Couleurs automatiques si autoColor est activé
const progressColor = computed(() => {
     if (!props.item.autoColor) return props.item.progressColor
     const percent = isUnlimited.value ? 0 : props.item.percentage

     if (percent < 50) return '#22c55e'
     if (percent < 80) return '#f59e0b'
     return '#ef4444'
})

const bgColor = computed(() => '#e5e7eb') // arrière-plan gris

</script>
