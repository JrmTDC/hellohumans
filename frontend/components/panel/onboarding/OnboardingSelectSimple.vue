<template>
     <div ref="dropdownRef" class="relative inline-block w-full">
          <!-- Affichage du "sélecteur" -->
          <div class="flex items-center justify-between border-2 rounded-[8px] px-3 py-2 cursor-pointer" :class="isOpen ? 'border-[#3886ff]' : ''" @click="toggleOpen">
               <span class="text-[#080f1a] truncate">{{ displayLabel }}</span>
               <svgo-panel-icon-triangle-caret-down class="w-[24px] h-[24px] fill-[#080f1a]" :class="{ 'rotate-180': isOpen }" />
          </div>
          <!-- Liste déroulante -->
          <div v-if="isOpen" class="absolute left-0 right-0 mt-1 z-10 shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px]">
               <div class="px-[8px] scrollbar-none overflow-scroll scrollbar-none overflow-y-scroll overflow-x-hidden w-full h-full">
                    <div class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></div>
                    <ul class="max-h-[200px] list-none outline-none p-0 m-0">
                         <li v-for="(option, i) in options" :key="i" class="px-[8px] py-[9px] rounded-[4px] text-[#080f1a] cursor-pointer bg-white overflow-hidden text-ellipsis whitespace-nowrap flex gap-[8px] items-center text-[14px] leading-[18px] tracking-[-0.01em] hover:bg-[#dce9ff]" @click="selectOption(option)">{{ option.name }}</li>
                    </ul>
                    <div class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const dropdownRef = ref<HTMLElement | null>(null)
let skipNextClick = true
interface SelectOption {
     value: string
     label: string
}

const props = defineProps<{
     modelValue: string | null
     options: SelectOption[]
     placeholder?: string
}>()

const emit = defineEmits<{
     (e: 'update:modelValue', value: string | null): void
}>()

const isOpen = ref(false)

function toggleOpen() {
     isOpen.value = !isOpen.value
}

function selectOption(option: SelectOption) {
     emit('update:modelValue', option.value)
     isOpen.value = false
}

const displayLabel = computed(() => {
     const found = props.options.find((o) => o.value === props.modelValue)
     return found ? found.name : props.placeholder
})

const handleClickOutside = (event: MouseEvent) => {
     if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
          isOpen.value = false
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
</script>
