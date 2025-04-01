<template>
     <div class="grid grid-cols-[232px_1fr] grid-rows-1 gap-0 h-full max-h-full overflow-hidden">
          <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
               <div class=" overflow-x-hidden w-full h-full">
                    <div class="min-w-full table min-h-full h-full">
                         <ul class="list-none p-[8px_12px] bg-[#f5f7f9] m-0 min-h-full h-full flex flex-col w-[232px]">
                              <li class="flex flex-col w-full relative text-[#354869] p-0 text-[14px] leading-[18px] tracking-[-0.01em] font-medium">
                                   <div class="rounded-[8px] relative">
                                        <button class="relative outline-none border-none rounded-[8px] flex items-center w-full text-left cursor-pointer bg-[#dce9ff] font-medium text-[#001433] p-[8px_12px] min-h-[36px]">
                                             <svgo-panel-icon-usage-menu  class="w-[16px] h-[16px] fill-[#001433] mr-[8px]"/>
                                             Vue d’ensemble
                                        </button>
                                   </div>
                              </li>
                         </ul>
                    </div>
               </div>
          </div>
          <div class="overflow-hidden">
               <div class="overflow-x-hidden w-full h-full">
                    <div class="min-h-full h-full">
                         <div class="min-h-full h-full pr-[12px]">
                              <div class="p-[24px_28px] border border-[#e2e8ef] bg-white rounded-[16px] min-h-[calc(100%-12px)] flex-[1_1_0%] h-[650px]">
                                   <div class="flex flex-col justify-start items-start h-full max-w-[1280px]">
                                        <div class="flex flex-col justify-start items-start max-w-[1280px] mt-0 mb-0">
                                             <h2 class="mt-0 mb-0 font-medium text-[24px] leading-[31px] tracking-[-0.01em]">Vue d’ensemble</h2>
                                        </div>
                                        <div class="relative flex items-center mt-[20px] mb-0">
                                             <DatePicker @update="onDateChange" />
                                        </div>
                                        <div class="rounded-[12px] border border-[rgb(226,232,239)] overflow-hidden mt-[20px] mb-0">
                                             <AnalyticsChart></AnalyticsChart>
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

import { useRouter } from 'vue-router'
import { onMounted } from 'vue'
import AnalyticsChart from '~/components/panel/analytics/AnalyticsChart.vue'
import DatePicker from "~/components/panel/DatePicker.vue";
const { t } = useI18n()


definePageMeta({
     layout: 'panel'
})

const router = useRouter()

// Exemple de données
const dateRange = ref({ start: '2025-02-23', end: '2025-03-23' })

function updateDateRange(range: any) {
     dateRange.value = range
}
onMounted(() => {
     const token = localStorage.getItem('token')
     if (!token) {
          router.push('/panel/login')
     }
     const pageTitle = useState('pageTitle')
     pageTitle.value = 'Analytique'

     const pageIsBilled = useState('pageIsBilled')
     pageIsBilled.value = true

     const pageIsPaid = useState('pageIsPaid')
     pageIsPaid.value = true
})
</script>

