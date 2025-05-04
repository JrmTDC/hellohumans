<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
               <div class=" overflow-x-hidden w-full h-full">
                    <div class="min-w-full table min-h-full h-full">
                         <ul class="list-none p-[8px_12px] bg-[#f5f7f9] m-0 min-h-full h-full flex flex-col w-[232px]">

                              <li class="pt-[24px] px-[12px] pb-[8px] text-[#080f1a] text-[12px] leading-[16px] tracking-[-0.01em] font-medium uppercase flex justify-between items-center">Chat</li>

                              <li class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em] font-medium">
                                   <div class="rounded-[8px] relative">
                                        <button class="relative outline-none border-none rounded-[8px] flex items-center w-full text-left cursor-pointer bg-[#dce9ff] font-medium text-[#001433] p-[8px_12px] min-h-[36px]">
                                             <svgo-panel-settings-icon-menu-appearance  class="w-[16px] h-[16px] fill-[#001433] mr-[8px]"/>
                                             {{ t('panel.pages.settings.chat.appearance.menuLabel') }}
                                        </button>
                                   </div>
                              </li>

                              <li class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em] ">
                                   <div class="rounded-[8px] relative">
                                        <button class="relative outline-none border-none rounded-[8px] flex items-center w-full text-left cursor-pointer bg-transparent  text-[#354869] p-[8px_12px] min-h-[36px] hover:bg-[#64749114] hover:text-[#001433]">
                                             <svgo-panel-settings-icon-menu-setup  class="w-[16px] h-[16px] fill-[#001433] mr-[8px]"/>
                                             {{ t('panel.pages.settings.chat.setup.menuLabel') }}
                                        </button>
                                   </div>
                              </li>

                              <li class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em]">
                                   <div class="rounded-[8px] relative">
                                        <button class="relative outline-none border-none rounded-[8px] flex items-center w-full text-left cursor-pointer bg-transparent text-[#354869] p-[8px_12px] min-h-[36px]  hover:bg-[#64749114] hover:text-[#001433]">
                                             <svgo-panel-settings-icon-menu-translation  class="w-[16px] h-[16px] fill-[#001433] mr-[8px]"/>
                                             {{ t('panel.pages.settings.chat.translations.menuLabel') }}
                                        </button>
                                   </div>
                              </li>
                         </ul>
                    </div>
               </div>
          </div>
          <div data-radix-scroll-area-viewport class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">

                                   <div class="flex flex-row justify-start items-start">

                                        <div class="flex flex-col justify-start items-stretch w-full  mr-[20px]">
                                             <!-- <div class="relative p-[13px_20px_13px_44px] mb-0 rounded-[8px] bg-[rgb(255,221,167)] text-[rgb(58,35,0)] mb-[20px]">
                                                  <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]"
                                                  >
                                                       <svgo-chat-icon-warling class="w-[24px] h-[24px] fill-[#d48200]"/>
                                                  </div>
                                                  Le widget de chat n'est pas installé sur le site du client. Les visiteurs ne peuvent pas voir les modifications pour le moment.
                                             </div> -->

                                             <div class="flex flex-col justify-start items-stretch mb-[20px]" >
                                                  <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Apparence</h2>
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] max-w-[750px]">Personnalisez votre widget de chat HelloHuman pour attirer l'attention des visiteurs de votre site Web ou pour adapter l'apparence du widget à votre marque.</p>
                                             </div>

                                             <!-- SECTION GÉNÉRAL -->
                                             <PanelSettingsExpandableSection title="Général" :isBilled="false">
                                                  <div class="flex flex-col justify-start items-start gap-3">
                                                       <label class="block">Couleur d'arrière-plan :</label>
                                                       <ColorPicker type="backgroundColors" v-model="chatStore.config.backgroundColor" @update:textColor="chatStore.config.textColor = $event" />
                                                  </div>
                                                  <div  class="flex flex-col justify-start items-start gap-3 mt-[20px]">
                                                       <label class="block">Couleur du texte :</label>
                                                       <ColorPicker type="textColors" v-model="chatStore.config.textColor" />
                                                  </div>
                                                  <div class="flex flex-col justify-start items-start gap-3 mt-[20px]">
                                                       <label class="block">Couleur de l'action :</label>
                                                       <ColorPicker type="actionColors" v-model="chatStore.config.actionColor" />
                                                  </div>

                                                  <div class="flex flex-col justify-start items-start gap-3 mt-[20px]">
                                                       <label class="block">Logo de la marque</label>
                                                       <ColorPicker type="iconColors" v-model="chatStore.config.iconColor" />
                                                  </div>
                                             </PanelSettingsExpandableSection>

                                             <!-- SECTION CONTENU -->
                                             <PanelSettingsExpandableSection title="Contenu" :isBilled="false">
                                                  <label class="block mb-2">Questions suggérées :</label>
                                             </PanelSettingsExpandableSection>

                                             <!-- SECTION VISIBILITÉ & POSITION -->
                                             <PanelSettingsExpandableSection title="Visibilité et position" :isBilled="false">
                                                  <label class="block mb-2">Afficher le chat ?</label>
                                                  <input type="checkbox" v-model="chatStore.showChat" />
                                                  <textarea v-model="chatStore.suggestedQuestionsString" class="border px-3 py-2 rounded w-full"></textarea>
                                             </PanelSettingsExpandableSection>

                                             <!-- SECTION PACK NATURE -->
                                             <PanelSettingsExpandableSection title="Pack Nature" :isBilled="true" :isPaid="true">
                                                  <label class="block mb-2">Activer le Pack Nature ? </label>
                                                  <input type="checkbox" v-model="chatStore.config.has_nature_pack" />
                                             </PanelSettingsExpandableSection>

                                             <!-- SECTION AVANCÉ -->
                                             <PanelSettingsExpandableSection title="Avancé" :isBilled="false">
                                                  <label class="block mb-2">Clé API Client :</label>
                                                  <input v-model="chatStore.config.apiKey" type="text" class="border px-3 py-2 rounded w-full" />
                                             </PanelSettingsExpandableSection>

                                             <div class="sticky bottom-0 py-[20px] bg-white border-t border-t-[#eff2f6]">
                                                  <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 bg-[#0566ff] border border-[#0566ff] text-white hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">Sauvegarder</button>
                                             </div>
                                        </div>

                                        <div class="self-stretch w-[430px] min-w-[430px]">
                                             <div class="h-full sticky top-0 min-h-[628px] bg-[linear-gradient(rgb(255,255,255)_0%,rgba(255,255,255,0)_500px),url(data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////X19f///yH5BAEAAAMALAAAAAAQABAAAAIflG+hq4jM3IFLJhqswNly/XkcBpIiVaInlLJr9FZWAQA7)] bg-repeat w-full">
                                                  <Chat :clientConfig="clientConfig" />
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
import Chat from "~/components/chat/Chat.vue";
import ColorPicker from "~/components/panel/ColorPicker.vue";

const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const chatStore = useChatStore()
const clientConfig = computed(() => chatStore.config)

onMounted(async () => {
     layoutLoadingPanel.value = false
})

const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.settings.chat.appearance.metaTitle'),
     description: t('panel.pages.settings.chat.appearance.metaDescription')
})
pageHeaderTitle.value = 'Paramètres'
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true

definePageMeta({
     layout: 'panel'
})
</script>
