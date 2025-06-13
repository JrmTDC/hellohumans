<template>
     <div
          class="relative inline-block flex"
          @mouseenter="show = true"
          @mouseleave="show = false"
          ref="wrapper"
     >
          <slot></slot>
          <div
               v-if="show && variant === 'blue'"
               class="tooltip-container pointer-events-none absolute z-[9999]"
               :class="props.class"
               :style="tooltipStyle"
          >
               <div class="bg-[#0566ff] text-white rounded-[4px] shadow-[0_8px_20px_rgba(0,27,71,0.24)] break-words text-center text-[14px] leading-[18px] max-w-[350px] transition duration-[60ms] whitespace-normal outline-0 transition-[transform,visibility,opacity] w-max" :class="[
                    placement === 'top' ? 'mb-[10px]' :
                    placement === 'bottom' ? 'mt-[10px]' :
                    placement === 'left' ? 'mr-[10px]' :
                    placement === 'right' ? 'ml-[10px]' :
                    ''
               ]">
                    <div class="relative p-[5px_8px] z-[1] transition duration-[60ms]">
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em]">{{ props.uppercase ? text.toUpperCase() : text }}</p>
                    </div>
                    <div v-if="arrow" class="absolute" :style="arrowStyle">
                         <div class="">
                              <svgo-panel-icon-triangle-up class="w-[17px] h-[7px] fill-[#0566ff]" />
                         </div>
                    </div>
               </div>
          </div>
          <div v-if="show && variant === 'white'"
               class="tooltip-container pointer-events-none absolute z-[9999]"
               :class="props.class"
               :style="tooltipStyle"
          >
               <div class="bg-white rounded-[4px] shadow-[0_8px_20px_rgba(0,27,71,0.24)] text-[#080f1a] text-[14px] leading-[18px] break-words text-center max-w-[350px] duration-200"
               :class="[
                    placement === 'top' ? 'mb-[10px]' :
                    placement === 'bottom' ? 'mt-[10px]' :
                    placement === 'left' ? 'mr-[10px]' :
                    placement === 'right' ? 'ml-[10px]' :
                    ''
               ]">
                    <div class="px-[9px] py-[5px] relative z-[1] duration-200">
                         <p class="mt-0 mb-0 font-normal text-[14px] leading-[18px] tracking-[-0.01em]">{{ props.uppercase ? text.toUpperCase() : text }}</p>
                    </div>
                    <div v-if="arrow" class="absolute" :style="arrowStyle">
                         <div class="">
                              <svgo-panel-icon-triangle-up class="w-[17px] h-[7px] fill-[#ffff]" />
                         </div>
                    </div>
               </div>

          </div>
     </div>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
     text: { type: String, required: true },
     placement: { type: String, default: 'top' },
     variant: { type: String, default: 'blue' },
     arrow: { type: Boolean, default: false },
     offset: { type: Number, default: 1 },
     uppercase: { type: Boolean, default: false },
     class: { type: String, default: '' }
})

const show = ref(false)
const wrapper = ref<HTMLElement | null>(null)
const tooltipStyle = ref({})
const arrowStyle = ref({})

const updateTooltipPosition = () => {
     const el = wrapper.value
     if (!el) return

     const rect = el.getBoundingClientRect()
     let top = 0
     let left = 0

     switch (props.placement) {
          case 'right':
               top = rect.top + rect.height / 2
               left = rect.right + props.offset
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateY(-50%)',
                    position: 'fixed'
               }
               arrowStyle.value ={
                    top: '50%',
                    transform: 'translate3d(-2px,-50%, 0) rotate(-90deg) ',
                    left: '0',
                    transformOrigin: 'center center'
               }
               break
          case 'left':
               top = rect.top + rect.height / 2
               left = rect.left - props.offset
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translateY(-50%) translateX(-100%)',
                    position: 'fixed'
               }
               arrowStyle.value ={
                    top: '50%',
                    transform: 'translate3d(2px,-50%, 0) rotate(90deg) ',
                    right: '0',
                    transformOrigin: 'center center'
               }
               break
          case 'top':
               top = rect.top - props.offset
               left = rect.left + rect.width / 2
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translate(-50%, -100%)',
                    position: 'fixed'
               }
               arrowStyle.value ={
                    left: '50%',
                    transform: 'translate3d(-50%, -4px, 0) rotate(180deg)',
                    bottom: '0',
                    transformOrigin: 'center center'
               }
               break
          case 'bottom':
               top = rect.bottom + props.offset
               left = rect.left + rect.width / 2
               tooltipStyle.value = {
                    top: `${top}px`,
                    left: `${left}px`,
                    transform: 'translate(-50%, 0)',
                    position: 'fixed'
               }
               arrowStyle.value ={
                    left: '50%',
                    transform: 'translate3d(-50%, 4px, 0)',
                    top: '0'
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
