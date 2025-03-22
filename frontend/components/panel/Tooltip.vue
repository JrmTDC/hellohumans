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
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
     text: { type: String, required: true },
     placement: { type: String, default: 'right' },
     offset: { type: Number, default: 1 }
})

const show = ref(false)
const wrapper = ref<HTMLElement | null>(null)
const tooltipStyle = ref({})

const updateTooltipPosition = () => {
     const el = wrapper.value
     if (!el) return

     const rect = el.getBoundingClientRect()
     let top = 0
     let left = 0
     let topAjust = 4
     let leftAjust = 0

     switch (props.placement) {
          case 'right':
               top = topAjust + rect.top + rect.height / 2
               left = leftAjust + rect.right + props.offset
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateY(-50%)',
                    position: 'fixed'
               }
               break
          case 'left':
               top = topAjust + rect.top + rect.height / 2
               left = leftAjust + rect.left - props.offset
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateY(-50%) translateX(-100%)',
                    position: 'fixed'
               }
               break
          case 'top':
               top = topAjust + rect.top - props.offset
               left = leftAjust + rect.left + rect.width / 2
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translate(-50%, -100%)',
                    position: 'fixed'
               }
               break
          case 'bottom':
               top = topAjust + rect.bottom + props.offset
               left = leftAjust + rect.left + rect.width / 2
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translate(-50%, 0)',
                    position: 'fixed'
               }
               break
     }
}

onMounted(() => {
     nextTick(() => {
          updateTooltipPosition()
     })
})

watch(show, (newVal) => {
     if (newVal) {
          nextTick(() => {
               updateTooltipPosition()
          })
     }
})
</script>
