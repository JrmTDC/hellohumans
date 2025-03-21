<template>
     <div v-auto-animate class="bg-white flex flex-[1_1_0%] flex-col items-center h-screen font-[euclidcircularb,sans-serif]">
          <div class="absolute left-[40px] top-[40px]">
               <svgo-logo-hello-humans-full class="w-[200px] fill-[#303f9f]"/>
          </div>
          <div class="flex flex-col items-center mt-auto mb-auto">
               <div class="w-[400px] h-[300px]">
                    <svgo-anim-flying-saucer class="w-full h-full transform translate-x-0 translate-y-0 translate-z-0"/>
               </div>

               <header class="text-[rgb(48,63,159)] text-center font-semibold mt-[24px] mb-[16px] text-[40px] leading-[">Oups, un problème est survenu.</header>
               <p class="text-[rgb(8,15,26)] mb-[32px] text-[18px] leading-[23px] tracking-[-0.01em]">Appuyez sur le bouton pour recharger la page&nbsp;:</p>
               <button @click="refreshPage" class="antialiased inline-block mb-0 font-normal text-center align-middle touch-manipulation cursor-pointer bg-none border border-[rgb(5,102,255)] whitespace-nowrap px-[32px] text-[18.1px] leading-[22px] rounded-[4px] min-w-[160px] h-[46px] text-white bg-[rgb(5,102,255)] hover:text-white hover:bg-[rgb(0,73,189)] hover:border-[rgb(0,73,189)]">Recharger la page</button>
               <div class="text-center mt-[48px] text-[18px] leading-[31px] tracking-[-0.01em]">Si cela ne vous aide pas, contactez-nous via le chat ou à <a href="mailto:support@hellohumans.fr" target="_blank" rel="noopener noreferrer">support@hellohumans.fr</a>.<br>Vous pouvez suivre l’incident sur notre page de statut&nbsp;: <br><a href="https://status.hellohumans.fr/" target="_blank" rel="noopener noreferrer">status.hellohumans.fr</a>.</div>
               <p class="text-[#647491] mt-[60px] mb-[50px] text-[14px] leading-[18px] tracking-[-0.01em]">... par ailleurs, l’équipe d’ingénierie a été informée de ce problème.</p>
          </div>
     </div>
</template>

<script setup lang="ts">

// Fonction pour recharger la page
import { clearError } from '#app'

const refreshPage = () => {
     clearError()
     location.reload()
}
</script>
