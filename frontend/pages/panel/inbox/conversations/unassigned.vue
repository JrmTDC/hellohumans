<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
               <PanelInboxChildSideMenu />
          </div>
          <div class="flex w-full">


               <div class="w-[320px] min-w-[320px] bg-white border border-r-0 border-[rgb(226,232,239)] rounded-l-[16px] text-[rgb(8,15,26)] flex flex-col h-[calc(100%-12px)] relative mb-[12px]">

                    <div class="p-[20px_24px] flex-[0_0_58px] flex relative flex-col">
                         <div class="w-full flex flex-row justify-start items-center">
                              <h2 class="mt-0 mb-0 mr-auto font-medium text-[20px] leading-[26px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap flex flex-row items-center content-center flex-nowrap"><span><SvgoPanelInboxIconUnassigned class="w-[20px] h-[20px] fill-[#001433] min-h-[20px] min-w-[20px] mr-[6px]"/> </span> Non attribués</h2>
                         </div>
                    </div>

                    <PanelInboxConversationItem
                         :items="conversationsUnassigned"
                         emptyMessage="Vous n’avez pas de conversations non attribuées pour le moment."
                         :background="backgroundConversationEmpty"
                    />


               </div>
               <div class="w-full h-[calc(100%-12px)] overflow-hidden bg-white border border-[rgb(226,232,239)] m-[0_12px_12px_0] rounded-r-[16px] flex relative">
                    <div class="flex-[3_1_0%] max-w-[812px]">

                         <div v-if="conversationsUnassigned" class="flex flex-col h-full relative">
                              <div class="flex flex-row justify-start items-center relative z-[3] border-b border-[rgb(226,232,239)] min-h-[52px] px-[16px]">
                                   <div class="mr-auto inline-flex relative align-top min-w-0 flex-shrink">
                                        <PanelCommonTooltip text="Destinataire: Non attribué" placement="bottom" variant="white">
                                        <div class="overflow-hidden cursor-pointer">
                                             <div class="flex flex-row items-center pl-[8px] pr-[4px] h-[36px] rounded-[8px] cursor-pointer hover:bg-[#eff2f6]">
                                                  <p class="mt-0 mb-0 mr-[8px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)]">Destinataire</p>
                                                  <SvgoPanelInboxIconNoAgent class="w-[24px] h-[24px]" />
                                                  <p class="mt-0 mb-0 ml-[6px] font-normal text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap">Non attribué</p>
                                                  <div class="flex items-center ml-0">
                                                       <SvgoPanelInboxIconArrowBottom class="w-[24px] h-[24px] fill-[#8796af]" />
                                                  </div>
                                             </div>
                                        </div>
                                        </PanelCommonTooltip>
                                   </div>
                                   <div class="ml-[12px] flex flex-row justify-start items-center">
                                        <PanelCommonTooltip class="max-w-[250px] w-full" text="Résoudre sans avertir le client. Les conversation datant de plus de 30 jours sans réponse du visiteur seront résolues automatiquement." placement="bottom" variant="white">
                                             <button class="bg-transparent border border-[#d1d9e0] rounded-[8px] cursor-pointer inline-flex items-center justify-center text-[14px] font-normal leading-[18px] h-[34px] min-w-[64px] px-[14px] py-0 mb-0 text-[#333] text-center touch-manipulation select-none align-middle whitespace-nowrap hover:bg-[#eff2f6] hover:border-[#acb8cb] hover:text-[#333]">
                                                  <SvgoPanelInboxIconInboxChecked class="h-[20px] w-[20px] fill-[#34b857]"/>
                                                  <span>Résoudre</span>
                                             </button>
                                        </PanelCommonTooltip>
                                   </div>
                                   <div class="flex flex-row justify-start items-center ml-[12px]">
                                        <div>
                                             <PanelCommonTooltip class="max-w-[115px] w-full" text="Créer un ticket" placement="bottom" variant="white">
                                                  <button class="bg-transparent border-0 inline-flex items-center justify-center shadow-none outline-none px-1 py-0 cursor-pointer rounded-[4px] text-current w-[24px] h-[24px] hover:bg-[#dce9ff] focus:bg-[#dce9ff] group">
                                                       <SvgoPanelInboxIconTicket class="min-w-[20px] min-h-[20px] fill-[#647491] group-hover:fill-[#0566ff]"/>
                                                  </button>
                                             </PanelCommonTooltip>
                                        </div>
                                        <div class="ml-[4px]">
                                             <div class="inline-flex relative align-top">
                                                  <button class="inline-flex items-center justify-center w-6 h-6 p-0 px-1 text-current bg-transparent border-0 outline-none shadow-none rounded cursor-pointer hover:bg-[#dce9ff]">
                                                       <SvgoPanelInboxIconMore class="min-w-[20px] min-h-[20px] fill-[#647491] group-hover:fill-[#0566ff]"/>
                                                  </button>
                                             </div>

                                        </div>
                                   </div>
                              </div>
                              <div class="hhcss_inbox_boxMessage flex flex-col flex-1 overflow-auto mt-auto mb-0 ml-2 mr-2 pb-5 scrollbar-thin scrollbar-thumb-[#d3dbe5] scrollbar-track-transparent">
                                   <div class="hhcss_boxMessage_lastDate mt-auto text-center px-5 pt-[13px] pb-[9px]">
                                        <span class="bg-white px-[30px] relative text-[14px] leading-[1.28571429] tracking-[-0.01em] text-[#080f1a]">11 juin 2025</span>
                                   </div>
                                   <div class="block relative w-full rounded-[8px] break-words px-[12px] py-[8px] pl-[56px]">
                                        <div class="absolute left-[12px] mt-[4px] mr-[14px] bg-no-repeat bg-center bg-cover rounded-full text-white cursor-pointer flex-shrink-0 float-left text-[18px] h-[30px] w-[30px] leading-[1.66] text-center select-none" :style="backgroundUserDefault ? { backgroundImage: `url('${backgroundUserDefault}')` } : {}"></div>
                                        <div class=" leading-[18px] tracking-[-0.01em]">
                                             <strong class="mr-[10px] text-[14px] font-medium text-[rgb(8,15,26)]">tt@ttest.com</strong>
                                             <span class="text-[12px] text-[#647491] whitespace-pre-line">12:00</span>
                                        </div>
                                        <span class="text-[#080f1a] whitespace-pre-line text-[14px] leading-[1.28571429] tracking-[-0.01em]">sdqsd</span>
                                   </div>
                              </div>
                              <div></div>
                              <div></div>
                              <div></div>
                         </div>

                         <PanelInboxEmpty v-if="!conversationsUnassigned && !conversations"
                              title="Aucune conversation non attribuée"
                              description="Accédez au dossier Ouverts pour travailler sur les conversations qui vous sont attribuées."
                              button="Accéder aux Ouverts"
                              :onClick="() => navigateTo('/panel/inbox/operator')"
                         />

                         <PanelInboxEmpty v-if="!conversationsUnassigned && conversations"
                              title="Aucune conversation active"
                              description="Avant de commencer une vraie conversation avec vos visiteurs, simulez-en une pour voir le fonctionnement !."
                              button="Simuler une conversation"
                              :onClick="() => simulateVisitor()"
                         />
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const backgroundConversationEmpty = useBase64Asset('panel/inbox/conversations/empty')
const backgroundUserDefault = useBase64Asset('panel/inbox/user/default')
const inboxStore = useInboxStore()
const panelStore = usePanelStore()
const conversations = ref([])
const conversationsUnassigned = [
     {
          id: 'V-gdDFSD582dv',
          timeAgo: '10 min',
          lastMessage: 'Bonjour',
          agent: 'Jeremy',
          link: '/panel/inbox/conversation/1'
     }
]

onMounted(async () => {
     //await inboxStore.fetchData()
     layoutLoadingPanel.value = false
})

function simulateVisitor() {
     const url = '/panel/simulateVisitor?projectPublicKey=' + panelStore.project?.public_key
     const features = 'width=800,height=680,menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes'
     window.open(url, '_blank', features)
}

definePageMeta({
     layout: 'panel'
})
</script>
