<template>
     <div ref="langMenuRef" class="inline-flex relative align-top ml-0">
          <button
               @click="toggleLangMenu"
               aria-label="Sélectionner une langue"
               class="box-border h-[34px] px-[8px] pr-[6px] inline-flex items-center justify-center rounded-[3px] border border-transparent text-[rgb(100,116,145)] text-[14px] leading-[1] uppercase"
          >
               <svgo-panel-icon-earth class="w-[16px] h-[16px] mr-2 fill-[#647491]" aria-hidden="true" />
               {{ selectedLang }}
               <svgo-panel-icon-triangle-caret-down
                    class="w-[16px] h-[16px] ml-2 transform transition-transform fill-[#647491]"
                    :class="{ 'rotate-180': isLangMenuOpen }"
                    aria-hidden="true"
               />
          </button>

          <!-- Liste des langues -->
          <div
               v-if="isLangMenuOpen"
               class="absolute left-[-51.4562px] min-w-[128px] top-full z-[20] opacity-100 visible translate-y-[4px]"
          >
               <div class="max-h-none overflow-y-visible bg-white rounded-[8px] p-[8px] mb-[10px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)]">
                    <div
                         v-for="lang in languages"
                         :key="lang.code"
                         @click="selectLanguage(lang.code)"
                         class="text-[14px] leading-[18px] tracking-[-0.01em] h-[44px] px-[24px] flex items-center text-[rgb(8,15,26)] hover:bg-[rgb(239,242,246)] cursor-pointer"
                    >
                         {{ lang.name }}
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount, onUnmounted, defineEmits } from 'vue'

const isLangMenuOpen = ref(false)
const selectedLang = ref('') // Laisser vide initialement pour charger la langue plus tard

// Liste des langues avec l'attribut 'default' pour la langue par défaut
const languages = ref([
     { code: 'DE', name: 'Deutsch' },
     { code: 'EN', name: 'English', default: true },
     { code: 'ES', name: 'Español' },
     { code: 'FR', name: 'Français' },
     { code: 'IT', name: 'Italiano' },
     { code: 'PT', name: 'Português' }
])

const langMenuRef = ref<HTMLElement | null>(null)

// Gestion des événements
const emit = defineEmits(['languageSelected'])

// Toggle menu des langues
const toggleLangMenu = () => {
     isLangMenuOpen.value = !isLangMenuOpen.value
}

// Sélection de la langue
const selectLanguage = (code: string) => {
     selectedLang.value = code
     isLangMenuOpen.value = false
     // Stocke la langue dans le localStorage
     localStorage.setItem('selectedLang', code)
     emit('languageSelected', code) // Émet l'événement vers le parent
}

// Détection des clics à l'extérieur
const handleClickOutside = (event: Event) => {
     if (langMenuRef.value && !langMenuRef.value.contains(event.target as Node)) {
          isLangMenuOpen.value = false
     }
}

// Récupère la langue par défaut
const getBrowserLang = () => {
     const browserLang = navigator.language.slice(0, 2).toUpperCase() // Extrait les deux premiers caractères
     return browserLang
}

// Récupère la langue par défaut ou celle stockée
onBeforeMount(() => {
     const storedLang = localStorage.getItem('selectedLang')
     const browserLang = getBrowserLang()

     const defaultLang = languages.value.find(lang => lang.default) || { code: 'EN' }

     selectedLang.value = storedLang && languages.value.some(lang => lang.code === storedLang)
          ? storedLang
          : languages.value.find(lang => lang.code === browserLang)?.code || defaultLang.code

     // Émet la langue sélectionnée
     emit('languageSelected', selectedLang.value)
})

onMounted(() => {
     // Ajoute l'écouteur d'événements pour détecter les clics à l'extérieur
     document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
     // Nettoyage de l'écouteur d'événements
     document.removeEventListener('click', handleClickOutside)
})
</script>
