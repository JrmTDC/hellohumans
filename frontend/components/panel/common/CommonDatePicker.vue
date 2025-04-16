<template>
     <div class="relative inline-block">

          <div class="relative flex items-center ml-0" @click="toggle" ref="button">
               <div class="flex items-center w-[245px] h-[28px] rounded-[12px] bg-[rgba(100,116,145,0.08)] transition-[border-color] duration-[300ms] border-2 border-transparent px-[8px] cursor-pointer">
                    <div class="flex-[1_1_0%] items-center flex overflow-hidden">
                         <svgo-panel-icon-calandar class="w-[16px] h-[16px] mr-[5px] fill-[#647491]"/>
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em] overflow-hidden whitespace-nowrap">
                              {{ formattedRange }}
                         </p>
                    </div>
                    <div class="flex items-center justify-center">
                         <svgo-panel-icon-triangle-caret-down class="rotate-0 transition-transform duration-[300ms] w-[24px] h-[24px] fill-[rgb(100,116,145)]"/>
                    </div>
               </div>
          </div>

          <!-- Dropdown -->
          <div
               v-if="open"
               ref="box"
               class="rounded-[8px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] flex w-[770px] bg-white absolute left-0 top-[38px] z-[11] min-height-[460px]"
          >
               <div class="w-full">
                    <div class="flex items-center p-[10px] bg-[#f5f7f9] rounded-[4px] m-[12px] relative">
                         <p class="flex justify-center m-0 flex-[1_1_0%] text-[14px] leading-[18px] tracking-[-0.01em]">{{ formatDate(start) }}</p>
                         <svgo-panel-icon-arrow-to class="absolute left-0 right-0 m-auto fill-[#8796af] w-[24px] h-[24px]" />
                         <p class="flex justify-center m-0 flex-[1_1_0%] text-[14px] leading-[18px] tracking-[-0.01em]">{{ formatDate(end) }}</p>
                    </div>
                    <div class="dayPicker text-[#101a2c] cursor-default inline-block text-[14px] w-full">
                         <div class="DayPicker-wrapper flex-row outline-none pb-[24px] relative select-none">
                              <div class="DayPicker-NavBar"></div>
                              <div class="DayPicker-Months flex flex-wrap justify-center w-full">

                                   <VueDatePicker
                                        v-model="range"
                                        @update:model-value="onRangeSelect"
                                        :internal-model-value="internalModel"
                                        range
                                        multiCalendars
                                        format="yyyy-MM-dd"
                                        locale="fr"
                                        input-class="hidden"
                                        :inline="true"
                                        :close-on-auto-apply="false"
                                        :enable-time-picker="false"
                                        calendar-class="custom-calendar"
                                        :action-row="{ showSelect: false, showCancel: false, showNow: false }"
                                        :teleport="false"
                                        :hide-offset-dates="true"
                                        :auto-apply="true"
                                        :month-picker="false"
                                        :year-picker="false"
                                   />

                                   <div class="DayPicker-Month table border-collapse border-spacing-0 mt-[24px] mx-[15px] select-none" role="grid">


                                   </div>
                                   <div class="DayPicker-Month table border-collapse border-spacing-0 mt-[24px] mx-[15px] select-none" role="grid">

                                   </div>
                              </div>
                         </div>

                    </div>
               </div>
               <div class="flex-[1_1_0%] flex flex-col justify-between items-center border-l border-[#eff2f6] p-[10px_10px_10px_24px] min-w-[200px]">
                    <ul class="list-none m-0 p-0 w-full">
                         <li v-for="preset in presets" :key="preset.label" @click="selectPreset(preset.range)">
                              <button class="p-[8px_10px] w-full border-none bg-transparent text-left outline-none cursor-pointer rounded-[4px] hover:bg-[#eff2f6] text-[14px]">
                                   {{ preset.label }}
                              </button>
                         </li>
                    </ul>
                    <div class="w-full flex flex-col">
                         <button @click="apply" class="rounded-[8px] text-[16px] h-[38px] leading-[20px] min-w-[80px] px-[16px] bg-[#0566ff] border-[#0566ff] text-white items-center inline-flex justify-center shadow-none hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">{{ t('panel.components.common.dataPicker.apply') }}</button>
                         <button @click="open = false" class="bg-[rgba(136, 148, 171, 0)] border border-[#d1d9e0] text-[#333] mt-[10px] ml-0 shadow-none rounded-[8px] text-[16px] h-[38px] leading-[20px] min-w-[80px] px-[16px] items-center inline-flex justify-center hover:bg-[#eff2f6] hover:border-[#acb8cb] hover:text-[#333]">{{ t('panel.components.common.dataPicker.cancel') }}</button>
                    </div>
               </div>

          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { format, subDays, startOfMonth } from 'date-fns'
import VueDatePicker from '@vuepic/vue-datepicker'

const { t } = useI18n()

const box = ref<HTMLElement | null>(null)

const emit = defineEmits(['update'])
const open = ref(false)
const start = ref(format(subDays(new Date(), 7), 'yyyy-MM-dd'))
const end = ref(format(new Date(), 'yyyy-MM-dd'))
const range = ref([start.value, end.value])
const button = ref<HTMLElement | null>(null)
const internalModel = ref([...range.value])

const toggle = async () => {
     await nextTick()
     internalModel.value = [...range.value]
     open.value = !open.value
}

const formattedRange = computed(() => {
     return `${format(new Date(start.value), 'd MMM yyyy')} - ${format(new Date(end.value), 'd MMM yyyy')}`
})
function formatDate(date: string | Date): string {
     return format(new Date(date), 'd MMM yyyy')
}

const presets = [
     {
          label: 'panel.components.common.dataPicker.today',
          range: {
               start: format(new Date(), 'yyyy-MM-dd'),
               end: format(new Date(), 'yyyy-MM-dd')
          }
     },
     {
          label: 'panel.components.common.dataPicker.yesterday',
          range: {
               start: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
               end: format(subDays(new Date(), 1), 'yyyy-MM-dd')
          }
     },
     {
          label: 'panel.components.common.dataPicker.lastWeek',
          range: {
               start: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
               end: format(new Date(), 'yyyy-MM-dd')
          }
     },
     {
          label: 'panel.components.common.dataPicker.thisMonth',
          range: {
               start: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
               end: format(new Date(), 'yyyy-MM-dd')
          }
     },
     {
          label: 'panel.components.common.dataPicker.last30Days',
          range: {
               start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
               end: format(new Date(), 'yyyy-MM-dd')
          }
     },
     {
          label: 'panel.components.common.dataPicker.last90Days',
          range: {
               start: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
               end: format(new Date(), 'yyyy-MM-dd')
          }
     }
]

function selectPreset(selected: { start: string, end: string }) {
     range.value = [selected.start, selected.end]
     start.value = range.value[0]
     internalModel.value = [...range.value]
}

function apply() {
     start.value = range.value[0]
     end.value = range.value[1]
     emit('update', { start: start.value, end: end.value })
     open.value = false
}

function onRangeSelect(newRange: [string, string]) {
     start.value = newRange[0]
     end.value = newRange[1]
}

let skipNextClick = false

function handleClickOutside(e: MouseEvent) {
     const target = e.target as Node
     if (
          box.value && !box.value.contains(target) &&
          button.value && !button.value.contains(target)
     ) {
          open.value = false
     }
}

onMounted(() => {
     skipNextClick = true
     setTimeout(() => {
          skipNextClick = false
     }, 100)

     document.addEventListener('click', (e) => {
          if (skipNextClick) return
          handleClickOutside(e)
     })
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})
</script>
