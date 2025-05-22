<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <PanelAnalyticsChildSideMenu />
          <div data-radix-scroll-area-viewport class="overflow-hidden overflow-y-auto">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%] h-[650px]">
                                   <div class="flex flex-col justify-start items-start h-full max-w-[1280px]">
                                        <div class="flex flex-col justify-start items-start max-w-[1280px] mt-0 mb-0">
                                             <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[31px] tracking-[-0.01em]"> {{ t('panel.pages.analytics.title') }}</h2>
                                        </div>
                                        <div class="relative flex items-center mt-[20px] mb-0">
                                             <PanelCommonDatePicker />
                                        </div>
                                        <div class="rounded-[12px] border border-[rgb(226,232,239)] overflow-hidden mt-[20px] mb-0 w-full">
                                             <PanelAnalyticsChart></PanelAnalyticsChart>
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
