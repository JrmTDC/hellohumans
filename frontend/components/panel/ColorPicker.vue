<template>
     <div class="relative w-full" ref="pickerContainer">
          <!-- Bouton principal -->
          <div
               class="flex items-center p-2 border rounded cursor-pointer hover:bg-gray-100 transition"
               @click="togglePicker">
               <!-- Cercle de couleur -->
               <div class="w-6 h-6 rounded-full border shadow-sm" :style="{ background: selectedColor }"></div>

               <!-- Nom de la couleur ou code HEX -->
               <span class="ml-3 flex-1 text-left text-sm text-gray-700">
               {{ selectedTheme ? selectedTheme.name : selectedColor }}
               </span>

               <!-- Icône de sélection (rotation en fonction de l'ouverture) -->
               <svgoIconInputSelect
                    class="w-6 h-6 transform transition-transform fill-[#080f1a]"
                    :class="{ 'rotate-180': isOpen }" />
          </div>

          <!-- Boîte de sélection (s'affiche au clic) -->
          <div
               v-if="isOpen"
               class="min-w-[375.8px] max-w-[256px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute z-[10] max-h-[280px] p-3 overflow-y-auto"
          >
               <!-- Sélecteur de couleur personnalisé -->
               <div
                    class="relative flex items-center p-[9px_8px] cursor-pointer hover:bg-[#dce9ff] rounded"
                    @click="triggerColorPicker">
                    <svgoIconPickerColor class="w-6 h-6 fill-[#647491]" />
                    <span class="ml-3 flex-1 text-left text-sm text-gray-700">Choisissez votre couleur</span>
                    <!-- Picker color caché qui s'ouvre au bon endroit -->
                    <input
                         type="color"
                         ref="colorInput"
                         v-model="selectedCustomColor"
                         class="absolute opacity-0 w-full h-full cursor-pointer "
                    />
               </div>

               <!-- Couleur personnalisée sélectionnée (s'affiche si définie) -->
               <ul v-if="selectedCustomColor" class="mb-2">
                    <li
                         class="flex items-center cursor-pointer p-2 rounded hover:bg-[#dce9ff]"
                         @click="selectCustomColor"
                    >
                         <div class="w-6 h-6 rounded-full border shadow-sm" :style="{ background: selectedCustomColor }"></div>
                         <span class="ml-3 text-sm text-gray-700">{{ selectedCustomColor }}</span>
                    </li>
               </ul>

               <!-- Affichage dynamique du titre -->
               <div>
                    <span class="block text-xs text-gray-500 mb-1 p-[14px_8px_4px]">{{ title }}</span>
                    <ul>
                         <li
                              v-for="item in items"
                              :key="item.name"
                              @click="selectColor(item)"
                              class="flex items-center cursor-pointer rounded hover:bg-[#dce9ff] p-[9px_8px]"
                         >
                              <div class="w-6 h-6 rounded-full border shadow-sm" :style="{ background: item.color }"></div>
                              <span class="ml-3 text-sm text-gray-700">{{ item.name }}</span>
                         </li>
                    </ul>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
     modelValue: String, // La couleur actuelle (v-model)
     type: { type: String, default: 'themes' } // "themes" ou "colors"
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectedColor = ref(props.modelValue || '#0566ff')
const selectedTheme = ref(null)
const selectedCustomColor = ref(null) // Stocke la couleur personnalisée

const pickerContainer = ref(null)
const colorInput = ref(null) // Référence pour le input color caché

// Liste des thèmes prédéfinis
const themes = ref([
     { name: 'Dégradé 1', color: 'linear-gradient(115deg, #2a27da, #00ccff)' },
     { name: 'Dégradé 2', color: 'linear-gradient(115deg, #401dba, #825bf0)' },
     { name: 'Dégradé 3', color: 'linear-gradient(115deg, #ff4e6f, #fb9168)' },
     { name: 'Dégradé 4', color: 'linear-gradient(115deg, #ace0f9, #fff1eb)' },
     { name: 'Dégradé 5', color: 'linear-gradient(115deg, #29323c, #485563)' },
     { name: 'Dégradé 6', color: 'linear-gradient(115deg, #4facfe, #00f2fe)' },
     { name: 'Dégradé 7', color: 'linear-gradient(115deg, #7c3ab7, #ff9aad)' },
     { name: 'Dégradé 8', color: 'linear-gradient(115deg, #a18cd1, #fbc2eb)' },
     { name: 'Dégradé 9', color: 'linear-gradient(115deg, #ff9a9e, #fad0c4)' },
     { name: 'Dégradé 10', color: 'linear-gradient(115deg, #ff5858, #f09819)' },
     { name: 'Dégradé 11', color: 'linear-gradient(115deg, #fa709a, #febb40)' },
     { name: 'Dégradé 12', color: 'linear-gradient(115deg, #fda085, #f6d365)' },
     { name: 'Dégradé 13', color: 'linear-gradient(115deg, #daa475, #ffe0b9)' },
     { name: 'Dégradé 14', color: 'linear-gradient(115deg, #8a716d, #e8b794)' },
     { name: 'Dégradé 15', color: 'linear-gradient(115deg, #abeed6, #fbed96)' },
     { name: 'Dégradé 16', color: 'linear-gradient(115deg, #3aa560, #b7e66c)' },
     { name: 'Dégradé 17', color: 'linear-gradient(115deg, #00c9ff, #92fe9d)' },
     { name: 'Dégradé 18', color: 'linear-gradient(115deg, #13547a, #80d0c7)' },
     { name: 'Dégradé 19', color: 'linear-gradient(115deg, #dfe9f3, #ffffff)' },
     { name: 'Dégradé 20', color: 'linear-gradient(115deg, #e9defa, #fbfcdb)' },
     { name: 'Dégradé 21', color: 'linear-gradient(115deg, #accbee, #e7f0fd)' },
     { name: 'Dégradé 22', color: 'linear-gradient(115deg, #93a5cf, #e4efe9)' },
     { name: 'Dégradé 23', color: 'linear-gradient(115deg, #09203f, #537895)' },
     { name: 'Dégradé 24', color: 'linear-gradient(115deg, #000000, #434343)' },
     { name: 'Dégradé 25', color: 'linear-gradient(115deg, #0a0e88, #00b1ce)' },
     { name: 'Dégradé 26', color: 'linear-gradient(115deg, #19025c, #6e28bf)' },
     { name: 'Dégradé 27', color: 'linear-gradient(115deg, #31003e, #c3286e)' },
     { name: 'Dégradé 28', color: 'linear-gradient(115deg, #98033a, #f74f28)' },
     { name: 'Dégradé 29', color: 'linear-gradient(115deg, #047c8d, #2ff289)' }
])

const colors = ref([
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
// Sélectionne dynamiquement la bonne liste
const items = computed(() => (props.type === 'themes' ? themes.value : colors.value))

// Détermine dynamiquement le titre
const title = computed(() => (props.type === 'themes' ? "Thèmes :" : "Couleurs prédéfinies :"))

// Ouvrir/fermer le sélecteur
const togglePicker = () => {
     isOpen.value = !isOpen.value
}

// Ouvrir le color picker caché
const triggerColorPicker = () => {
     colorInput.value.click()
}

// Appliquer une couleur de thème ou de couleur prédéfinie
const selectColor = (item) => {
     selectedColor.value = item.color
     selectedTheme.value = item
     selectedCustomColor.value = null // Désélectionne la couleur personnalisée
     emit('update:modelValue', item.color)
     isOpen.value = false
}

// Appliquer la couleur personnalisée
const selectCustomColor = () => {
     selectedColor.value = selectedCustomColor.value
     selectedTheme.value = null // Désélectionner le thème
     emit('update:modelValue', selectedCustomColor.value)
}

// Fermer la boîte si on clique en dehors
const handleClickOutside = (event) => {
     if (pickerContainer.value && !pickerContainer.value.contains(event.target)) {
          isOpen.value = false
     }
}

// Écouteur d'événements pour détecter les clics en dehors
onMounted(() => {
     document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

// Synchronisation avec la couleur personnalisée (mise à jour en direct et sélection auto)
watch(selectedCustomColor, (newColor) => {
     if (newColor) {
          selectedTheme.value = null // Désélectionner le thème
          selectCustomColor() // Sélectionner immédiatement la nouvelle couleur
     }
})
</script>
