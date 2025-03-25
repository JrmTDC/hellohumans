<template>
     <div class="bg-white rounded-xl shadow p-6 w-full">
          <!-- Onglets -->
          <div class="flex gap-4 mb-6">
               <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    :class="[
          'px-4 py-2 rounded text-sm font-medium',
          currentTab === tab.key ? 'bg-[#0566ff] text-white' : 'bg-gray-100 text-gray-700'
        ]"
                    @click="currentTab = tab.key"
               >
                    {{ tab.label }}
               </button>
          </div>

          <!-- Légende -->
          <div class="flex gap-6 items-center mb-4">
               <div
                    v-for="legend in currentLegends"
                    :key="legend.label"
                    class="flex items-center gap-2"
               >
                    <span :style="{ backgroundColor: legend.color }" class="w-3 h-3 rounded-full inline-block"></span>
                    <span class="text-sm text-gray-700">{{ legend.label }}</span>
                    <Tooltip :text="legend.tooltip" />
               </div>

               <!-- Boutons de type de graphique (exemple) -->
               <div class="ml-auto flex gap-2">
                    <button @click="chartType = 'bar'">📊</button>
                    <button @click="chartType = 'line'">📈</button>
               </div>
          </div>

          <!-- Sélecteur de dates -->
          <div class="mb-4">
               <DateRangePicker @update:range="updateRange" />
          </div>

          <!-- Graphique -->
          <EChart :option="chartOptions" autoresize class="h-[300px]" />
     </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

import Tooltip from '@/components/ui/Tooltip.vue'
import DateRangePicker from '@/components/ui/DateRangePicker.vue'

use([TooltipComponent, CanvasRenderer])

const tabs = [
     { key: 'audience', label: 'Audience' },
     { key: 'interactions', label: 'Interactions' }
]

const currentTab = ref('audience')
const chartType = ref<'line' | 'bar'>('line')
const dateRange = ref({ start: '', end: '' })

const updateRange = (range: { start: string; end: string }) => {
     dateRange.value = range
     // todo: fetch API data here
}

const currentLegends = computed(() => {
     if (currentTab.value === 'audience') {
          return [
               { label: 'Visiteurs atteints', color: '#3b82f6', tooltip: 'Total des visiteurs qui ont interagi avec le chatbot.' },
               { label: 'Visiteurs uniques', color: '#10b981', tooltip: 'Visiteurs uniques sur la période sélectionnée.' }
          ]
     } else {
          return [
               { label: 'Conversations traitées', color: '#f59e0b', tooltip: 'Nombre total de conversations traitées.' },
               { label: 'Visiteurs uniques', color: '#10b981', tooltip: 'Visiteurs uniques sur la période sélectionnée.' }
          ]
     }
})

const chartOptions = computed(() => ({
     tooltip: { trigger: 'axis' },
     legend: { data: currentLegends.value.map(l => l.label) },
     xAxis: {
          type: 'category',
          data: ['Jour 1', 'Jour 2', 'Jour 3'] // à remplacer par des données API
     },
     yAxis: { type: 'value' },
     series: currentLegends.value.map((legend, i) => ({
          name: legend.label,
          type: chartType.value,
          data: [120, 200, 150], // à remplacer aussi
          itemStyle: { color: legend.color }
     }))
}))
</script>
