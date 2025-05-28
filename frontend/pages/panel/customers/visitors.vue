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
                                   <div class="mt-[20px]">
                                        <div class="flex flex-row items-center h-[32px] mr-auto">

                                             <!-- Filter by country -->
                                             <div class="mr-[8px] relative cursor-pointer">
                                                  <div class="relative box-border">
                                                       <div class="flex items-center justify-between w-[174px] h-[28px] rounded-[12px] bg-[rgba(100,116,145,0.08)] border-[2px] border-transparent cursor-pointer">
                                                            <div class="flex flex-row justify-start items-center overflow-hidden">
                                                                 <span class="ml-[10px] mr-[6px] whitespace-nowrap text-[14px] leading-[18px] text-[#001b47]">Tous les pays</span>
                                                            </div>
                                                            <div class="flex items-center self-stretch flex-shrink-0 box-border">
                                                                <div class="pr-[4px] pl-0 pt-0 pb-0">
                                                                     <div class="flex items-center justify-center">
                                                                          <SvgoPanelCustomersIconArrowDown class="rotate-0 w-[20px] h-[20px]" />
                                                                     </div>
                                                                </div>
                                                            </div>
                                                       </div>
                                                  </div>
                                             </div>

                                        </div>
                                   </div>
                                   <div class="mt-[20px]">
                                        <div class="flex flex-[1_1_0%] flex-col h-[calc(100vh-270px)]">
                                             <!-- Table Header -->
                                             <div class="font-bold uppercase flex flex-row items-center h-[48px] overflow-hidden bg-white rounded-t-[6px]">
                                                  <div class="flex w-full h-full px-[4px] rounded-t-[12px] border-t border-l border-r border-[rgb(226,232,239)] border-b-0">
                                                       <div class="ml-[16px] mr-[16px] flex-[2_1_0px] min-w-[200px]">
                                                            <div class="flex items-center text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] pt-[16px] font-normal capitalize">Nom</div>
                                                       </div>
                                                       <div class="ml-[16px] mr-[16px] flex-[1_1_0px] max-w-[170px] min-w-[96px]">
                                                            <div class="flex items-center text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] pt-[16px] font-normal capitalize">Première visite</div>
                                                       </div>
                                                       <div class="ml-[16px] mr-[16px] flex-[1_1_0px] max-w-[93px] min-w-[83px]">
                                                            <div class="flex items-center text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] pt-[16px] font-normal capitalize">
                                                                <SvgoPanelCustomersIconEart class="h-[16px] w-[17px] fill-[#647491]"
                                                                />
                                                                <span class="px-[4px] pl-[3px] py-0 text-[rgb(211,219,229)]">/</span>
                                                                <SvgoPanelCustomersIconDesktop class="h-[16px] w-[17px] fill-[#647491]"
                                                                />
                                                            </div>
                                                       </div>
                                                       <div class="ml-[16px] mr-[16px] flex-[1_1_0px] min-w-[200px]">
                                                            <div class="flex items-center text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] pt-[16px] font-normal capitalize">Dernière page visitée</div>
                                                       </div>
                                                       <div class="ml-[16px] mr-[16px] !flex-[0_1_auto]"></div>
                                                  </div>
                                             </div>
                                             <!-- Table Body -->
                                             <div class="outline-none bg-white border border-[rgb(226,232,239)] rounded-b-[12px] min-h-[66px] box-border direction-ltr relative will-change-transform overflow-hidden h-[64px]">
                                                  <div class="w-auto h-[56px] max-h-[56px] overflow-hidden relative">
                                                       <div class="flex flex-row items-center h-[56px] left-0 top-0 absolute w-full overflow-hidden px-[4px] cursor-pointer outline-none">
                                                            <div class="ml-[16px] mr-[16px] overflow-hidden flex-[2_1_0px] min-w-[200px]">
                                                                 <div class="flex flex-row justify-start items-center">
                                                                      <div class="w-[10px] h-[10px] flex-[0_0_10px] bg-[rgb(52,184,87)] rounded-full"></div>
                                                                      <div class="ml-[8px] flex-[0_0_30px]">
                                                                           <div class="bg-[#cbd852] rounded-full text-white cursor-default flex-shrink-0 float-left text-[18px] h-[30px] leading-[1.66] mr-[10px] text-center select-none w-[30px]">J</div>
                                                                      </div>
                                                                      <div class="flex flex-col justify-center flex-[2_1_auto] min-w-0 ml-[8px]">
                                                                           <div class="text-[16px] leading-[20px] tracking-[-0.01em] font-bold overflow-hidden text-ellipsis text-[#080f1a]">jeremy@hellohumans.fr</div>
                                                                           <div class="text-[12px] leading-[16px] tracking-[-0.01em] mt-[2px] text-[#647491] self-start">Récurrent</div>
                                                                      </div>
                                                                      <div class="flex items-center overflow-hidden flex-[0_0_55px] pr-[30px] ml-[8px]"></div>
                                                                 </div>
                                                            </div>
                                                            <div class="ml-[16px] mr-[16px] overflow-hidden flex-[1_1_0px] max-w-[170px] min-w-[96px]">
                                                                 <div class="text-[#080f1a] text-[14px]">quelques secondes plus tôt</div>
                                                            </div>
                                                            <div class="ml-[16px] mr-[16px] overflow-hidden flex-[1_1_0px] max-w-[93px] min-w-[83px]">
                                                                 <div class="flex">
                                                                      <SvgoPanelFlagsFr class="h-[18px] w-[18px]"/>
                                                                      <SvgoPanelBrowsersChrome class="ml-[12px] h-[18px] w-[18px]"/>
                                                                 </div>
                                                            </div>
                                                            <div class="ml-[16px] mr-[16px] overflow-hidden flex-[1_1_0px] min-w-[200]">
                                                                 <div class="flex flex-row">
                                                                      <NuxtLink to="/panel/simulateVisitor?projectPublicKey" class="h-[19px] overflow-hidden relative text-ellipsis whitespace-nowrap ml-[3px] text-[rgb(5,102,255)] text-[14px] hover:text-[#0047b7] hover:underline" target="_blank">/panel/simulateVisitor</NuxtLink>
                                                                 </div>
                                                            </div>
                                                            <div class="ml-[16px] mr-[16px] overflow-hidden flex-[0_1_0px]"></div>
                                                       </div>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
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

     <div v-if="!panelStore.project?.widget_installed" class="absolute left-0 bottom-[56px] w-full flex items-center justify-center z-[620]">
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
