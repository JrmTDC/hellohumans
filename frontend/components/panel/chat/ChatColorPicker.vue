<template>
     <div class="relative w-full" ref="pickerContainer">
          <!-- Bouton principal -->
          <div
               class="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100 transition"
               @click="togglePicker"
          >
               <!-- Cercle de couleur -->
               <div class="w-6 h-6 rounded-full border shadow-sm" :style="{ background: selectedColor }" />
               <!-- Libellé -->
               <span class="ml-3 flex-1 text-left text-sm text-gray-700">
        {{ selectedTheme?.name || selectedColor }}
      </span>
               <!-- Flèche -->
               <svgo-chat-icon-input-select
                    class="w-6 h-6 transform transition-transform fill-[#080f1a]"
                    :class="{ 'rotate-180': isOpen }"
               />
          </div>

          <!-- Boîte déroulante -->
          <div
               v-if="isOpen"
               class="min-w-[375.8px] max-w-[256px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute z-[10] max-h-[280px] p-3 overflow-y-auto"
          >
               <!-- Couleur personnalisée -->
               <div
                    class="relative flex items-center p-[9px_8px] cursor-pointer hover:bg-[#dce9ff] rounded"
                    @click="colorInput.click()"
               >
                    <svgo-chat-icon-picker-color class="w-6 h-6 fill-[#647491]" />
                    <span class="ml-3 flex-1 text-left text-sm text-gray-700">Choisissez votre couleur</span>
                    <input
                         type="color"
                         ref="colorInput"
                         v-model="selectedCustomColor"
                         class="absolute opacity-0 w-full h-full cursor-pointer"
                    />
               </div>

               <ul v-if="selectedCustomColor" class="mb-2">
                    <li
                         class="flex items-center cursor-pointer p-2 rounded hover:bg-[#dce9ff]"
                         @click="applyCustomColor"
                    >
                         <div class="w-6 h-6 rounded-full border shadow-sm" :style="{ background: selectedCustomColor }" />
                         <span class="ml-3 text-sm text-gray-700">{{ selectedCustomColor }}</span>
                    </li>
               </ul>

               <!-- Liste prédéfinie -->
               <div>
                    <span class="block text-xs text-gray-500 mb-1 p-[14px_8px_4px]">{{ title }}</span>
                    <ul>
                         <li
                              v-for="item in items"
                              :key="item.name"
                              @click="applyPreset(item)"
                              class="flex items-center cursor-pointer rounded hover:bg-[#dce9ff] p-[9px_8px]"
                         >
                              <div class="w-6 h-6 rounded-full border shadow-sm" :style="{ background: item.color }" />
                              <span class="ml-3 text-sm text-gray-700">{{ item.name }}</span>
                         </li>
                    </ul>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

/* ---------- props / emits ---------- */
const props = defineProps<{ modelValue?: string; type?: string }>()
const emit = defineEmits(['update:modelValue', 'update:textColor', 'update:isCustomBackground'])

/* ---------- state ---------- */
const isOpen = ref(false)
const selectedColor = ref(props.modelValue || '#0566ff')
const selectedTheme = ref<{ name: string; color: string; textColor?: string } | null>(null)
const selectedCustomColor = ref<string | null>(null)
const pickerContainer = ref<HTMLElement | null>(null)
const colorInput = ref<HTMLInputElement | null>(null)

/* ---------- preset arrays (complets) ---------- */
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

/* ---------- computed ---------- */
const items = computed(() => {
     if (props.type === 'backgroundColors') return backgroundColors.value
     if (props.type === 'textColors') return textColors.value
     return actionColors.value
})
const title = computed(() => (props.type === 'backgroundColors' ? 'Thèmes :' : 'Couleurs prédéfinies :'))

/* ---------- helpers ---------- */
function togglePicker() {
     isOpen.value = !isOpen.value
}

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

/* ---------- synchronisation externe ---------- */
watch(
     () => props.modelValue,
     (val) => {
          if (!val) return
          selectedColor.value = val
          const match = items.value.find((i) => i.color === val)
          selectedTheme.value = match ?? null
     },
     { immediate: true }
)

/* ---------- couleur personnalisée immédiate ---------- */
watch(selectedCustomColor, (val) => {
     if (val) applyCustomColor()
})

/* ---------- fermer si clic extérieur ---------- */
function handleClickOutside(e: MouseEvent) {
     if (pickerContainer.value && !pickerContainer.value.contains(e.target as Node)) isOpen.value = false
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
