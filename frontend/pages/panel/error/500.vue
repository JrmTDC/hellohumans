<template>
     <div id="hellohumans-error-iframe" class="pageError bg-white flex flex-[1_1_0%] flex-col items-center h-screen">
          <div class="absolute left-[40px] top-[40px]">
               <svgo-logo-hello-humans-full class="w-[200px] fill-[#303f9f]"/>
          </div>
          <div class="flex flex-col items-center mt-auto mb-auto">
               <div class="w-[400px] h-[300px]">
                    <svgo-anim-flying-saucer class="w-full h-full transform translate-x-0 translate-y-0 translate-z-0"/>
               </div>

               <header class="text-[rgb(48,63,159)] text-center font-semibold mt-[24px] mb-[16px] text-[40px] leading-[">{{ t('panel.pages.error.serverError.title') }}</header>
               <p class="text-[rgb(8,15,26)] mb-[32px] text-[18px] leading-[23px] tracking-[-0.01em]">{{ t('panel.pages.error.serverError.instruction') }}</p>
               <button @click="refreshPage" class="antialiased inline-block mb-0 font-normal text-center align-middle touch-manipulation cursor-pointer bg-none border border-[rgb(5,102,255)] whitespace-nowrap px-[32px] text-[18.1px] leading-[22px] rounded-[4px] min-w-[160px] h-[46px] text-white bg-[rgb(5,102,255)] hover:text-white hover:bg-[rgb(0,73,189)] hover:border-[rgb(0,73,189)]">{{ t('panel.pages.error.serverError.reload') }}</button>
               <div class="text-center mt-[48px] text-[18px] leading-[31px] tracking-[-0.01em]">{{ t('panel.pages.error.serverError.help') }}<a href="mailto:support@hellohumans.fr" target="_blank" rel="noopener noreferrer">support@hellohumans.fr</a>.<br>{{ t('panel.pages.error.serverError.statusPage') }}<br><a href="https://status.hellohumans.fr/" target="_blank" rel="noopener noreferrer">status.hellohumans.fr</a>.</div>
               <p class="text-[#647491] mt-[60px] mb-[50px] text-[14px] leading-[18px] tracking-[-0.01em]">{{ t('panel.pages.error.serverError.note') }}</p>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// Fonction pour recharger la page
import { clearError } from '#app'

const refreshPage = () => {
     clearError()
     location.reload()
}
const { setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.error.serverError.metaTitle'),
     description: t('panel.pages.error.serverError.metaDescription')
})
</script>

