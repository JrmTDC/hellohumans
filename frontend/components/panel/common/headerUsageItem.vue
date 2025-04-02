<template>
     <div class="flex flex-col justify-start items-start border-b border-[rgb(226,232,239)] pb-[16px] mt-0 mb-0">
          <div class="flex flex-col justify-start items-start mt-0 mb-0 w-full">
               <div class="flex flex-row justify-start items-center mt-0 mb-0 w-full">
                    <div class="flex flex-col justify-start items-start mr-auto">
                         <h2 class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">
                              {{ item.title }}
                         </h2>
                         <p class="mt-[4px] mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">
                              {{ item.description }}
                         </p>
                    </div>
                    <div class="flex flex-row justify-start items-center ml-0">
                         <div class="flex flex-col justify-start items-start whitespace-nowrap">
                              <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-right text-[rgb(100,116,145)]">
                                   {{ item.titleUsage }}
                              </p>
                              <div class="flex flex-row justify-end items-center mt-[2px] mb-0 w-full">
                                   <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em] text-right text-[rgb(172,184,203)]">
                                        {{ item.usage }} /&nbsp;
                                   </p>
                                   <template v-if="item.limit === null || item.limit === '∞'">
                                        <h2 class="mt-0 mb-0 font-normal text-[20px] tracking-[-0.01em] text-[#acb8cb] leading-[18px]">∞</h2>
                                   </template>
                                   <template v-else>
                                        <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em] text-right text-[rgb(172,184,203)]">
                                             {{ item.limit }}
                                        </p>
                                   </template>
                              </div>
                         </div>
                         <div class="w-[32px] h-[32px] ml-[8px] relative">
                              <ProgressCircle
                                   :percentage="item.percentage"
                                   :progressColor="progressColor"
                                   :bgColor="item.bgColor"
                                   :center-content="item.centerContent"
                                   :number-content="item.numberContent"
                                   :sizeCircle="item.sizeCircle"
                                   :sizeFont="item.sizeFont"
                              />
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import ProgressCircle from '~/components/panel/ProgressCircle.vue'
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
