<!-- components/ColorPicker.vue -->
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
          <!-- class="min-w-[375.8px] max-w-[256px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)] bg-white rounded-[8px] absolute top-[38px] z-[2] max-h-[280px] flex mt-0" -->

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

               <!-- Picker color caché -->

               <input
                    type="color"
                    ref="colorInput"
                    v-model="selectedCustomColor"
                    class="hidden absolute opacity-0 w-full h-full cursor-pointer left-0 top-0"
               />

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
               <!-- Thèmes prédéfinis -->
               <div>
                    <span class="block text-xs text-gray-500 mb-1 p-[14px_8px_4px]">Thèmes :</span>
                    <ul>
                         <li
                              v-for="theme in themes"
                              :key="theme.name"
                              @click="selectTheme(theme)"
                              class="flex items-center cursor-pointer rounded hover:bg-[#dce9ff] p-[9px_8px]"
                         >
                              <div
                                   class="w-6 h-6 rounded-full border shadow-sm"
                                   :style="{ background: theme.color }"
                              ></div>
                              <span class="ml-3 text-sm text-gray-700">{{ theme.name }}</span>
                         </li>
                    </ul>
               </div>
          </div>
     </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
     modelValue: String // La couleur actuelle (v-model)
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
     { name: 'Dégradé 1', color: 'linear-gradient(115deg, rgb(42,39,218), rgb(0,204,255))' },
     { name: 'Dégradé 2', color: 'linear-gradient(115deg, rgb(255,128,0), rgb(255,0,128))' },
     { name: 'Bleu Classique', color: '#0566ff' },
     { name: 'Noir Élégant', color: '#222222' }
])

// Ouvrir/fermer le sélecteur
const togglePicker = () => {
     isOpen.value = !isOpen.value
}

// Ouvrir le color picker caché
const triggerColorPicker = () => {
     colorInput.value.click()
}

// Appliquer une couleur de thème
const selectTheme = (theme) => {
     selectedColor.value = theme.color
     selectedTheme.value = theme
     selectedCustomColor.value = null // On désélectionne la couleur personnalisée
     emit('update:modelValue', theme.color)
     isOpen.value = false
}

// Appliquer la couleur personnalisée et la sélectionner automatiquement
const selectCustomColor = () => {
     selectedColor.value = selectedCustomColor.value
     selectedTheme.value = null // On désélectionne les thèmes
     emit('update:modelValue', selectedCustomColor.value)
     //isOpen.value = false
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
