<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />
          <div data-radix-scroll-area-viewport class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">

                                   <!-- En-tête -->
                                   <div class="flex flex-col justify-start items-stretch">
                                        <div class="flex flex-row justify-start items-center w-full">
                                             <h2 class="mr-auto mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">
                                             {{ title }}
                                             </h2>
                                             <div class="flex flex-row justify-start items-center ml-[60px]">
                                                  <div>
                                                       <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap text-center touch-manipulation bg-[#0566ff] border border-[#0566ff] text-white ml-[12px] hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white inline-flex items-center justify-center disabled:border-transparent disabled:shadow-none disabled:text-[#acb8cb] disabled:cursor-not-allowed disabled:bg-[#eff2f6]" disabled>
                                                            <SvgoPanelHubIconPlay class="h-[20px] w-[20px] fill-current ml-[-2px] mr-[6px]" />
                                                            <span>Activé</span>
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                        <p class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] max-w-[750px]">Vous permettent de personnaliser votre message pour des cas d'utilisation précis en créant des actions répondant aux intentions et aux questions des visiteurs.</p>
                                   </div>

                                   <!-- Menu des onglets -->
                                   <div class="mt-[20px] flex items-center relative flex-row-reverse flex-wrap justify-start">
                                        <div class="flex flex-row justify-start items-center flex-[1_1_0%] border-b border-b-[#e2e8ef]">
                                             <NuxtLink v-for="tab in tabs" :key="tab.to" :to="tab.to" class="relative px-[12px] pt-[16px] pb-[20px] text-[16px] transition-colors duration-200" :class="{ 'text-[#0566ff] border-b-[3px] border-b-[#0566ff]': isActive(tab), 'text-[#080f1a] hover:text-[#0566ff] border-b-transparent border-b-[3px]': !isActive(tab) }">
                                                  <div class="flex flex-row justify-center items-center">
                                                       <div class="flex flex-row justify-start items-center">{{ tab.label }}</div>
                                                  </div>
                                             </NuxtLink>
                                        </div>
                                   </div>
                                   <!-- Contenu -->
                                   <div class="mt-6">
                                        <slot></slot>
                                   </div>

                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const route = useRoute()
const props = defineProps({
     title: {
          type: String,
          default: 'Configurer'
     },
     activeTab: {
          type: String,
          default: ''
     }
})
const tabs = [
     { to: '/panel/hub/tasks/list', label: 'Mes tâches' },
]
const isActive = (tab) => {
     return route.path.startsWith(tab.to) || (route.path === '/panel/hub/settings' && tab.to.includes('general'))
}
</script>
