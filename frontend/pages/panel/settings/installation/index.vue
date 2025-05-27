<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-[1fr] gap-0 h-full max-h-full overflow-hidden">
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

                                             <div v-if="panelStore.project?.widget_installed"  class="relative px-[20px] py-[13px] pl-[44px] mb-[20px] rounded-[8px] bg-[#ccf1d5] text-[#0d2d16] text-[14px] leading-[18px]">
                                                  <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]">
                                                       <SvgoPanelSettingsIconChecked class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[#34b857]"/>
                                                  </div>
                                                  Le widget de chat est correctement installé
                                             </div>
                                             <div v-else class="relative px-[20px] py-[13px] pl-[44px] mb-[20px] rounded-[8px] bg-[rgb(252,217,222)] text-[rgb(65,5,14)] text-[14px] leading-[18px]">
                                                  <div class="absolute top-[10px] left-[12px] flex items-center justify-center w-[24px] h-[24px]">
                                                       <SvgoPanelSettingsIconWarning class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(232,19,50)]"/>
                                                  </div>
                                                  Le code du chat n’est pas correctement installé
                                             </div>
                                             <div class="flex flex-col justify-start items-stretch mb-[20px]">
                                                  <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Installation</h2>
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] max-w-[750px]">Vous souhaitez installer {{ config.public.chatBotName }}. Sélectionnez l’un des guides d’installation ci-dessous :</p>
                                             </div>

                                             <div>
                                                  <PanelCommonTabGroup v-model="selectedTab" :tabs="installationGuides">
                                                       <template #default="{ active }">
                                                            <div v-if="active === 'custom'">
                                                                 <div class="flex flex-col justify-start items-[normal]">
                                                                      <div>
                                                                           <div class="flex flex-row justify-start items-center">
                                                                                <div class="text-[12px] leading-[16px] tracking-[-0.01em] w-[24px] h-[24px] flex justify-center items-center flex-shrink-0 font-semibold rounded-full text-[rgb(0,73,189)] bg-[rgb(220,233,255)]">1</div>
                                                                                <p class="mt-0 mb-0 ml-[12px] font-normal text-[16px] leading-[20px] tracking-[-0.01em]">Collez cet extrait de code juste avant la balise</p>
                                                                           </div>
                                                                           <div class="pl-[36px]">
                                                                                <div class="flex flex-col w-full">
                                                                                     <fieldset class="px-[4px] py-0 rounded-[4px] border-[2px] border-[rgb(226,232,239)] bg-[rgb(239,242,246)] my-[16px]">
                                                                                          <legend class="text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)] w-auto block m-0 p-0 border-none whitespace-nowrap">
                                                                                               <span class="px-[8px] py-0">Extrait de code</span>
                                                                                          </legend>
                                                                                          <textarea @click="copyToClipboard" class="rounded-[8px] text-[16px] leading-[20px] tracking-[-0.01em] text-[rgb(100,116,145)] w-full border-none outline-none shadow-none resize-none break-all bg-[rgb(239,242,246)] m-0 p-[8px] border-[rgb(211,219,229)] h-[80px] scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[rgb(211,219,229)]" readonly>{{ embedCode }}</textarea>
                                                                                     </fieldset>
                                                                                     <div class="relative flex flex-wrap gap-[12px]">
                                                                                          <button @click="copyToClipboard" class="inline-flex items-center justify-center align-middle select-none whitespace-nowrap text-center cursor-pointer bg-[#dce9ff] border border-[#dce9ff] text-[#0049bd] rounded-[8px] text-[18px] font-normal leading-[23px] h-[46px] min-w-[100px] px-[20px] py-0 hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd] focus:outline-none focus:ring-[0.2em] focus:ring-[rgba(220,233,255,0.5)]">
                                                                                               <SvgoPanelSettingsIconCopy class="w-[24px] h-[24px] mr-[8px] ml-[-2px] fill-[#0049bd]"/>
                                                                                               <span>Copier dans le presse-papiers</span>
                                                                                          </button>
                                                                                     </div>
                                                                                </div>
                                                                           </div>
                                                                      </div>
                                                                      <div class="mt-[40px]">
                                                                           <div class="flex flex-row justify-start items-center">
                                                                                <div class="text-[12px] leading-[16px] tracking-[-0.01em] w-[24px] h-[24px] flex justify-center items-center flex-shrink-0 font-semibold rounded-full text-[rgb(0,73,189)] bg-[rgb(220,233,255)]">2</div>
                                                                                <p class="mt-0 mb-0 ml-[12px] font-normal text-[16px] leading-[20px] tracking-[-0.01em]">Accédez à votre site Web pour vérifier si le chat Hellohumans a bien été implémenté</p>
                                                                           </div>
                                                                           <div class="pl-[36px]">
                                                                                <span class="block w-[12px] min-w-[12px] h-[12px] min-h-[12px]"/>
                                                                                <p class="mt-0 mb-0 font-normal text-[16px] leading-[20px] tracking-[-0.01em] text-[rgb(100,116,145)]">Accédez au site Web sur lequel vous avez installé le code du widget de chat. Cette étape est requise pour activer le widget.</p>
                                                                                <span class="block w-[16px] min-w-[16px] h-[16px] min-h-[16px]"/>
                                                                                <div class="flex flex-row justify-start items-center">
                                                                                     <template v-if="panelStore.project?.widget_installed" >
                                                                                          <div class="inline-block p-0">
                                                                                               <SvgoPanelSettingsIconCheckedBold class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[#34b857]"/>
                                                                                          </div>
                                                                                          <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] ml-[8px]">widget activé</p>
                                                                                     </template>
                                                                                     <template v-else>
                                                                                          <div class="inline-block p-0">
                                                                                               <span class="hhcss_loadingCheckActivationWidget block w-[24px] h-[24px]"></span>
                                                                                          </div>
                                                                                          <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491] ml-[8px]">vérification de l'activation du widget</p>
                                                                                     </template>

                                                                                </div>
                                                                           </div>
                                                                      </div>
                                                                 </div>
                                                            </div>

                                                            <div v-else-if="active === 'wordpress'">
                                                                 <div class="flex flex-col justify-start items-[normal]">
                                                                      <p>Instructions spécifiques à WordPress...</p>
                                                                 </div>
                                                            </div>
                                                       </template>
                                                  </PanelCommonTabGroup>
                                             </div>
                                        </div>
                                   </div>
                              </div>
                              <span class="block w-[12px] min-w-[12px] h-[12px] min-h-[12px]" />
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import iconInstallationCustom from "assets/icons/panel/settings/iconInstallationCustom.svg";
import iconInstallationWordpress from "assets/icons/panel/settings/iconInstallationWordpress.svg";

const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const panelStore = usePanelStore()

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})

const config = useRuntimeConfig()
const selectedTab = ref('custom')
const textareaEl = ref<HTMLTextAreaElement | null>(null)
const { push } = useToast()

const installationGuides = [
     {
          icon: rawIcon(iconInstallationCustom),
          value: 'custom',
          label: 'Installation manuelle'
     },
     {
          icon: rawIcon(iconInstallationWordpress),
          value: 'wordpress',
          label: 'Wordpress'
     }
]
const embedCode = `<script src="//code.hellohumans.fr/${panelStore.project.public_key}.js" async><\/script>`
function copyToClipboard() {
     const { copy } = useClipboard(embedCode)
     copy().then(() => {
          push('Copié dans le presse-papiers', { type: 'success', duration: 5000 })
     }).catch(() => {
          push('Erreur lors de la copie', { type: 'error', duration: 5000 })
     })
}
</script>
