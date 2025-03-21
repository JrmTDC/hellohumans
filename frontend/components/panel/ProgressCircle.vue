<template>
     <div class="relative" :style="{ width: `${sizeCircle}px`, height: `${sizeCircle}px` }">
          <svg :width="sizeCircle" :height="sizeCircle" viewBox="0 0 32 32" class="w-full h-full rotate-[-90deg]">
               <!-- Cercle de fond -->
               <circle
                    cx="16"
                    cy="16"
                    :r="radius"
                    :stroke="bgColor"
                    :stroke-width="strokeWidth"
                    fill="none"
               />
               <!-- Cercle de progression -->
               <circle
                    cx="16"
                    cy="16"
                    :r="radius"
                    :stroke="progressColor"
                    :stroke-width="strokeWidth"
                    stroke-linecap="round"
                    :stroke-dasharray="circumference"
                    :stroke-dashoffset="dashOffset"
                    fill="none"
                    style="transition: stroke-dashoffset 0.4s ease"
               />
          </svg>

          <!-- Contenu central -->
          <div class="absolute inset-0 flex items-center justify-center font-medium" :style="{ color: progressColor, fontSize: `${sizeFont}px` }">
               <template v-if="centerContent === 'percentage'">
                    {{ animatedPercentage }}
               </template>
               <template v-if="centerContent === 'number'">
                    {{ numberContent }}
               </template>
               <template v-else-if="centerContent === 'infinity'">
                    <svgo-panel-icon-infinity class="w-[16px] h-[16px]" :style="{ fill: progressColor }" />
               </template>
          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'

const props = defineProps({
     percentage: {
          type: Number,
          required: true,
          validator: (val) => val >= 0 && val <= 100,
     },
     progressColor: {
          type: String,
          default: '#0566ff'
     },
     bgColor: {
          type: String,
          default: '#e5e7eb'
     },
     centerContent: {
          type: String,
          default: 'none',
          validator: (val) => ['percentage', 'number', 'infinity', 'none'].includes(val)
     },
     numberContent: {
          type: Number,
          default: 0
     },
     sizeCircle: {
          type: Number,
          default: 32
     },
     sizeFont: {
          type: Number,
          default: 12
     }
})

const radius = 13
const strokeWidth = 3
const circumference = 2 * Math.PI * radius

const animatedPercentage = ref(0)
const dashOffset = computed(() =>
     circumference * (1 - animatedPercentage.value / 100)
)

const animateProgress = () => {
     const duration = 800
     const start = performance.now()

     const step = (timestamp) => {
          const progress = Math.min((timestamp - start) / duration, 1)
          animatedPercentage.value = Math.floor(progress * props.percentage)
          if (progress < 1) {
               requestAnimationFrame(step)
          }
     }

     requestAnimationFrame(step)
}

onMounted(() => {
     animateProgress()
})

watch(() => props.percentage, () => {
     animateProgress()
})
</script>
