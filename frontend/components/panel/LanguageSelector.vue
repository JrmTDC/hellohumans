<template>
     <div ref="langMenuRef" class="inline-flex relative align-top ml-0">
          <!-- Bouton principal -->
          <button
               @click="toggleLangMenu"
               aria-label="Sélectionner une langue"
               class="box-border h-[34px] px-[8px] pr-[6px] inline-flex items-center justify-center rounded-[3px] border border-transparent text-[rgb(100,116,145)] text-[14px] leading-[1] uppercase"
          >
               <svgo-panel-icon-earth class="w-[16px] h-[16px] mr-2 fill-[#647491]" aria-hidden="true" />
               {{ currentLangLabel }}
               <svgo-panel-icon-triangle-caret-down
                    class="w-[16px] h-[16px] ml-2 transform transition-transform fill-[#647491]"
                    :class="{ 'rotate-180': isLangMenuOpen }"
                    aria-hidden="true"
               />
          </button>

          <!-- Menu langues -->
          <div
               v-if="isLangMenuOpen"
               class="absolute left-[-51.4562px] min-w-[128px] top-full z-[20] opacity-100 visible translate-y-[4px]"
          >
               <div class="bg-white rounded-[8px] p-[8px] mb-[10px] shadow-[0px_8px_20px_rgba(0,20,51,0.24)]">
                    <div
                         v-for="lang in locales"
                         :key="lang.code"
                         @click="selectLanguage(lang.code)"
                         class="text-[14px] leading-[18px] tracking-[-0.01em] h-[44px] px-[24px] flex items-center text-[rgb(8,15,26)] hover:bg-[rgb(239,242,246)] cursor-pointer"
                    >
                         {{ lang.shortName }}
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
const { locales, locale, setLocale } = useI18n()

const isLangMenuOpen = ref(false)
const langMenuRef = ref<HTMLElement | null>(null)


const currentLangLabel = computed(() => {
     return locales.value.find(l => l.code === locale.value)?.code || locale.value.toUpperCase()
})

const toggleLangMenu = () => {
     isLangMenuOpen.value = !isLangMenuOpen.value
}

const selectLanguage = async (code: string) => {
     await setLocale(code as typeof locale.value)
     isLangMenuOpen.value = false
}

// Fermer le menu si clic en dehors
const handleClickOutside = (event: Event) => {
     if (langMenuRef.value && !langMenuRef.value.contains(event.target as Node)) {
          isLangMenuOpen.value = false
     }
}

onMounted(() => {
     document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})
</script>
