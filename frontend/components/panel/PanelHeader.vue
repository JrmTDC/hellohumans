<template>
     <header class="app-content-header flex items-center bg-[#f5f7f9] flex-[0_0_58px] flex-row h-[58px] justify-start pl-[24px] pr-[12px] relative z-[12]">
          <div class="flex flex-row justify-start items-center flex-grow w-full">
               <h1 class="inline-flex items-center text-[20px] font-medium tracking-[-0.01em] leading-[26px] mb-0 mr-auto mt-0 max-w-[calc(100%-268px)]">{{ title }}</h1>
               <div class="flex flex-row justify-start items-center ml-[16px]" ref="usageMenuRef">
                    <div @click="toggleUsageMenu" class="flex flex-row justify-start items-center p-[6px] rounded-[6px] cursor-pointer text-[rgb(58,35,0)] bg-transparent hover:bg-[rgb(220,233,255)] group">
                         <svgo-panel-icon-usage-menu class="w-[20px] h-[20px] fill-[#8796af] transition-transform group-hover:fill-[rgb(5,102,255)]" :class="{ 'rotate-180': isUsageMenuOpen }" />
                         <span class="block w-[4px] min-w-[4px] h-[4px] min-h-[4px]"></span>
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(8,15,26)]">Utilisation et offre</p>
                         <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                         <svgo-panel-icon-triangle-caret-down class="w-[24px] h-[24px fill-[#8796af] transition-transform group-hover:fill-[rgb(135,150,175)]" :class="{ 'rotate-180': isUsageMenuOpen }" />
                    </div>
                    <div class="ml-[16px]"></div>

                    <div v-if="isUsageMenuOpen" class="usage-dropdown">
                         <div class="absolute right-[32px] top-[53px] z-[2]"><svgo-panel-icon-triangle-up class="w-[17px] h-[7px] fill-[#ffff]" /></div>
                         <div class="absolute top-[60px] right-[25px] box-content w-[412px] bg-white p-[24px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] rounded-[8px] overflow-auto max-h-[calc(-150px+100vh)] z-[1]">
                              <UsageItemHeader
                                   v-for="(item, index) in usages"
                                   :key="index"
                                   :item="item"
                                   :class="index > 0 ? 'mt-[16px]' : ''"
                              />
                              <p class="mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] mt-[16px]">
                                   <span>⚠️ Les valeurs affichées sont approximatives et peuvent être mises à jour avec un délai pouvant aller jusqu’à 24h.</span>
                              </p>
                         </div>

                    </div>

               </div>
          </div>
     </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import UsageItemHeader from '@/components/panel/UsageItemHeader.vue'

defineProps({ title: String })

const isUsageMenuOpen = ref(false)
const usageMenuRef = ref(null)

const toggleUsageMenu = () => {
     isUsageMenuOpen.value = !isUsageMenuOpen.value
}

const handleClickOutside = (event) => {
     if (usageMenuRef.value && !usageMenuRef.value.contains(event.target)) {
          isUsageMenuOpen.value = false
     }
}

const usages = [
     {
          title: 'Audience',
          description: 'Nombre total de visiteurs ayant interagi avec votre chatbot.',
          titleUsage: 'Visiteurs atteints',
          usage: 320,
          limit: '∞',
          percentage: 100,
          progressColor: '#22c55e',
          bgColor: '#e5e7eb',
          centerContent: 'infinity',
          numberContent: '0',
          sizeCircle: 32,
          sizeFont: 12,
          autoColor: true
     },
     {
          title: 'Interactions',
          description: 'Conversations automatisées gérées par le bot.',
          titleUsage: 'Conversations traitées',
          usage: 4600,
          limit: 5000,
          percentage: 82,
          progressColor: '#f59e0b',
          bgColor: '#e5e7eb',
          centerContent: 'none',
          numberContent: '0',
          sizeCircle: 32,
          sizeFont: 12,
          autoColor: true
     }
]

onMounted(() => {
     document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})
</script>
