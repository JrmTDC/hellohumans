<template>
     <div class="bg-white flex flex-[1_1_0%] flex-col items-center h-screen font-[euclidcircularb,sans-serif]">
          <div class="absolute left-[40px] top-[40px]">
               <svgo-logo-hello-humans-full class="w-[200px] fill-[#303f9f]"/>
          </div>
          <div class="flex flex-col items-center mt-auto mb-auto">
               <div class="w-[400px] h-[300px]">
                    <svgo-anim-flying-saucer class="w-full h-full transform translate-x-0 translate-y-0 translate-z-0"/>
               </div>

               <header class="text-[rgb(48,63,159)] text-center font-semibold mt-[24px] mb-[16px] text-[40px] leading-[">{{ t('panel.pages.error.unauthorized.title') }}</header>
               <p class="text-[rgb(8,15,26)] text-[18px] leading-[23px] tracking-[-0.01em]">{{ t('panel.pages.error.unauthorized.description') }}</p><p class="text-[rgb(8,15,26)] mb-[32px]  text-[18px] leading-[23px] tracking-[-0.01em]">{{ t('panel.pages.error.unauthorized.hint') }}</p>
               <button @click="goHome" class="antialiased inline-block mb-0 font-normal text-center align-middle touch-manipulation cursor-pointer bg-none border border-[rgb(5,102,255)] whitespace-nowrap px-[32px] text-[18.1px] leading-[22px] rounded-[4px] min-w-[160px] h-[46px] text-white bg-[rgb(5,102,255)] hover:text-white hover:bg-[rgb(0,73,189)] hover:border-[rgb(0,73,189)]">{{ t('panel.pages.error.unauthorized.goHome') }}</button>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import { computed } from 'vue'
import { useRouter, useRoute, clearError } from '#app'

const router = useRouter()
const route = useRoute()

// Vérifier si l'URL actuelle commence par "/panel/"
const isPanel = computed(() => route.path.startsWith('/panel'))


const goHome = () => {
     clearError()
     router.push(isPanel.value ? '/panel' : '/')
}
</script>

