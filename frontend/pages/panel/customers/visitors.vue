<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelVisitorsChildSideMenu />
          <div data-radix-scroll-area-viewport class="overflow-hidden overflow-y-auto">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="pt-[60px] pr-[12px] pb-[60px] pl-[60px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="text-[18px] leading-[23px] tracking-[-0.01em]">
                                        <h4 class="mt-0 mb-0 font-medium text-[32px] leading-[41px] tracking-[-0.01em]">Vous n'avez pas encore installé le widget sur votre site.</h4>
                                        <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                                        <div class="flex flex-col justify-start items-[normal]">
                                             <p>Une fois le widget installé, vous pourrez :</p>
                                             <div class="grid grid-cols-1 gap-[24px] mt-[32px]">
                                                  <div class="flex items-start">
                                                       <SvgoPanelCustomersIconChecked class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] mr-[16px] fill-[#34b857]"/>
                                                       <p class="mt-0 mb-0 font-normal text-[18px] leading-[23px] tracking-[-0.01em]">Suivre les visiteurs en temps réel.</p>
                                                  </div>
                                                  <div class="flex items-start">
                                                       <SvgoPanelCustomersIconChecked class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] mr-[16px] fill-[#34b857]"/>
                                                       <p class="mt-0 mb-0 font-normal text-[18px] leading-[23px] tracking-[-0.01em]">Discuter en direct avec vos utilisateurs.</p>
                                                  </div>
                                                  <div class="flex items-start">
                                                       <SvgoPanelCustomersIconChecked class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] mr-[16px] fill-[#34b857]"/>
                                                       <p class="mt-0 mb-0 font-normal text-[18px] leading-[23px] tracking-[-0.01em]">Analyser les conversations.</p>
                                                  </div>
                                                  <div class="flex items-start">
                                                       <SvgoPanelCustomersIconChecked class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] mr-[16px] fill-[#34b857]"/>
                                                       <p class="mt-0 mb-0 font-normal text-[18px] leading-[23px] tracking-[-0.01em]">Collecter des données utiles.</p>
                                                  </div>
                                             </div>
                                             <p class="pt-[32px]">Pour commencer à suivre en temps réel qui navigue sur votre site, installez le widget dès maintenant.</p>
                                        </div>
                                        <span class="block w-[40px] min-w-[40px] h-[40px] min-h-[40px]"></span>
                                        <NuxtLink to="/panel/settings/installation" class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#0566ff] border border-[#0566ff] text-white rounded-[8px] text-[16px] font-normal leading-[20px] h-[38px] min-w-[80px] px-[16px] py-0 mb-0 touch-manipulation hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white focus:outline-none focus:ring-[0.2em] focus:ring-[rgba(5,102,255,0.5)]">Installer le widget de chat</NuxtLink>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
     <div class="absolute left-0 bottom-[56px] w-full flex items-center justify-center z-[620]">
          <div class="flex flex-row justify-start items-center px-[24px] py-[20px] bg-white rounded-[8px] shadow-[0_12px_32px_rgba(0,20,51,0.12)]">
               <SvgoPanelCustomersIconInfo class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(100,116,145)]" />
               <div class="ml-[16px] max-w-[450px]">
                    <b>Aucun visiteur actif pour le moment. </b> La liste est mise à jour automatiquement dès qu’un visiteur accède à votre site. Vous pouvez en simuler un.
               </div>
               <button @click="simulateVisitor" class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#0566ff] border border-[#0566ff] text-white rounded-[8px] text-[14px] font-normal leading-[18px] h-[38px] min-w-[64px] px-[16px] py-0 mb-0 touch-manipulation hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white focus:outline-none focus:ring-[0.2em] focus:ring-[rgba(5,102,255,0.5)] px-[14px] h-[34px] ml-[16px]">
                    <span>Simuler un visiteur</span>
               </button>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const panelStore = usePanelStore()
onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})

function simulateVisitor() {
     const url = '/panel/simulateVisitor?projectPublicKey=' + panelStore.project?.public_key
     const features = 'width=800,height=680,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
     window.open(url, '_blank', features)
}

</script>
