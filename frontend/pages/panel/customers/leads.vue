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
                                                            <button class="inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] px-[14px] min-w-auto">
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
                                                       <p class="mt-0 mb-0 mr-auto font-medium text-[16px] leading-[20px] tracking-[-0.01em]">Résultats : 0</p>
                                                       <div></div>
                                                  </div>
                                                  <div class="ml-[32px] flex">
                                                       <button class="bg-[rgba(136,148,171,0)] border border-[#d1d9e0] text-[#333] inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap">
                                                            <SvgoPanelCustomersIconImport class="fill-[rgb(135,150,175)] ml-[-2px] mr-[6px] w-[20px] h-[20px] min-w-[20px] min-h-[20px]"/>
                                                            <span>Importer à partir d’un fichier</span>
                                                       </button>
                                                       <div class="inline-flex relative align-top ml-[10px]">
                                                            <button class="bg-[rgba(136,148,171,0)] border border-[#d1d9e0] text-[#333] inline-flex items-center justify-center rounded-[8px] text-[14px] h-[34px] leading-[18px] min-w-[64px] px-[14px] py-0 select-none align-middle whitespace-nowrap">
                                                                 <SvgoPanelCustomersIconCustomize class="fill-[rgb(135,150,175)] ml-[-2px] mr-[6px] w-[20px] h-[20px] min-w-[20px] min-h-[20px]"/>
                                                                 <span>Personnaliser</span>
                                                            </button>
                                                       </div>

                                                  </div>
                                             </div>
                                             <div class="overflow-x-auto">
                                                  <table class="border-collapse mb-[6px] max-w-full w-full">
                                                       <thead>
                                                            <tr class="border-b border-b-[#eff2f6]">
                                                                 <th class="flex items-center sticky left-0 min-w-[62px] pl-[22px] w-[1%] z-[1] bg-transparent !bg-transparent bg-[linear-gradient(90deg,#fff_90%,hsla(0,0%,100%,0))] px-[16px] py-[12px]">
                                                                      <label class="flex cursor-pointer relative">
                                                                           <input type="text" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0">
                                                                           <div class="flex flex-row justify-start items-center">
                                                                                <div class="flex items-start justify-start rounded-[5px]">
                                                                                     <SvgoPanelCustomersIconCheckOff class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] self-baseline fill-[rgb(100,116,145)] hover:fill-[#0049bd]" />
                                                                                </div>
                                                                           </div>
                                                                      </label>
                                                                 </th>

                                                                 <th class="min-w-[100px] whitespace-nowrap text-[#647491] font-normal text-left leading-[1.28571429] min-w-[55px] px-[16px] py-[8px] align-middle text-[14px]"><span>Radar</span></th>
                                                                 <th class="min-w-[100px] whitespace-nowrap text-[#647491] font-normal text-left leading-[1.28571429] min-w-[55px] px-[16px] py-[8px] align-middle text-[14px]"><span>Email</span></th>
                                                                 <th class="min-w-[100px] whitespace-nowrap text-[#647491] font-normal text-left leading-[1.28571429] min-w-[55px] px-[16px] py-[8px] align-middle text-[14px]"><span>Activité récente</span></th>
                                                                 <th class="min-w-[100px] whitespace-nowrap text-[#647491] font-normal text-left leading-[1.28571429] min-w-[55px] px-[16px] py-[8px] align-middle text-[14px]"><span>Pays</span></th>
                                                            </tr>
                                                       </thead>
                                                       <tbody>
                                                       <tr class="border-b border-b-[#eff2f6]">
                                                            <td class="flex items-center sticky left-0 min-w-[62px] pl-[22px] w-[1%] z-[1] bg-transparent !bg-transparent bg-[linear-gradient(90deg,#fff_90%,hsla(0,0%,100%,0))] h-[56px] px-[16px] py-[8px]">
                                                                 <label class="flex cursor-pointer relative">
                                                                      <input type="text" class="absolute w-[1px] h-[1px] m-[-1px] p-0 overflow-hidden clip-[rect(0px,0px,0px,0px)] border-0">
                                                                      <div class="flex flex-row justify-start items-center">
                                                                           <div class="flex items-start justify-start rounded-[5px]">
                                                                                <SvgoPanelCustomersIconCheckOff class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] self-baseline fill-[rgb(100,116,145)] hover:fill-[#0049bd]" />
                                                                           </div>
                                                                      </div>
                                                                 </label>
                                                            </td>
                                                            <td>
                                                                 <div class="bg-[rgb(203,216,82)] rounded-full text-white cursor-default flex-shrink-0 float-left text-[18px] h-[30px] leading-[1.66] mr-[10px] text-center select-none w-[30px]">87</div>
                                                            </td>
                                                            <td>
                                                                 <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap">jrm@tiensdonc.com</p>
                                                            </td>
                                                            <td>
                                                                 <button type="button" class="bg-transparent border-0 inline-flex shadow-none outline-none px-[4px] py-0 items-center justify-center cursor-pointer rounded-[4px] text-current w-[28px] h-[28px] hover:bg-[rgb(220,233,255)]">
                                                                      <SvgoPanelCustomersIconChat class="min-w-[20px] min-h-[20px] w-[20px] h-[20px] fill-[rgb(100,116,145)]" />
                                                                 </button>
                                                            </td>
                                                            <td>
                                                                 <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden text-ellipsis whitespace-nowrap">(FR) France</p>
                                                            </td>
                                                       </tr>
                                                       </tbody>
                                                  </table>
                                             </div>
                                             <div class="text-[22px] pt-[170px] pb-[115px] text-center bg-[position:50%_55px] bg-no-repeat bg-[length:80px_80px]" :style="{ backgroundImage: `url('${backgroundNoCustomer}')` }">Désolé, aucun contact n’a été identifié</div>
                                             <div class="mt-[10px] mb-[25px] mx-auto"></div>
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

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})
</script>
