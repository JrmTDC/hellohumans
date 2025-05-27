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
                                                  <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Traductions</h2>
                                                  <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[rgb(100,116,145)] max-w-[750px]">Activez autant de langues que vous le souhaitez et ajoutez celles dont vous avez besoin. Le widget s'adaptera à la langue du navigateur par défaut des utilisateurs. Pour ajouter une nouvelle traduction, sélectionnez-la dans la liste déroulante.</p>
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
import iconInstallationCustom from "assets/icons/panel/settings/iconInstallationCustom.svg";
import iconInstallationWordpress from "assets/icons/panel/settings/iconInstallationWordpress.svg";

const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})

const config = useRuntimeConfig()
const selectedStyle = ref('custom')
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
</script>
