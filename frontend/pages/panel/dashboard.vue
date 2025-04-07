<template>
     <div class="dashboard-content flex-1 overflow-x-hidden overflow-y-auto relative">
          <div class="grid grid-cols-1 grid-rows-1 h-full max-h-full overflow-hidden ml-[24px] ">
               <div class="min-h-full h-full pr-[12px]">
                    <div class="border border-[rgb(226,232,239)] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%] p-0 flex">

                         <div class="grid grid-cols-[1fr_340px] grid-rows-1 flex-[1_1_0%]">
                              <div class="flex flex-col justify-start items-start p-[24px_20px_24px_28px] min-w-0">
                                   <div class="flex flex-row justify-start items-center border border-[rgb(226,232,239)] rounded-[12px] bg-[rgb(245,247,249)] p-[20px] mt-0 mb-0 w-full">
                                        <div class="w-[48px] h-[48px] relative">
                                             <ProgressCircle
                                                  :percentage="16"
                                                  progressColor="#34b857"
                                                  bgColor="#ccf1d5"
                                                  center-content="number"
                                                  number-content="1/6"
                                                  :sizeCircle=48
                                                  :sizeFont=13
                                             />
                                        </div>
                                        <div class="flex flex-col justify-start items-start mr-auto ml-[12px]">
                                             <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em]">{{ t('panel.pages.dashboard.setupTitle') }}</h2>
                                             <p class="mt-[4px] mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] text-[#647491]">{{ t('panel.pages.dashboard.setupText') }}</p>
                                        </div>
                                        <button class="rounded-[8px] text-[14px] h-[34px] leading-[18px] px-[14px] shadow-none ml-[12px] min-w-fit bg-[#dce9ff] border-[#dce9ff] text-[#0049bd] hover:bg-[#9ac1ff] hover:border-[#9ac1ff] hover:text-[#0049bd]">
                                             <span>{{ t('panel.pages.dashboard.setupCta') }}</span>
                                        </button>
                                   </div>
                                   <div class="flex flex-col justify-start items-start mt-[24px] mb-0 w-full">
                                        <div class="flex flex-row justify-start items-center w-full">
                                             <h2 class="mt-0 mb-0 mr-auto font-medium text-[18px] leading-[24px] tracking-[-0.01em]">{{ t('panel.pages.dashboard.performanceTitle') }}</h2>
                                             <div class="relative flex items-center ml-0">
                                                  <div class="flex items-center w-[245px] h-[28px] rounded-[12px] bg-[rgba(100,116,145,0.08)] transition-[border-color] duration-[300ms] border-2 border-transparent px-[8px] cursor-pointer">
                                                       <div class="flex-[1_1_0%] items-center flex overflow-hidden">
                                                            <svgo-panel-icon-calandar class="w-[16px] h-[16px] mr-[5px] fill-[#647491]"/>
                                                            <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden whitespace-nowrap">
                                                                 {{ t('panel.pages.dashboard.calendarRange') }}
                                                            </p>
                                                       </div>
                                                       <div class="flex items-center justify-center">
                                                            <svgo-panel-icon-triangle-caret-down class="rotate-0 transition-transform duration-[300ms] w-[24px] h-[24px] fill-[rgb(100,116,145)]"/>
                                                       </div>
                                                  </div>
                                             </div>

                                        </div>
                                   </div>
                              </div>
                              <div class="flex flex-col justify-start items-start border-l border-[rgb(226,232,239)] p-[24px_28px_24px_20px]">

                                   <div class="flex flex-col justify-start items-start mt-0 mb-0 w-full">
                                        <h2 class="mt-0 mb-0 font-medium text-[18px] leading-[24px] tracking-[-0.01em]">{{ t('panel.pages.dashboard.usageTitle') }}</h2>
                                        <usageItem
                                             v-for="(item, index) in usages"
                                             :key="item.id"
                                             :item="item"
                                             :class="index > 0 ? 'mt-[16px]' : ''"
                                        />
                                   </div>
                              </div>
                         </div>

                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { usePanelStore } from '~/stores/panelStore'
import { useUsageDefinitions } from '~/composables/useUsageDefinitions'
import usageItem from '~/components/panel/dashboard/usageItem.vue'
import ProgressCircle from '~/components/panel/ProgressCircle.vue'

const { t } = useI18n()
const panelStore = usePanelStore()

const pageTitle = useState('pageTitle', () => '')
const pageIsBilled = useState('pageIsBilled', () => false)
const pageIsPaid = useState('pageIsPaid', () => false)

const allUsages = useUsageDefinitions()
const usages = computed(() => allUsages.value.filter((u) => u.showInDashboard))

onMounted(async () => {
     pageTitle.value = t('panel.pages.dashboard.pageTitle')
     pageIsBilled.value = false
     pageIsPaid.value = false

     try {
         //await panelStore.fetchUsage()

     } catch (error) {
          console.error('Erreur de chargement des usages :', error)
     }
})

definePageMeta({
     layout: 'panel'
})
</script>
