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
                         <PanelCommonTooltip :text="legend.tooltip" />
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
          <VChart :option="chartOption" autoresize class="h-[324px] mt-6" />
     </div>
</template>

<script setup lang="ts">
/* --------------------------------------------------------------- */
/* Types auto-générés :  ECOption                                  */
/* --------------------------------------------------------------- */
const activeTab = ref<'audience' | 'interactions'>('audience')
const chartType = ref<'bar' | 'line'>('bar')

const tabs = [
     { key: 'audience',     label: 'Audience' },
     { key: 'interactions', label: 'Interactions' },
]

const currentLegends = computed(() =>
     activeTab.value === 'audience'
          ? [
               {
                    label: 'Visiteurs atteints',
                    color: '#4caf50',
                    tooltip: 'Nombre total de visiteurs ayant accédé au chatbot.',
               },
               {
                    label: 'Visiteurs uniques',
                    color: '#ff9800',
                    tooltip: 'Utilisateurs distincts ayant interagi avec le bot.',
               },
          ]
          : [
               {
                    label: 'Conversations traitées',
                    color: '#2196f3',
                    tooltip: 'Conversations complètes avec au moins une réponse.',
               },
               {
                    label: 'Visiteurs uniques',
                    color: '#ff9800',
                    tooltip: 'Utilisateurs distincts ayant échangé avec le bot.',
               },
          ],
)

/* ------------------------------------------------------------------ */
/*  Données factices → remplace par ton fetch API                      */
/* ------------------------------------------------------------------ */
const rawData = {
     audience:     { reached: [120, 200, 150,  80], uniques: [ 90, 160, 110, 60] },
     interactions: { handled: [240, 180, 220, 160], uniques: [150, 120, 180, 100] },
}

/* ------------------------------------------------------------------ */
/*  Option ECharts (typée !)                                           */
/* ------------------------------------------------------------------ */
const chartOption = computed<ECOption>(() => {
     const legends = currentLegends.value
     const [serieA, serieB] =
          activeTab.value === 'audience' ? ['reached', 'uniques'] : ['handled', 'uniques']

     return {
          tooltip:   { trigger: 'axis' },
          //legend:    { data: legends.map((l) => l.label) },
          grid:      { left: '3%', right: '4%', bottom: '3%', containLabel: true },
          xAxis:     { type: 'category', data: ['S1', 'S2', 'S3', 'S4'] },
          yAxis:     { type: 'value' },
          series: [
               {
                    name: legends[0].label,
                    type: chartType.value,
                    data: rawData[activeTab.value][serieA],
                    itemStyle: { color: legends[0].color },
                    smooth: chartType.value === 'line',
               },
               {
                    name: legends[1].label,
                    type: chartType.value,
                    data: rawData[activeTab.value][serieB],
                    itemStyle: { color: legends[1].color },
                    smooth: chartType.value === 'line',
               },
          ],
     }
})
</script>
