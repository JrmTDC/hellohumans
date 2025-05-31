<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelVisitorsChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden overflow-y-auto">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-stretch">
                                        <div class="flex flex-row justify-start items-center w-full">
                                             <h2 class="mr-auto mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">Tous les contacts</h2>
                                        </div>
                                   </div>

                                   <span class="block w-[20px] min-w-[20px] h-[20px] min-h-[20px]"></span>
                                   <div class="flex flex-col justify-start items-[normal]">

                                        <div class="items-stretch bg-white border border-[#e2e8ef] rounded-[12px] flex flex-shrink-0">
                                             <div class="flex items-center flex-1 flex-wrap text-[16px] px-0 py-[13px] pl-[13px] pr-0 flex-[0_0_255px] md:flex-[0_1_210px] md:flex-row md:items-center md:justify-center md:flex-col">
                                                  <div class="flex w-full relative align-top">
                                                       <span class="flex items-center my-[4px] ml-auto min-h-[30px] whitespace-nowrap">
                                                            <SvgoPanelCustomersIconFilters class="fill-[#d3dbe5] flex-[0_0_24px] ml-[8px] mr-[16px] w-[24px] h-[24px]"/>
                                                            <div>Correspondant à tous les filtres</div>
                                                            <SvgoPanelCustomersIconArrowDown class="fill-[#080f1a] ml-[10px] w-[24px] h-[24px]"/>
                                                       </span>
                                                  </div>
                                             </div>
                                             <div class="bg-white flex-[0_0_20px] ml-[-18px] mr-[-18px]">
                                                  <SvgoPanelCustomersChevron class="w-[66px] h-full" />
                                             </div>
                                             <div class="flex items-center flex-1 flex-wrap text-[16px] py-[13px] px-0 xl:items-start xl:flex-col xl:justify-center">
                                                  <div class="inline-flex relative align-top">
                                                       <div class="cursor-pointer">
                                                            <button class="inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] px-[14px] min-w-auto active:text-[#0047b7]  hover:underline">
                                                                 <SvgoPanelCustomersIconAddFilters class="h-[20px] w-[20px] fill-[#0566ff] ml-[-2px] mr-[6px]" />
                                                                 <span class="text-[#0566ff] font-normal">Ajouter un filtre</span>
                                                            </button>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="flex items-center justify-end flex-[0_2_190px] pr-0 pl-[20px] py-[12px]"></div>
                                        </div>

                                        <div class="mt-[12px] bg-white border border-[#e2e8ef] rounded-[12px]">
                                             <div class="flex flex-row justify-start items-center p-[16px] border-b border-b-[rgb(226,232,239)] ml-auto relative">
                                                  <div class="flex flex-row justify-start items-center w-full">
                                                       <p class="mt-0 mb-0 mr-auto font-medium text-[16px] leading-[20px] tracking-[-0.01em]">Résultats : {{ panelStore.visitors.length }}</p>
                                                       <div></div>
                                                  </div>
                                                  <div class="ml-[32px] flex">
                                                       <button class="bg-[rgba(136,148,171,0)] border border-[#d1d9e0] text-[#333] inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap hover:bg-[#eff2f6] hover:border-[#acb8cb] hover:text-[#333] active:bg-[rgba(136,148,171,0.16)] active:border-[#aeb4c2] active:text-[#333]">
                                                            <SvgoPanelCustomersIconImport class="fill-[rgb(135,150,175)] ml-[-2px] mr-[6px] w-[20px] h-[20px] min-w-[20px] min-h-[20px]"/>
                                                            <span>Importer à partir d’un fichier</span>
                                                       </button>
                                                       <div class="inline-flex relative align-top ml-[10px]">
                                                            <button class="bg-[rgba(136,148,171,0)] border border-[#d1d9e0] text-[#333] inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap hover:bg-[#eff2f6] hover:border-[#acb8cb] hover:text-[#333] active:bg-[rgba(136,148,171,0.16)] active:border-[#aeb4c2] active:text-[#333]">
                                                                 <SvgoPanelCustomersIconCustomize class="fill-[rgb(135,150,175)] ml-[-2px] mr-[6px] w-[20px] h-[20px] min-w-[20px] min-h-[20px]"/>
                                                                 <span>Personnaliser</span>
                                                            </button>
                                                       </div>

                                                  </div>
                                             </div>
                                             <PanelCommonLeadTable :leads="panelStore.leads" />
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
const layoutLoadingPanel = useState('layoutLoadingPanel')
const backgroundNoCustomer = useAssetBase64Loader('panel/customers/backgroundNoCustomers')
const panelStore = usePanelStore()
onMounted(async () => {
     layoutLoadingPanel.value = false

     panelStore.leads = [
          {
               id: 'lead_1',
               email: 'alice@example.com',
               radar: 'A',
               country: 'fr',
               created_at: new Date().toISOString(),
          },
          {
               id: 'lead_2',
               email: 'bob@hellohumans.fr',
               radar: 'B',
               country: 'us',
               created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // il y a 5 minutes
          },
          {
               id: 'lead_3',
               email: 'carla@demo.com',
               radar: 'C',
               country: 'de',
               created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // il y a 1 heure
          },
          {
               id: 'lead_4',
               email: '',
               radar: '?',
               country: null,
               created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // il y a 1 jour
          },
     ]

})

definePageMeta({
     layout: 'panel'
})
</script>
