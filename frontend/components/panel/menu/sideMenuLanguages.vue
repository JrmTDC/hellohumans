<template>
     <div ref="langMenuRef" class="absolute z-[110] bg-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] rounded-[8px] p-[8px] w-[256px] max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#d3dbe5] scrollbar-track-transparent" :style="menuStyle">
          <div v-for="lang in locales" :key="lang.code">
               <div role="menuitemradio" class="w-full flex items-center text-[#080f1a] bg-transparent border-none rounded-[4px] min-h-[36px] px-[8px] py-[6px] cursor-pointer outline-none hover:bg-[#dce9ff] hover:text-[#001433] group" @click="selectLanguage(lang.code)">
                    <span class="whitespace-nowrap overflow-hidden text-ellipsis flex-1 text-left text-[14px]">{{ lang.name }}</span>
                    <span v-if="lang.code === locale" class="flex items-center ml-[12px]">
                         <svgo-panel-icon-checked class="w-[24px] h-[24px] fill-[#647491] group-hover:fill-[#0566ff]" />
                    </span>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
import {onMounted} from "vue";

const { locale, locales, setLocale } = useI18n()
const langMenuRef = ref()
const emit = defineEmits(['close'])

const menuStyle = ref({ top: '50%', left: '245px', transform: 'translateY(-50%)' })

const selectLanguage = async (code: string) => {
     if (code !== locale.value) {
          await setLocale(code as any)
          // Enregistrer en base si utilisateur connecté (optionnel)
          //location.reload()
     }
     emit('close')
}

let skipNextClick = true

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
onUnmounted(() => {
     document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
     if (!langMenuRef.value || langMenuRef.value.contains(event.target as Node)) return
     emit('close')
}
</script>
