<template>
     <div class="flex flex-col gap-[12px] justify-start items-start" :class="['xl:flex-row']">
          <!-- Label + helper -->
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

          <!-- Picker -->
          <div class="w-full relative group" ref="pickerContainer">
               <div
                    class="flex justify-between items-center h-[34px] text-[14px] leading-[18px] tracking-[-0.01em] rounded-[8px] outline-none px-[14px] py-[6px] pr-[7px] min-w-0 bg-white cursor-pointer border-2 focus:border-[#0566ff] transition-colors"
                    :class="isOpen ? 'border-[#0566ff]' : 'border-[rgb(211,219,229)] hover:border-[rgb(172,184,203)]'"
                    @click="togglePicker"
               >
                    <div class="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
                         <div class="w-5 h-5 rounded-full border shadow-sm" :style="{ background: selectedColor }" />
                         <span>{{ selectedTheme?.name || selectedColor }}</span>
                    </div>
                    <SvgoPanelHubIconArrowSelect class="min-w-[24px] min-h-[24px] w-[24px] h-[24px] fill-[rgb(8,15,26)] transition-transform duration-200" :class="{ 'rotate-180': isOpen }"/>
               </div>

               <!-- Dropdown -->
               <Transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
                    <div
                         v-if="isOpen"
                         class="absolute z-50 min-w-full mt-1 bg-white rounded-[8px] shadow-lg max-h-[340px] overflow-auto"
                         :style="{ width: pickerContainer?.offsetWidth + 'px' }"
                    >
                         <ul class="p-[8px]">
                              <!-- Couleur personnalisée -->
                              <li class="relative flex items-center cursor-pointer px-[8px] py-[9px] rounded hover:bg-[#dce9ff]" @click.stop="colorInput?.click()">
                                   <svgo-chat-icon-picker-color class="w-5 h-5 fill-[#647491] mr-3" />
                                   <span class="flex-1 text-sm text-left text-gray-700">Choisissez votre couleur</span>
                                   <input type="color" ref="colorInput" v-model="selectedCustomColor" class="absolute opacity-0 w-full h-full cursor-pointer"/>
                              </li>

                              <li v-if="selectedCustomColor" class="flex items-center cursor-pointer px-[8px] py-[9px] rounded hover:bg-[#dce9ff]" @click="applyCustomColor">
                                   <div class="w-5 h-5 rounded-full border shadow-sm mr-3" :style="{ background: selectedCustomColor }" />
                                   <span class="text-sm text-gray-700">{{ selectedCustomColor }}</span>
                              </li>

                              <li class="px-[8px] pt-4 pb-2 text-xs text-gray-500 font-medium">{{ title }}</li>

                              <!-- Couleurs prédéfinies -->
                              <li v-for="item in items" :key="item.name" class="flex items-center cursor-pointer px-[8px] py-[9px] rounded hover:bg-[#dce9ff]" @click="applyPreset(item)">
                                   <div class="w-5 h-5 rounded-full border shadow-sm mr-3" :style="{ background: item.color }" />
                                   <span class="text-sm text-gray-700">{{ item.name }}</span>
                              </li>
                         </ul>
                    </div>
               </Transition>
          </div>
     </div>
</template>

<script setup lang="ts">

const props = defineProps({
     modelValue: { type: String, default: '' },
     type: { type: String, default: '' },
     label: { type: String, default: '' },
     helperText: { type: String, default: '' },
     required: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'update:textColor', 'update:isCustomBackground'])

const isOpen = ref(false)
const selectedColor = ref(props.modelValue || '#0566ff')
const selectedTheme = ref<{ name: string; color: string; textColor?: string } | null>(null)
const selectedCustomColor = ref<string | null>(null)
const pickerContainer = ref<HTMLElement | null>(null)
const colorInput = ref<HTMLInputElement | null>(null)

const backgroundColors = ref([
     { name: 'Dégradé 1', color: 'linear-gradient(115deg,#2a27da,#00ccff)', textColor: '#fff' },
     { name: 'Dégradé 2', color: 'linear-gradient(115deg,#401dba,#825bf0)', textColor: '#fff' },
     { name: 'Dégradé 3', color: 'linear-gradient(115deg,#ff4e6f,#fb9168)', textColor: '#fff' },
     { name: 'Dégradé 4', color: 'linear-gradient(115deg,#ace0f9,#fff1eb)', textColor: '#2f5680' },
     { name: 'Dégradé 5', color: 'linear-gradient(115deg,#29323c,#485563)', textColor: '#fff' },
     { name: 'Dégradé 6', color: 'linear-gradient(115deg,#4facfe,#00f2fe)', textColor: '#fff' },
     { name: 'Dégradé 7', color: 'linear-gradient(115deg,#7c3ab7,#ff9aad)', textColor: '#fff' },
     { name: 'Dégradé 8', color: 'linear-gradient(115deg,#a18cd1,#fbc2eb)', textColor: '#42265a' },
     { name: 'Dégradé 9', color: 'linear-gradient(115deg,#ff9a9e,#fad0c4)', textColor: '#843437' },
     { name: 'Dégradé 10', color: 'linear-gradient(115deg,#ff5858,#f09819)', textColor: '#fff' },
     { name: 'Dégradé 11', color: 'linear-gradient(115deg,#fa709a,#febb40)', textColor: '#fff' },
     { name: 'Dégradé 12', color: 'linear-gradient(115deg,#fda085,#f6d365)', textColor: '#784438' },
     { name: 'Dégradé 13', color: 'linear-gradient(115deg,#daa475,#ffe0b9)', textColor: '#6b4b29' },
     { name: 'Dégradé 14', color: 'linear-gradient(115deg,#8a716d,#e8b794)', textColor: '#fff' },
     { name: 'Dégradé 15', color: 'linear-gradient(115deg,#abeed6,#fbed96)', textColor: '#387861' },
     { name: 'Dégradé 16', color: 'linear-gradient(115deg,#3aa560,#b7e66c)', textColor: '#fff' },
     { name: 'Dégradé 17', color: 'linear-gradient(115deg,#00c9ff,#92fe9d)', textColor: '#173e2b' },
     { name: 'Dégradé 18', color: 'linear-gradient(115deg,#13547a,#80d0c7)', textColor: '#fff' },
     { name: 'Dégradé 19', color: 'linear-gradient(115deg,#dfe9f3,#ffffff)', textColor: '#38425d' },
     { name: 'Dégradé 20', color: 'linear-gradient(115deg,#e9defa,#fbfcdb)', textColor: '#7d59a3' },
     { name: 'Dégradé 21', color: 'linear-gradient(115deg,#accbee,#e7f0fd)', textColor: '#485195' },
     { name: 'Dégradé 22', color: 'linear-gradient(115deg,#93a5cf,#e4efe9)', textColor: '#344973' },
     { name: 'Dégradé 23', color: 'linear-gradient(115deg,#09203f,#537895)', textColor: '#fff' },
     { name: 'Dégradé 24', color: 'linear-gradient(115deg,#000000,#434343)', textColor: '#fff' },
     { name: 'Dégradé 25', color: 'linear-gradient(115deg,#0a0e88,#00b1ce)', textColor: '#fff' },
     { name: 'Dégradé 26', color: 'linear-gradient(115deg,#19025c,#6e28bf)', textColor: '#fff' },
     { name: 'Dégradé 27', color: 'linear-gradient(115deg,#31003e,#c3286e)', textColor: '#fff' },
     { name: 'Dégradé 28', color: 'linear-gradient(115deg,#98033a,#f74f28)', textColor: '#fff' },
     { name: 'Dégradé 29', color: 'linear-gradient(115deg,#047c8d,#2ff289)', textColor: '#fff' }
])
const textColors = ref([
     { name: 'Noir', color: '#000000' },
     { name: 'Blanc', color: '#FFFFFF' }
])
const actionColors = ref([
     { name: 'Bleu', color: '#0566ff' },
     { name: 'Violet', color: '#613cd5' },
     { name: 'Cyan', color: '#25baef' },
     { name: 'Rouge', color: '#ff4858' },
     { name: 'Rose', color: '#e65882' },
     { name: 'Vert', color: '#3ec53e' },
     { name: 'Marron', color: '#5b5548' },
     { name: 'Bordeaux', color: '#53031b' },
     { name: 'Indigo', color: '#030353' },
     { name: 'Noir', color: '#000000' }
])
const items = computed(() => {
     if (props.type === 'backgroundColors') return backgroundColors.value
     if (props.type === 'textColors') return textColors.value
     return actionColors.value
})
const title = computed(() => (props.type === 'backgroundColors' ? 'Thèmes :' : 'Couleurs prédéfinies :'))

function togglePicker() { isOpen.value = !isOpen.value }

function applyPreset(item: any) {
     selectedColor.value = item.color
     selectedTheme.value = item
     selectedCustomColor.value = null
     emit('update:modelValue', item.color)
     if (item.textColor) emit('update:textColor', item.textColor)
     emit('update:isCustomBackground', props.type === 'backgroundColors')
     isOpen.value = false
}

function applyCustomColor() {
     if (!selectedCustomColor.value) return
     selectedColor.value = selectedCustomColor.value
     selectedTheme.value = null
     emit('update:modelValue', selectedCustomColor.value)
     emit('update:textColor', getContrastColor(selectedCustomColor.value))
     emit('update:isCustomBackground', true)
}

function getContrastColor(hex: string): string {
     if (!hex.startsWith('#')) return '#000000'
     const h = hex.replace('#', '')
     const r = parseInt(h.substring(0, 2), 16)
     const g = parseInt(h.substring(2, 4), 16)
     const b = parseInt(h.substring(4, 6), 16)
     const brightness = (r * 299 + g * 587 + b * 114) / 1000
     return brightness > 128 ? '#000000' : '#FFFFFF'
}

watch(() => props.modelValue, (val) => {
     if (!val) return
     selectedColor.value = val
     const match = items.value.find((i) => i.color === val)
     selectedTheme.value = match ?? null
}, { immediate: true })

watch(selectedCustomColor, (val) => {
     if (val) applyCustomColor()
})

function handleClickOutside(e: MouseEvent) {
     if (pickerContainer.value && !pickerContainer.value.contains(e.target as Node)) isOpen.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
