<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelVisitorsChildSideMenu />
          <div class="border border-[rgb(226,232,239)] rounded-[16px] mr-[12px] mb-[12px] bg-white overflow-y-auto">
               <div class="flex flex-row justify-start items-start min-h-full">




                    <template v-if="panelStore.visitors && panelStore.visitors.length > 0">
                         <div class="px-[28px] py-[24px] w-full">
                              <div class="flex flex-col justify-start items-[normal]">
                                   <div class="flex flex-col justify-start items-[normal]">
                                        <div class="mt-0 mb-0 flex flex-row justify-start items-center">
                                             <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em] text-[#080f1a]">Actuellement en ligne&nbsp;:
                                                  {{ panelStore.visitors.length }}</h2>
                                        </div>
                                        <p class="mt-[8px] mb-0 flex flex-row justify-start items-center font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] max-w-[750px]">Utilisez l'aperçu en temps réel pour suivre les clients qui consultent votre site Web.</p>
                                   </div>
                                   <PanelCommonVisitorTable :visitors="panelStore.visitors" />
                              </div>
                         </div>
                    </template>
                    <template v-else-if="panelStore.project?.widget_installed">
                         <div class="flex-[3_1_0%] px-[12px] pr-[12px] pl-[60px] py-[60px] max-w-[812px] text-[18px] leading-[23px] tracking-[-0.01em]">
                              <h4 class="mt-0 mb-0 font-medium text-[32px] leading-[41px] tracking-[-0.01em]">Aucun visiteur n’est présent sur votre site Web en ce moment</h4>
                              <span class="block w-[32px] min-w-[32px] h-[32px] min-h-[32px]"></span>
                              <div class="flex flex-col justify-start items-[normal]">
                                   <p>Cette liste sera mise à jour automatiquement lorsque vous aurez des visiteurs sur votre site Web</p>
                                   <p class="mt-[32px]">Pensez à simuler un visiteur pour tester votre chat.</p>
                              </div>
                              <span class="block w-[40px] min-w-[40px] h-[40px] min-h-[40px]"></span>
                              <button @click="simulateVisitor" class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#501cd8] border border-[#501cd8] text-white rounded-[8px] text-[16px] font-normal leading-[20px] h-[38px] min-w-[80px] px-[16px] py-0 mb-0 touch-manipulation hover:bg-[#331289] hover:border-[#331289] hover:text-white">Simuler un visiteur</button>
                         </div>
                         <div class="pt-[60px] flex-[4_1_0%] self-stretch">
                              <div class="flex items-start justify-center w-full max-w-[600px]">
                                   <img class="max-w-full h-auto" src="/assets/img/72b3f326256f6cb756e0.jpeg" alt="">
                              </div>
                         </div>
                    </template>
                    <template v-else>
                         <div class="flex-[3_1_0%] px-[12px] pr-[12px] pl-[60px] py-[60px] max-w-[812px] text-[18px] leading-[23px] tracking-[-0.01em]">
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
                              <NuxtLink to="/panel/settings/installation" class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#0566ff] border border-[#0566ff] text-white rounded-[8px] text-[16px] font-normal leading-[20px] h-[38px] min-w-[80px] px-[16px] py-0 mb-0 touch-manipulation hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">Installer le widget de chat</NuxtLink>
                         </div>
                         <div class="pt-[60px] flex-[4_1_0%] self-stretch">
                              <div class="flex items-start justify-center w-full max-w-[600px]">
                                   <img class="max-w-full h-auto" src="/assets/img/72b3f326256f6cb756e0.jpeg" alt="">
                              </div>
                         </div>
                    </template>
               </div>
          </div>
     </div>

     <div v-if="panelStore.visitors.length === 0 && !panelStore.project?.widget_installed" class="absolute left-0 bottom-[56px] w-full flex items-center justify-center z-[620]">
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
