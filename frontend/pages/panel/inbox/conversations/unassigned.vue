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
                                   <div class="block relative w-full rounded-[8px] break-words px-[12px] py-[8px] pl-[56px] hover:bg-[#f5f7f9] group">
                                        <div class="hhcss_userPicture absolute left-[12px] mt-[4px] mr-[14px] bg-no-repeat bg-center bg-cover rounded-full text-white cursor-pointer flex-shrink-0 float-left text-[18px] h-[30px] w-[30px] leading-[1.66] text-center select-none" :style="backgroundUserDefault ? { backgroundImage: `url('${backgroundUserDefault}')` } : {}"></div>
                                        <div class=" leading-[18px] tracking-[-0.01em]">
                                             <strong class="mr-[10px] text-[14px] font-medium text-[rgb(8,15,26)]">tt@ttest.com</strong>
                                             <span class="text-[12px] text-[#647491] whitespace-pre-line">12:00</span>
                                        </div>
                                        <span class="text-[#080f1a] whitespace-pre-line text-[14px] leading-[1.28571429] tracking-[-0.01em]">sdqsd</span>
                                        <div class="hidden absolute top-[-12px] right-[8px] gap-x-[10px] group-hover:flex">
                                             <PanelCommonTooltip class="max-w-[115px] w-full" text="Créer un ticket" placement="top" variant="white">
                                                  <button class="inline-flex items-center justify-center w-[32px] h-[24px] bg-white rounded-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] cursor-pointer border-none p-0 m-0 group2">
                                                       <SvgoPanelInboxIconTicket class="w-[16px] h-[16px] min-w-[16px] min-h-[16px] fill-[#647491] group2-hover:fill-[#0566ff]"/>
                                                  </button>
                                             </PanelCommonTooltip>
                                             <PanelCommonTooltip class="max-w-[270px] w-full" text="Ajouter en tant que réponse prédéfinie" placement="top" variant="white">
                                             <button class="inline-flex items-center justify-center w-[32px] h-[24px] bg-white rounded-[12px] shadow-[0_1px_2px_0_rgba(0,0,0,0.06)] cursor-pointer border-none p-0 m-0 group2">
                                                  <SvgoPanelInboxIconAnswers class="w-[16px] h-[16px] min-w-[16px] min-h-[16px] fill-[#647491] group2-hover:fill-[#0566ff]"/>
                                             </button>
                                             </PanelCommonTooltip>
                                        </div>
                                   </div>
                                   <div class="text-[#647491] cursor-default italic break-words p-[8px] text-center select-none text-[14px]">Le visiteur a rouvert la conversation à 14:00</div>
                              </div>
                              <div class="grid grid-rows-[1fr] items-start transition-[grid-template-rows] duration-200 ease-in-out">
                                   <div class="relative px-[8px] py-[8px] pl-[34px] rounded-tl-[4px] rounded-tr-[4px] bg-[rgb(220,233,255)] text-[rgb(0,20,51)] text-[14px] leading-[1.28571429] tracking-[-0.01em]">
                                        <SvgoPanelInboxIconInfo class="absolute top-[8px] left-[8px] w-[18px] h-[18px] min-w-[18px] min-h-[18px] fill-[#0566ff] " />
                                        Le visiteur est hors ligne et sera informé par e-mail des messages non lus.
                                   </div>
                              </div>
                              <div>
                                   <div class="w-full bg-white transition-[border-color,background-color] relative min-h-[143px] flex-shrink-0 flex flex-col h-full">
                                        <div class="flex items-center px-[16px] pt-[4px] pb-[3px] border-b border-[rgb(239,242,246)]"></div>
                                        <div class="relative h-full flex flex-col min-h-0">
                                             <div class="flex min-h-[56px] overflow-auto flex-[1_1_0%]"></div>
                                             <div class="relative px-[16px] py-[10px]"></div>
                                             <div class="absolute top-[14px] right-[19px] z-[2]"></div>
                                        </div>
                                        <div class="absolute inset-x-0 top-[-3px] bottom-0 bg-[rgba(255,255,255,0.9)] backdrop-blur-[2px] z-[2] bg-[rgb(154,193,255)]">
                                             <div class="absolute top-0 left-0 w-full h-[3px] bg-[rgb(154,193,255)] z-[2]"></div>
                                             <div class="flex flex-col items-center justify-center h-full z-[1]">
                                                  <button class="inline-flex items-center justify-center text-white bg-[#0566ff] border border-[#0566ff] rounded-[8px] text-[14px] font-normal leading-[18px] h-[34px] min-w-[64px] px-[14px] py-0 text-center align-middle whitespace-nowrap select-none touch-manipulation hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">
                                                       <span>Rejoindre la conversation</span>
                                                  </button>
                                                  <p class="mt-[12px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em]">
                                                       ou appuyez sur <span class="inline-flex items-center justify-center flex-nowrap h-[20px] px-[6px] py-0 bg-[rgb(245,247,249)] border border-[rgb(211,219,229)] rounded-[4px] font-medium text-[rgb(100,116,145)] text-[11px] leading-[14px] tracking-[-0.01em] mx-[6px] my-0">⏎ Enter</span>  pour commencer à écrire
                                                  </p>
                                             </div>
                                        </div>
                                   </div>
                              </div>
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
