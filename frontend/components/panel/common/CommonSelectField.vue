<template>
     <div class="flex flex-col gap-[12px] justify-start items-start" :class="['xl:flex-row']">
          <!-- Label + helperText -->
          <div v-if="label || helperText" class="pt-0 flex-[0_0_100%] min-w-[145px] max-w-full xl:pt-[8px] xl:flex-[1_0_175px] xl:max-w-[min(180px,12vw)] text-[14px]">
               <label class="inline-block font-normal">
                    <div class="flex flex-col justify-start items-[normal]">
                         <p class="font-normal text-[14px] leading-[18px] tracking-[-0.01em]">
                              {{ label }}
                              <span v-if="required" class="text-red-500">*</span>
                         </p>
                         <p v-if="helperText" class="mt-[4px] font-normal text-[12px] leading-[16px] tracking-[-0.01em] text-[rgb(100,116,145)]">{{ helperText }}</p>
                    </div>
               </label>
          </div>

          <!-- Select -->
          <div class="w-full relative group" ref="selectContainer">
               <div
                    class="flex justify-between items-center h-[34px] text-[14px] leading-[18px] tracking-[-0.01em] rounded-[8px] outline-none px-[14px] py-[6px] pr-[7px] min-w-0 bg-white cursor-pointer border-2 focus:border-[#0566ff] transition-colors"
                    @click="toggleDropdown"
                    :class="isOpen ? 'border-[#0566ff]' : 'border-[rgb(211,219,229)] hover:border-[rgb(172,184,203)]'"
               >
                    <div class="overflow-hidden text-ellipsis whitespace-nowrap">
                         {{ selectedOption?.label || placeholder }}
                    </div>
                    <div class="flex items-center">
                         <SvgoPanelHubIconArrowSelect
                              class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(8,15,26)] transition-transform duration-200"
                              :class="{ 'rotate-180': isOpen }"
                         />
                    </div>
               </div>

               <!-- Dropdown -->
               <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
               >
                    <div
                         v-if="isOpen"
                         class="absolute z-50 min-w-full mt-1 bg-white rounded-[8px] shadow-lg max-h-[280px] overflow-auto"
                         :class="dropdownClass"
                         :style="{ width: selectWidth + 'px' }"
                    >
                         <ul class="p-[8px]">
                              <li
                                   v-for="(option, index) in options"
                                   :key="index"
                                   class="px-[8px] py-[9px] rounded-[4px] cursor-pointer hover:bg-[rgb(220,233,255)] transition-colors"
                                   :class="{ 'bg-[rgb(245,247,249)]': isOptionSelected(option) }"
                                   :data-selected="isOptionSelected(option) ? true : null"
                                   @click.stop="selectOption(option)"
                              >
                                   <slot name="option" :option="option">
                                        <div class="flex flex-col">
                                             <span class="text-[14px] leading-[18px]">{{ option.label }}</span>
                                             <span v-if="option.description" class="text-[12px] text-[rgb(100,116,145)] mt-1">{{ option.description }}</span>
                                        </div>
                                   </slot>
                              </li>
                         </ul>
                    </div>
               </Transition>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
     modelValue: [String, Number, Object],
     options: { type: Array, required: true, default: () => [] },
     placeholder: { type: String, default: 'Sélectionnez une option' },
     dropdownClass: { type: String, default: '' },
     optionKey: { type: String, default: 'value' },
     optionLabel: { type: String, default: 'label' },
     optionDescription: { type: String, default: 'description' },

     // Ajoutés pour label & helper
     label: { type: String, default: '' },
     helperText: { type: String, default: '' },
     required: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const selectContainer = ref(null)
const selectWidth = ref(0)

const selectedOption = ref(
     props.options.find(option => option[props.optionKey] === props.modelValue) || null
)

const isOptionSelected = (option) =>
     selectedOption.value && selectedOption.value[props.optionKey] === option[props.optionKey]

const toggleDropdown = () => (isOpen.value = !isOpen.value)

const selectOption = (option) => {
     selectedOption.value = option
     emit('update:modelValue', option[props.optionKey])
     emit('change', option)
     isOpen.value = false
}

const handleClickOutside = (e) => {
     if (selectContainer.value && !selectContainer.value.contains(e.target)) isOpen.value = false
}
const handleEscape = (e) => {
     if (e.key === 'Escape') isOpen.value = false
}
const updateSelectWidth = () => {
     if (selectContainer.value) selectWidth.value = selectContainer.value.offsetWidth
}

onMounted(() => {
     document.addEventListener('click', handleClickOutside)
     document.addEventListener('keydown', handleEscape)
     window.addEventListener('resize', updateSelectWidth)
     updateSelectWidth()
})
onBeforeUnmount(() => {
     document.removeEventListener('click', handleClickOutside)
     document.removeEventListener('keydown', handleEscape)
     window.removeEventListener('resize', updateSelectWidth)
})

watch(() => props.modelValue, (newValue) => {
     selectedOption.value = props.options.find(option => option[props.optionKey] === newValue) || null
})
watch(isOpen, async (open) => {
     if (open) {
          await nextTick()

          const dropdownEl = selectContainer.value?.querySelector('div.absolute')
          if (!dropdownEl) return

          const activeOption: HTMLElement | null = dropdownEl.querySelector('[data-selected="true"]')
          if (activeOption) {
               // on centre l’élément actif au milieu du conteneur
               activeOption.scrollIntoView({ block: 'center' })
               // si tu veux aussi le focus clavier sans scroll supplémentaire :
               activeOption.focus({ preventScroll: true })
          }
     }
})
</script>
