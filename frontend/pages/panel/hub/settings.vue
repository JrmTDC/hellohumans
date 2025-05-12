<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-stretch">
                                        <div class="flex flex-row justify-start items-center w-full">
                                             <h2 class="mr-auto mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Configurer</h2>
                                             <div class="flex flex-row justify-start items-center ml-[60px]">
                                                  <div>
                                                       <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap text-center touch-manipulation bg-[#0566ff] border border-[#0566ff] text-white ml-[12px] hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white inline-flex items-center justify-center disabled:border-transparent disabled:shadow-none disabled:text-[#acb8cb] disabled:cursor-not-allowed disabled:bg-[#eff2f6]" disabled>
                                                            <SvgoPanelHubIconPlay class="h-[20px] w-[20px] fill-current ml-[-2px] mr-[6px]" />
                                                            <span>Activé</span>
                                                       </button>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                                   <div class="mt-[20px] flex items-center relative flex-row-reverse flex-wrap justify-start">
                                        <div class="flex flex-row justify-start items-center flex-[1_1_0%] border-b border-b-[#e2e8ef]">
                                             <div class="relative px-[12px] pt-[16px] pb-[20px] text-[16px] text-[#0566ff] hover:cursor-default hover:text-[#0566ff] active:cursor-default active:text-[#0566ff] border-b-[3px] border-b-[#0566ff]">
                                                  <div class="flex flex-row justify-center items-center">
                                                       <div class="flex flex-row justify-start items-center">Général</div>
                                                  </div>
                                             </div>
                                             <div class="relative px-[12px] pt-[16px] pb-[20px] text-[16px] cursor-pointer text-[#080f1a] hover:cursor-default hover:text-[#0566ff] active:cursor-default active:text-[#0566ff] border-b-[3px] border-b-transparent">
                                                  <div class="flex flex-row justify-center items-center">
                                                       <div class="flex flex-row justify-start items-center">Personnalité</div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>


                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})

import iconHelp from "assets/icons/panel/hub/iconHelp.svg";
import iconWebSite from "assets/icons/panel/hub/iconWebSite.svg";
import iconLists from "assets/icons/panel/hub/iconLists.svg";

const listKnowledge = ref([
     {
          title: 'Suggestions',
          description: 'Connaissances à ajouter à partir des questions sans réponse et des précédentes conversations',
          icon: rawIcon(iconHelp),
          count: '0 question à passer en revue',
          actionText: 'Gérer',
          link: '/panel/hub/data-sources/suggestions'
     },
     {
          title: 'URL du site Web',
          description: 'Contenu importé à partir d\'URL, comme des bases de connaissances ou des sites Web',
          icon: rawIcon(iconWebSite),
          count: '0 pages',
          actionText: 'Gérer',
          link: '/panel/hub/data-sources/added?origin=website'
     },
     {
          title: 'Questions/réponses',
          description: 'Contenu des questions/réponses',
          icon: rawIcon(iconLists),
          count: '0 questions et réponses',
          actionText: 'Gérer',
          link: '/panel/hub/data-sources/added?origin=manual'
     }
])
</script>
