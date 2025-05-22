<template>
     <div class="relative text-left h-fit pointer-events-auto rounded-[8px]" ref="wrapper">
          <div
               @click="toggle"
               class="flex items-center justify-start h-[34px] text-[14px] leading-[18px] tracking-[-0.01em] rounded-[8px] outline-none px-[7px] py-[6px] pl-0 min-w-0 bg-white overflow-hidden cursor-pointer"
          >
               <slot name="label">
                    <div class="overflow-hidden text-ellipsis whitespace-nowrap pointer-events-none">
                         {{ items.find(i => i.value === modelValue)?.label || modelValue }}
                    </div>
                    <div class="flex flex-row justify-start items-center ml-auto">
                         <SvgoPanelSettingsIconArrowSelect
                              :class="['min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(8,15,26)] transition-transform', { 'rotate-180': open }]"
                         />
                    </div>
               </slot>
          </div>

          <div
               v-if="open"
               class="min-w-[318px] max-w-[256px] shadow-[0_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute top-[38px] z-[2] max-h-[280px] flex mt-0"
          >
               <ul class="list-none outline-none p-[8px] m-0 w-full">
                    <li
                         v-for="item in items"
                         :key="item.value"
                         @click="select(item.value)"
                         class="w-full px-[8px] py-[9px] rounded-[4px] text-[rgb(8,15,26)] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-[8px] text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[rgb(220,233,255)]"
                    >
                         {{ item.label }}
                    </li>
               </ul>
          </div>
     </div>
</template>
<script setup lang="ts">
interface Item {
     label: string
     value: string
}

const props = defineProps<{
     items: Item[]
     modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
const open = ref(false)
const wrapper = ref<HTMLElement | null>(null)

function toggle() {
     open.value = !open.value
}

function select(item: string) {
     emit('update:modelValue', item)
     open.value = false
}

// Fermer si clic à l'extérieur
onMounted(() => {
     const handleClick = (e: MouseEvent) => {
          if (wrapper.value && !wrapper.value.contains(e.target as Node)) {
               open.value = false
          }
     }
     document.addEventListener('click', handleClick)
     onUnmounted(() => document.removeEventListener('click', handleClick))
})
</script>
