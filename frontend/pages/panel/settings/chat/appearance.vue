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
                                                  <div class="flex flex-col justify-start items-start gap-3">
                                                       <label class="block">Couleur d'arrière-plan :</label>
                                                       <PanelChatColorPicker type="backgroundColors" v-model="chatStore.configChat.backgroundColor" @update:textColor="chatStore.configChat.textColor = $event" />
                                                  </div>
                                                  <div  class="flex flex-col justify-start items-start gap-3 mt-[20px]">
                                                       <label class="block">Couleur du texte :</label>
                                                       <PanelChatColorPicker type="textColors" v-model="chatStore.configChat.textColor" />
                                                  </div>
                                                  <div class="flex flex-col justify-start items-start gap-3 mt-[20px]">
                                                       <label class="block">Couleur de l'action :</label>
                                                       <PanelChatColorPicker type="actionColors" v-model="chatStore.configChat.actionColor" />
                                                  </div>

                                                  <div class="flex flex-col justify-start items-start gap-3 mt-[20px]">
                                                       <label class="block">Logo de la marque</label>
                                                       <PanelChatColorPicker type="iconColors" v-model="chatStore.configChat.iconColor" />
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
                                                  <textarea v-model="chatStore.suggestedQuestions" class="border px-3 py-2 rounded w-full"></textarea>
                                             </PanelSettingsExpandableSection>

                                             <!-- SECTION PACK NATURE -->
                                             <PanelSettingsExpandableSection title="Pack Nature" :isBilled="true" :isPaid="true">
                                                  <label class="block mb-2">Activer le Pack Nature ? </label>
                                                  <input type="checkbox" v-model="chatStore.configChat.has_nature_pack" />
                                             </PanelSettingsExpandableSection>

                                             <div class="sticky bottom-0 py-[20px] bg-white border-t border-t-[#eff2f6]">
                                                  <button :disabled="saving" @click="handleSaveChatConfigClick" class="rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] border transition text-white" :class="saving ? 'bg-gray-400 border-gray-400 cursor-not-allowed' : 'bg-[#0566ff] border-[#0566ff] hover:bg-[#0049bd] hover:border-[#0049bd]'">{{ saving ? 'Enregistrement…' : 'Sauvegarder' }}
                                                  </button>
                                             </div>
                                        </div>

                                        <div class="self-stretch w-[430px] min-w-[430px]">
                                             <div class="h-full sticky top-0 min-h-[628px] bg-[linear-gradient(rgb(255,255,255)_0%,rgba(255,255,255,0)_500px),url(data:image/gif;base64,R0lGODlhEAAQAJEAAAAAAP////X19f///yH5BAEAAAMALAAAAAAQABAAAAIflG+hq4jM3IFLJhqswNly/XkcBpIiVaInlLJr9FZWAQA7)] bg-repeat w-full">
                                                  <Chat :previewMode="true" forcedState="home" :projectPublicKey="panelStore.project?.public_key" />
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
const layoutLoadingPanel = useState('layoutLoadingPanel')
const chatStore = useChatStore()
const saving = ref(false)
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
</script>
