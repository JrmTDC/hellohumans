<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden overflow-y-auto">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-stretch">
                                        <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Suggestions</h2>
                                        <p class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] max-w-[750px]">Complétez les questions suggérées pour aider {{ config.public.chatBotName }} à gérer les requêtes similaires à l'avenir. Les suggestions sont basées sur les questions des clients auxquelles {{ config.public.chatBotName }} n'a pas pu répondre ainsi que sur les questions-réponses préremplies issues des conversations précédentes.</p>
                                   </div>
                                   <div class="mt-[20px]">
                                        <div class="flex flex-col justify-start items-center px-[120px] py-[42px] rounded-[4px] border border-[#e2e8ef]"   >
                                             <div class="p-[12px] rounded-full bg-[#dce9ff] flex items-center justify-center"><SvgoPanelHubIconAddAvalable class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[#0566ff]" /></div>
                                             <span class="block w-[20px] min-w-[20px] h-[20px] min-h-[20px]"></span>
                                             <h2 class="mt-0 mb-0 font-medium text-[20px] leading-[26px] tracking-[-0.01em] text-center">Aucune suggestion disponible</h2>
                                             <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                                             <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-center text-[#647491] max-w-[600px]">Les suggestions apparaîtront ici une fois que {{ config.public.chatBotName }} sera activé et que des conversations auront eu lieu. Revenez plus tard pour les consulter et y ajouter des réponses afin d’enrichir les connaissances de {{ config.public.chatBotName }}.</p>
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
          description: `Indiquez l\'URL de votre site pour alimente ${config.public.chatBotName} en connaissances.`,
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
