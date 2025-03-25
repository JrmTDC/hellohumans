<template>

     <div class="bg-white p-6 rounded-xl shadow-sm w-full">
          <!-- Onglets -->
          <div class="flex gap-4 mb-6">
               <button
                    v-for="tab in tabs"
                    :key="tab.key"
                    @click="activeTab = tab.key"
                    :class="['px-4 py-2 rounded-full text-sm font-medium', activeTab === tab.key ? 'bg-[#0566ff] text-white' : 'bg-gray-100 text-gray-700']"
               >
                    {{ tab.label }}
               </button>
          </div>

          <!-- Légendes et actions -->
          <div class="flex justify-between items-center mb-4">
               <div class="flex gap-4 items-center">
                    <div
                         v-for="legend in currentLegends"
                         :key="legend.label"
                         class="flex items-center gap-2"
                    >
                         <div :style="{ backgroundColor: legend.color }" class="w-3 h-3 rounded-full"></div>
                         <span class="text-sm text-gray-700">{{ legend.label }}</span>
                         <Tooltip :text="legend.tooltip" />
                    </div>
               </div>
               <div class="flex gap-2">
                    <button @click="chartType = 'bar'" :class="chartType === 'bar' ? 'text-[#0566ff]' : 'text-gray-400'">
                         📊
                    </button>
                    <button @click="chartType = 'line'" :class="chartType === 'line' ? 'text-[#0566ff]' : 'text-gray-400'">
                         📈
                    </button>
               </div>
          </div>

          <!-- Graphique -->
          <EChart :option="chartOption" autoresize class="h-[400px] mt-6" />
     </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Tooltip from '@/components/panel/Tooltip.vue'

const activeTab = ref<'audience' | 'interactions'>('audience')
const chartType = ref<'bar' | 'line'>('bar')

const tabs = [
     { key: 'audience', label: 'Audience' },
     { key: 'interactions', label: 'Interactions' }
]

const currentLegends = computed(() => {
     if (activeTab.value === 'audience') {
          return [
               { label: 'Visiteurs atteints', color: '#4caf50', tooltip: 'Nombre total de visiteurs ayant accédé au chatbot.' },
               { label: 'Visiteurs uniques', color: '#ff9800', tooltip: 'Utilisateurs distincts ayant interagi avec le bot.' }
          ]
     } else {
          return [
               { label: 'Conversations traitées', color: '#2196f3', tooltip: 'Conversations complètes avec au moins une réponse.' },
               { label: 'Visiteurs uniques', color: '#ff9800', tooltip: 'Utilisateurs distincts ayant échangé avec le bot.' }
          ]
     }
})

// Graphique dynamique
const chartOption = computed(() => ({
     tooltip: { trigger: 'axis' },
     legend: {
          data: currentLegends.value.map(l => l.label)
     },
     xAxis: {
          type: 'category',
          data: ['S1', 'S2', 'S3', 'S4']
     },
     yAxis: {
          type: 'value'
     },
     series: currentLegends.value.map((legend, index) => ({
          name: legend.label,
          type: chartType.value,
          data: [120, 200, 150, 80].map(val => val - index * 30), // Exemple dynamique
          itemStyle: { color: legend.color }
     }))
}))
</script>
