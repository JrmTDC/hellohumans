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
                                             <div class="flex flex-col justify-start items-stretch mb-[20px]" >
                                                  <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Compte</h2>
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] max-w-[750px]">Modifiez votre nom d'agent, ajoutez votre photo de profil, modifiez votre adresse e-mail et votre mot de passe, et ajustez votre région pour que votre fuseau horaire s'affiche correctement.</p>
                                             </div>
                                             <PanelCommonTabs :tabs="tabsContenu" v-model="selectedTab" class="mt-5"/>
                                             <section v-show="selectedTab === 'details'" class="ml-[20px] mr-[20px]">
                                                  <div class="pt-[20px] pb-[20px]">
                                                       <div class="flex flex-row justify-start items-start">
                                                            <div class="w-full">
                                                                 <PanelCommonInputField label="Nom d'affichage" v-model="panelStore.user.display_name"/>
                                                            </div>
                                                       </div>
                                                       <div class="flex flex-row justify-start items-start mt-[20px]">
                                                            <div class="w-full">
                                                                 <PanelCommonInputField  label="Email" v-model="panelStore.user.email"/>
                                                            </div>
                                                       </div>
                                                       <div class="flex flex-row justify-start items-start mt-[20px]">
                                                            <div class="w-full">
                                                                 <PanelCommonSelectField v-model="selectedOptionRegion" label="Région" :options="optionRegions" option-key="value" option-label="label" dropdown-class="min-w-[581px] max-w-[256px]" @change="handleLanguageChange" />
                                                            </div>
                                                       </div>
                                                       <div class="flex flex-row justify-start items-start mt-[20px]">
                                                            <div class="w-full">
                                                                 <PanelCommonSelectField v-model="selectedOptionLanguage" label="Langue" :options="optionLocales" option-key="value" option-label="label" dropdown-class="min-w-[581px] max-w-[256px]" @change="handleLanguageChange" />
                                                            </div>
                                                       </div>
                                                  </div>
                                             </section>
                                        </div>
                                   </div>
                              </div>
                         </div>
                    </div>
               </div>
          </div>
     </div>
     <PanelModalConfirme
          v-if="showCreateProjectModal"
          @close="showCreateProjectModal = false"
          :newLanguage="newLanguage"
     />
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const panelStore = usePanelStore()
const { locale, locales, setLocale } = useI18n()
const router = useRouter()
const langMenuRef = ref()
onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})
const selectedTab = ref('details')
const tabsContenu = [
     { value: 'details', label: 'Détails personnels' },
     { value: 'password', label: 'Mot de passe' }
]
const optionLocales = locales.value.map((locale: any) => ({
     value: locale.code,
     label: locale.shortName,
}))
const showCreateProjectModal = ref(false)
const selectedOptionLanguage= ref(locale.value)
const newLanguage = ref('')
const handleLanguageChange = async (lang: any) => {

     if (lang.value !== locale.value) {
          showCreateProjectModal.value = true
          newLanguage.value = lang
     }
}
const selectedOptionRegion= ref('utc+1')
const optionRegions = [
     { value: 'utc+1', label: 'Europe / Paris' }
]
</script>
