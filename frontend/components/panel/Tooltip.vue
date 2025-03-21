<template>
     <div
          class="relative inline-block"
          @mouseenter="show = true"
          @mouseleave="show = false"
          ref="wrapper"
     >
          <slot></slot>
          <div
               v-if="show"
               class="tooltip-container pointer-events-none absolute z-[9999]"
               :style="tooltipStyle"
          >
               <div class="bg-[#0566ff] text-white rounded-[4px] shadow-[0_8px_20px_rgba(0,27,71,0.24)] mb-[10px] break-words text-center text-[14px] leading-[18px] max-w-[350px] transition duration-[60ms] whitespace-normal outline-0 transition-[transform,visibility,opacity] relative w-max">
                    <div class="relative p-[5px_8px] z-[1] transition duration-[60ms]">
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em]">{{ text }}</p>
                    </div>
               </div>
          </div>
     </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'

const props = defineProps({
     text: { type: String, required: true },
     placement: { type: String, default: 'right' }, // right, left, top, bottom
     offset: { type: Number, default: 10 }
})

const show = ref(false)
const wrapper = ref(null)
const tooltipStyle = ref({})

const updateTooltipPosition = () => {
     const el = wrapper.value
     if (!el) return

     const rect = el.getBoundingClientRect()
     let top = 0
     let left = 0

     switch (props.placement) {
          case 'right':
               top = rect.height / 2
               left = rect.width + props.offset
               break
          case 'left':
               top = rect.height / 2
               left = -props.offset
               break
          case 'top':
               top = -props.offset
               left = rect.width / 2
               break
          case 'bottom':
               top = rect.height + props.offset
               left = rect.width / 2
               break
     }

     tooltipStyle.value = {
          top: `${top}px`,
          left: `${left}px`,
          transform: 'translateY(-50%)'
     }
}

onMounted(() => {
     nextTick(() => {
          updateTooltipPosition()
     })
})
</script>
