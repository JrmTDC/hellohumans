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
                                             <h2 class="mr-auto mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">{{ t('panel.pages.hub.index.title') }}</h2>
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
                                   <div class="mt-[20px] mb-0 flex flex-col justify-start items-start">
                                        <div class="mt-0 mb-0 flex flex-row justify-start items-center w-full">
                                             <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em] first:mr-auto">Performance</p>
                                             <button class="min-w-auto shadow-none bg-transparent text-[#acb8cb] cursor-not-allowed border border-transparent rounded-[8px] text-[14px] h-[34px] leading-[18px] px-[14px] py-0 inline-flex items-center justify-center group">
                                                  <SvgoPanelHubIconAnalytics class="h-[20px] w-[20px] fill-current ml-[-2px] mr-[6px]" />
                                                  <span class="group-hover:underline">Voir l'analytique complète</span>
                                             </button>
                                        </div>
                                        <div class="mt-[12px] mb-0 grid grid-cols-2 gap-[20px] w-full">
                                             <div class="flex flex-col justify-start items-start bg-white border border-[#e2e8ef] rounded-[12px] p-[20px]">
                                                  <div class="mt-0 mb-0 flex flex-row justify-start items-center">Conversations en direct</div>
                                                  <div class="mt-[20px] mb-0 grid grid-cols-3 w-full">
                                                       <div class="flex flex-col justify-start items-start">
                                                            <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#acb8cb]">Toutes les conversations</p>
                                                            <h2 class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#acb8cb]">—</h2>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="flex flex-col justify-start items-start bg-white border border-[#e2e8ef] rounded-[12px] p-[20px]">

                                             </div>
                                             <div class="flex flex-row justify-start items-center px-[16px] py-[8px] bg-white border border-[#e2e8ef] rounded-[12px]">
                                                  <div class="w-[28px] h-[28px] relative"></div>
                                                  <div class="w-full flex flex-row justify-between items-center ml-[16px] mr-auto">
                                                       <div class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Limite de conversations :</div>
                                                       <div class="flex flex-row justify-start items-center ml-[8px]">
                                                            <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em]">0</p>
                                                            <p class="ml-0 mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#acb8cb]">/50</p>
                                                       </div>
                                                       <div></div>
                                                  </div>
                                             </div>
                                             <div class="flex flex-row justify-start items-center px-[16px] py-[8px] bg-white border border-[#e2e8ef] rounded-[12px]">

                                             </div>
                                        </div>
                                   </div>
                                   <div class="mt-[20px] mb-0 flex flex-col justify-start items-start">
                                        <div class="mt-0 mb-0 flex flex-row justify-start items-center w-full">
                                             <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em] first:mr-auto">Connaissances</p>
                                        </div>
                                        <div class="mt-[20px] flex flex-row justify-start items-center bg-[#f5f7f9] border border-[#e2e8ef] rounded-[12px] p-[20px] w-full">
                                             <SvgoPanelHubProgressKnowledge class="w-[142px] h-[70px] flex-[0_0_142px]" />
                                             <div class="flex flex-col justify-start items-start mr-auto ml-[20px]">
                                                  <div class="flex flex-row justify-start items-center">
                                                       <p class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">Terminez la configuration pour voir le score de connaissances</p>
                                                  </div>
                                                  <p class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">Le score est calculé après avoir ajouté des connaissances et activé {{ config.public.chatBotName }}.</p>
                                             </div>
                                             <div class="ml-[20px] flex flex-row justify-start items-center">
                                                  <button class="inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 bg-[#dce9ff] border border-[#dce9ff] text-[#0049bd] hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd]">
                                                       <span>Ajouter des connaissances</span>
                                                  </button>
                                             </div>
                                        </div>
                                        <div class="flex flex-col justify-start items-[normal] mt-[20px] w-full">
                                             <div v-for="(item, index) in listKnowledge" :key="item.id"
                                                 :class="[index > 0 ? 'mt-[8px]' : '']"
                                                 class="border border-[#e2e8ef] rounded-[8px] w-full p-[16px] grid items-center gap-x-[32px] [grid-template-columns:3fr_2fr_2fr]">
                                                  <div class="flex flex-row justify-start items-center">
                                                       <div class="flex items-center justify-center p-[8px] rounded-[8px] bg-[#eff2f6]">
                                                            <SvgoPanelHubIconHelp class="h-[18px] w-[18px] fill-[#8796af]"/>
                                                       </div>
                                                       <div class="ml-[8px]">
                                                            <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em]">{{ item.title }}</p>
                                                            <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491]">{{ item.description }}</p>
                                                       </div>
                                                  </div>
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#080f1a]">{{ item.count }}</p>
                                                  <div class="flex flex-wrap justify-end items-center gap-y-[8px]">
                                                       <button class="bg-transparent border border-[#d1d9e0] cursor-pointer font-normal mb-0 text-center touch-manipulation select-none align-middle whitespace-nowrap bg-[rgba(136,148,171,0)] text-[#333] inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 hover:bg-[#eff2f6] hover:border-[#acb8cb] hover:text-[#333]" @click="() => navigateTo(item.link)">{{ item.actionText }}</button>
                                                  </div>
                                             </div>
                                             <div class="mt-[20px] flex flex-row justify-start items-center">
                                                  <SvgoPanelHubIconDocs class="w-[24px] h-[24px] fill-[#0566ff]"/>
                                                  <NuxtLink to="/" class="bg-transparent text-[#0566ff] no-underline text-[14px] leading-[18px] min-w-[64px] py-0 ml-[6px] hover:underline hover:text-[#0047b7]">Comment ajouter efficacement des sources de données</NuxtLink>
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

const config = useRuntimeConfig()

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
