<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-stretch">
                                        <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Sources de données</h2>
                                        <p class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] max-w-[750px]">{{ config.public.chatBotName }} utilisera les connaissances que vous allez ajouter ici pour répondre aux questions des clients.</p>
                                   </div>
                                   <div class="mt-[20px]">
                                        <div class="flex flex-col justify-start items-center px-[120px] py-[42px] rounded-[4px] border border-[#e2e8ef]"   >
                                             <h2 class="mt-0 mb-0 font-semibold text-[24px] leading-[31px] tracking-[-0.01em] text-center">Vous n'avez pas encore de questions-réponses</h2>
                                             <span class="block w-[12px] min-w-[12px] h-[12px] min-h-[12px]"></span>
                                             <p class="mt-0 mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-center max-w-[600px]">{{ config.public.chatBotName }} a besoin de connaissances pour répondre aux questions des clients. Pour ce faire, sélectionnez l'une des options ci-dessous. Plus vous lui donnez d'informations, plus il est performant.</p>
                                             <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                                             <div class="w-full grid [grid-template-columns:repeat(auto-fit,_minmax(220px,_220px))] gap-[20px] justify-center">

                                                  <div v-for="(item, index) in listSourceData" :key="item.name" class="relative bg-white rounded-[8px] border border-[#e2e8ef] border-[2px] outline-none cursor-pointer min-h-[162px] pointer-events-auto hover:shadow-[0_2px_6px_rgba(0,20,51,0.12)] hover:border-[#0566ff] hover:border-[2px]" @click="() => navigateTo(item.link)">
                                                       <div class="m-[20px]">
                                                            <component :is="item.icon" class="w-[24px] h-[24px] fill-[#0566ff]" />
                                                            <span class="block w-[12px] min-w-[12px] h-[12px] min-h-[12px]"></span>
                                                            <p class="mt-0 mb-0 font-medium text-[16px] leading-[20px] tracking-[-0.01em]">
                                                                 {{ item.name }}
                                                            </p>
                                                            <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                                                            <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">{{ item.description }}</p>
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
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')

import iconListManual from "assets/icons/panel/hub/iconListManual.svg";
import iconWebSite from "assets/icons/panel/hub/iconWebSite.svg";

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})
const config = useRuntimeConfig()
const listSourceData = ref([
     {
          name: 'URL du site web',
          icon: rawIcon(iconWebSite),
          description: `Indiquez l\'URL de votre site pour alimenter ${config.public.chatBotName} en connaissances.`,
          link: '/panel/hub/data-sources/web-site'
     },
     {
          name: 'Ajouter manuellement',
          icon: rawIcon(iconListManual),
          description: 'Rédigez manuellement vos propres questions-réponses spécifiques.',
          link: '/panel/hub/data-sources/manual'
     }
])
</script>
