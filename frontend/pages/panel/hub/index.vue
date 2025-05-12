<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelHubChildSideMenu />

          <div data-radix-scroll-area-viewport class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%]">
                                   <div class="flex flex-col justify-start items-stretch">
                                        <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[34px] tracking-[-0.01em]">{{ t('panel.pages.hub.index.title') }}</h2>
                                   </div>
                                   <div class="mt-[20px] mb-0 flex flex-col justify-start items-start">
                                        <div class="mt-0 mb-0 flex flex-row justify-start items-center w-full">
                                             <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em] first:mr-auto">Performance</p>
                                             <button class="min-w-auto shadow-none bg-transparent text-[#acb8cb] cursor-not-allowed border border-transparent rounded-[8px] text-[14px] h-[34px] leading-[18px] px-[14px] py-0 inline-flex items-center justify-center group">
                                                  <SvgoPanelHubIconAnalytics class="h-[20px] w-[20px] fill-current ml-[-2px] mr-[6px]" />
                                                  <span class="group-hover:underline">Voir l'analytique complète</span>
                                             </button>
                                        </div>
                                        <div class="mt-[12px] mb-0 grid grid-cols-2 gap-[20px] w-full">
                                             <div class="flex flex-col justify-start items-start bg-white border border-[#e2e8ef] rounded-[12px] p-[20px]">
                                                  <div class="mt-0 mb-0 flex flex-row justify-start items-center">Conversations en direct</div>
                                                  <div class="mt-[20px] mb-0 grid grid-cols-3 w-full">
                                                       <div class="flex flex-col justify-start items-start">
                                                            <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#acb8cb]">Toutes les conversations</p>
                                                            <h2 class="mt-[8px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#acb8cb]">—</h2>
                                                       </div>
                                                  </div>
                                             </div>
                                             <div class="flex flex-col justify-start items-start bg-white border border-[#e2e8ef] rounded-[12px] p-[20px]">

                                             </div>
                                             <div class="flex flex-row justify-start items-center px-[16px] py-[8px] bg-white border border-[#e2e8ef] rounded-[12px]">
                                                  <div class="w-[28px] h-[28px] relative"></div>
                                                  <div class="w-full flex flex-row justify-between items-center ml-[16px] mr-auto">
                                                       <div class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em]">Limite de conversations :</div>
                                                       <div class="flex flex-row justify-start items-center ml-[8px]">
                                                            <p class="mt-0 mb-0 font-medium text-[14px] leading-[18px] tracking-[-0.01em]">0</p>
                                                            <p class="ml-0 mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#acb8cb]">/50</p>
                                                       </div>
                                                       <div></div>
                                                  </div>
                                             </div>
                                             <div class="flex flex-row justify-start items-center px-[16px] py-[8px] bg-white border border-[#e2e8ef] rounded-[12px]">

                                             </div>
                                        </div>
                                   </div>
                                   <div class="mt-[20px] mb-0 flex flex-col justify-start items-start">
                                        <div class="mt-0 mb-0 flex flex-row justify-start items-center w-full">
                                             <p class="mt-0 mb-0 font-medium text-[18px] leading-[23px] tracking-[-0.01em] first:mr-auto">Connaissances</p>
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

onMounted(async () => {
     layoutLoadingPanel.value = false
})

definePageMeta({
     layout: 'panel'
})
</script>
