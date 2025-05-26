<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
               <PanelSettingsChildSideMenu />
          </div>
          <div data-radix-scroll-area-viewport class="overflow-hidden overflow-y-auto">
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
                                                  <div class="p-[20px]">
                                                       <div>
                                                            <PanelChatColorPicker type="backgroundColors" v-model="chatStore.configChat.backgroundColor" label="Couleur d'arrière-plan" @update:textColor="chatStore.configChat.textColor = $event" />
                                                       </div>
                                                       <div class="mt-[20px]">
                                                            <PanelChatColorPicker type="textColors" v-model="chatStore.configChat.textColor" label="Couleur du texte" />
                                                       </div>
                                                       <div class="mt-[20px]">
                                                            <PanelChatColorPicker type="actionColors" v-model="chatStore.configChat.actionColor" label="Couleur de l'action"  />
                                                       </div>




                                                  </div>
                                             </PanelSettingsExpandableSection>

                                             <!-- SECTION CONTENU -->
                                             <PanelSettingsExpandableSection title="Contenu" :isBilled="false">

                                                  <PanelCommonTabs :tabs="tabsContenu" v-model="selectedTab" class="mt-5"/>

                                                  <div class="p-[20px]">
                                                       <div v-if="selectedTab === 'home'" class="pb-0 pt-0 flex flex-col justify-start items-[normal] max-w-[750px]">
                                                            <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)]">Souhaitez la bienvenue à vos visiteurs lorsqu'ils ouvrent le widget.</p>
                                                            <div class="mt-[20px]">
                                                                 <PanelCommonTextareaField v-model="chatStore.configChat.welcomeTitle" label="En-tête" />
                                                            </div>

                                                            <div class="mt-[20px]">
                                                                 <PanelCommonTextareaField v-model="chatStore.configChat.welcomeMessage" label="Message" />
                                                            </div>

                                                            <div class="mt-[20px] flex flex-col gap-[12px] justify-start items-start" :class="[' xl:flex-row']">
                                                                 <label class="pt-0 flex-[0_0_100%] min-w-[145px] max-w-full xl:pt-[8px] xl:flex-[1_0_175px] xl:max-w-[min(180px,12vw)] text-[14px]">Amorces de conversation <p class="mt-0 mb-0 font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">Les visiteurs peuvent rapidement entamer une conversation avec {{ chatBotName }}</p>
                                                                 </label>
                                                                 <div class="w-full">

                                                                      <div class="w-full flex flex-col mb-[8px]">
                                                                           <PanelCommonDragList
                                                                                :list="chatStore.suggestions"
                                                                                @update:list="chatStore.suggestions = $event"
                                                                                @sorted="chatStore.saveOrder"
                                                                                @delete="chatStore.removeSuggestion"
                                                                           />
                                                                      </div>
                                                                      <button @click="chatStore.addSuggestion" class="bg-[rgba(136,148,171,0)] border border-[#d1d9e0] text-[#333] inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 hover:bg-[#eff2f6] hover:border-[#acb8cb] hover:text-[#333] cursor-pointer">
                                                                           <SvgoPanelSettingsIconAdd class="ml-[-2px] mr-[6px] fill-[#080f1a] h-[20px] w-[20px]"/>Ajouter nouveau
                                                                      </button>

                                                                 </div>
                                                            </div>

                                                       </div>
                                                  </div>
                                             </PanelSettingsExpandableSection>

                                             <div class="sticky bottom-0 py-[20px] bg-white border-t border-t-[#eff2f6]">
                                                  <button :disabled="saving" @click="handleSaveChatConfigClick" class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] border transition text-white" :class="saving ? 'bg-gray-400 border-gray-400 cursor-not-allowed' : 'bg-[#0566ff] border-[#0566ff] hover:bg-[#0049bd] hover:border-[#0049bd]'">{{ saving ? 'Enregistrement…' : 'Sauvegarder' }}
                                                  </button>
                                             </div>
                                        </div>

                                        <div class="sticky top-[24px] self-start relative pl-0 rounded-[6px] w-[450px] min-w-[450px] 2xl:w-[416px] 2xl:min-w-[416px] h-[calc(100vh-48px)]">
                                             <div class="absolute inset-0 z-0 bg-repeat pointer-events-none" :style="{ backgroundImage: `linear-gradient(rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 500px), url('${backgroundSettingChat}')` }"/>

                                             <!-- Conteneur sticky avec preview chat -->
                                             <div class="relative z-10 flex flex-col h-full max-h-full">
                                                  <!-- Bandeau dropdown -->
                                                  <div class="sticky top-0 z-[2] bg-white text-[rgb(100,116,145)] pt-[15px] px-[20px] pb-0 rounded-tr-[6px]">
                                                       <div class="flex items-center">
                                                            <label class="inline-block font-normal max-w-full">Aperçu&nbsp;:</label>
                                                            <div class="mb-0 text-left relative ml-[4px]">
                                                                 <PanelCommonDropdownSelect v-model="selected" :items="chatScreenOptions" />
                                                            </div>
                                                       </div>
                                                  </div>

                                                  <!-- Chat sticky à droite -->
                                                  <div class="flex-1 flex items-end justify-center px-[10px] pb-[24px] pt-[30px] overflow-hidden">
                                                       <Chat class="w-full max-w-[416px] h-full" :previewMode="true" :forcedState="selected" :projectPublicKey="panelStore.project?.public_key" />
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
const panelStore = usePanelStore()
const route = useRoute()
const config = useRuntimeConfig()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const chatStore = useChatStore()
const saving = ref(false)
const backgroundSettingChat = 'data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////X19f///yH5BAEAAAMALAAAAAAQABAAAAIflG+hq4jM3IFLJhqswNly/XkcBpIiVaInlLJr9FZWAQA7'
const chatBotName = config.public.chatBotName
const { push } = useToast()
onMounted(async () => {
     setTimeout(() => {
          layoutLoadingPanel.value = false
     }, 400)
})

definePageMeta({
     layout: 'panel'
})
async function handleSaveChatConfigClick () {
     if (saving.value) return
     saving.value = true
     const ok = await panelStore.saveChatConfig()
     saving.value = false

     if (ok) push('Paramètres enregistrés.', { type: 'success' })
     else  push('Erreur lors de la sauvegarde', { type: 'error', duration: 5000 })
}
const chatScreenOptions = [
     { label: 'Accueil', value: 'home' },
     { label: 'Chat', value: 'conversation' },
     { label: 'Accord RGPD', value: 'modal' },
     { label: 'Minimisé', value: 'minimal' }
] as const
const selectedTab = ref('home')
const selected = ref<'home' | 'minimal' | 'conversation' | 'modal'>('home')

watch(selectedTab, (newVal) => {
     selected.value = newVal as typeof selected.value
})
const tabsContenu = [
     { value: 'home', label: 'Accueil' },
     { value: 'conversation', label: 'Chat' },
     { value: 'modal', label: 'Accord RGPD' },
     { value: 'minimal', label: 'Minimisé' }
]
</script>
