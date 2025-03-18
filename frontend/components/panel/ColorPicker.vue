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
     type: { type: String, default: 'backgroundColors' },
})

const emit = defineEmits(['update:modelValue', 'update:textColor', 'update:isCustomBackground'])
const isOpen = ref(false)
const selectedColor = ref(props.modelValue || '#0566ff')
const selectedTheme = ref(null)
const selectedCustomColor = ref(null) // Stocke la couleur personnalisée
const isCustomBackground = ref(false) // Détecte si la couleur de fond est personnalisée
const pickerContainer = ref(null)
const colorInput = ref(null) // Référence pour le input color caché

// Liste des thèmes prédéfinis
const backgroundColors = ref([
     { name: 'Dégradé 1', color: 'linear-gradient(115deg, #2a27da, #00ccff)', textColor : '#fff' },
     { name: 'Dégradé 2', color: 'linear-gradient(115deg, #401dba, #825bf0)', textColor : '#fff' },
     { name: 'Dégradé 3', color: 'linear-gradient(115deg, #ff4e6f, #fb9168)', textColor : '#fff' },
     { name: 'Dégradé 4', color: 'linear-gradient(115deg, #ace0f9, #fff1eb)', textColor : '#2f5680' },
     { name: 'Dégradé 5', color: 'linear-gradient(115deg, #29323c, #485563)', textColor : '#fff' },
     { name: 'Dégradé 6', color: 'linear-gradient(115deg, #4facfe, #00f2fe)', textColor : '#fff' },
     { name: 'Dégradé 7', color: 'linear-gradient(115deg, #7c3ab7, #ff9aad)', textColor : '#fff' },
     { name: 'Dégradé 8', color: 'linear-gradient(115deg, #a18cd1, #fbc2eb)', textColor : '#42265a' },
     { name: 'Dégradé 9', color: 'linear-gradient(115deg, #ff9a9e, #fad0c4)', textColor : '#843437' },
     { name: 'Dégradé 10', color: 'linear-gradient(115deg, #ff5858, #f09819)', textColor : '#fff' },
     { name: 'Dégradé 11', color: 'linear-gradient(115deg, #fa709a, #febb40)', textColor : '#fff' },
     { name: 'Dégradé 12', color: 'linear-gradient(115deg, #fda085, #f6d365)', textColor : '#784438' },
     { name: 'Dégradé 13', color: 'linear-gradient(115deg, #daa475, #ffe0b9)', textColor : '#6b4b29' },
     { name: 'Dégradé 14', color: 'linear-gradient(115deg, #8a716d, #e8b794)', textColor : '#fff' },
     { name: 'Dégradé 15', color: 'linear-gradient(115deg, #abeed6, #fbed96)', textColor : '#387861' },
     { name: 'Dégradé 16', color: 'linear-gradient(115deg, #3aa560, #b7e66c)', textColor : '#fff' },
     { name: 'Dégradé 17', color: 'linear-gradient(115deg, #00c9ff, #92fe9d)', textColor : '#173e2b' },
     { name: 'Dégradé 18', color: 'linear-gradient(115deg, #13547a, #80d0c7)', textColor : '#fff' },
     { name: 'Dégradé 19', color: 'linear-gradient(115deg, #dfe9f3, #ffffff)', textColor : '#38425d' },
     { name: 'Dégradé 20', color: 'linear-gradient(115deg, #e9defa, #fbfcdb)', textColor : '#7d59a3' },
     { name: 'Dégradé 21', color: 'linear-gradient(115deg, #accbee, #e7f0fd)', textColor : '#485195' },
     { name: 'Dégradé 22', color: 'linear-gradient(115deg, #93a5cf, #e4efe9)', textColor : '#344973' },
     { name: 'Dégradé 23', color: 'linear-gradient(115deg, #09203f, #537895)', textColor : '#fff' },
     { name: 'Dégradé 24', color: 'linear-gradient(115deg, #000000, #434343)', textColor : '#fff' },
     { name: 'Dégradé 25', color: 'linear-gradient(115deg, #0a0e88, #00b1ce)', textColor : '#fff' },
     { name: 'Dégradé 26', color: 'linear-gradient(115deg, #19025c, #6e28bf)', textColor : '#fff' },
     { name: 'Dégradé 27', color: 'linear-gradient(115deg, #31003e, #c3286e)', textColor : '#fff' },
     { name: 'Dégradé 28', color: 'linear-gradient(115deg, #98033a, #f74f28)', textColor : '#fff' },
     { name: 'Dégradé 29', color: 'linear-gradient(115deg, #047c8d, #2ff289)', textColor : '#fff' }
])

const textColors = ref([
     { name: 'Noir', color: '#000' },
     { name: 'Blanc', color: '#FFF' }
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

// Sélectionne dynamiquement la bonne liste
const items = computed(() => {
     if (props.type === 'backgroundColors') return backgroundColors.value
     if (props.type === 'textColors') return textColors.value
     return actionColors.value
})

// Détermine dynamiquement le titre
const title = computed(() => {
     if (props.type === 'backgroundColors') return "Thèmes :"
     return "Couleurs prédéfinies :"
})

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
     isCustomBackground.value = false // C'est un thème, donc pas un fond custom
     emit('update:modelValue', item.color)
     emit('update:textColor', item.textColor) // Appliquer la couleur du texte associée
     emit('update:isCustomBackground', true)
     isOpen.value = false
}

// Appliquer la couleur personnalisée
const selectCustomColor = () => {
     selectedColor.value = selectedCustomColor.value
     selectedTheme.value = null // Désélectionner le thème
     isCustomBackground.value = true // Fond personnalisé activé
     emit('update:modelValue', selectedCustomColor.value)
     emit('update:textColor', getContrastColor(selectedCustomColor.value)) // Détection automatique du texte
     emit('update:isCustomBackground', true)
}

// Appliquer une couleur de texte sélectionnée manuellement
const selectTextColor = (item) => {
     emit('update:textColor', item.color)
}

// Détecter si noir ou blanc est le meilleur choix pour la lisibilité
const getContrastColor = (bgColor) => {
     if (!bgColor) return '#000000' // Sécurité si aucune couleur n'est choisie
     const hex = bgColor.replace('#', '')
     const r = parseInt(hex.substring(0, 2), 16)
     const g = parseInt(hex.substring(2, 4), 16)
     const b = parseInt(hex.substring(4, 6), 16)
     const brightness = (r * 299 + g * 587 + b * 114) / 1000
     return brightness > 128 ? '#000000' : '#FFFFFF' // Noir si clair, blanc si sombre
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

// Synchronisation avec la couleur personnalisée
watch(selectedCustomColor, (newColor) => {
     if (newColor) {
          selectedTheme.value = null // Désélectionner le thème
          selectCustomColor() // Sélectionner immédiatement la nouvelle couleur
     }
})
</script>
