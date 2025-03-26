<template>
     <div id="hellohumans-loading" class="fixed inset-0 bg-[#001433] z-[2147483647] grid place-items-center">
          <div class="flex flex-col items-center w-[200px] text-center">
               <div>
                    <svgo-logo-hello-humans-full class="w-auto h-[35px] fill-[#fff]" />
                    <div class="progress w-full h-[12px] rounded-[4px] bg-[#002661] my-5 overflow-hidden">
                         <div class="progress-bar bg-[#0566ff] h-full transition-[width] duration-[600ms] ease-[ease]" role="progressbar" style="width:20%;"></div>
                    </div>
                    <p class="message text-white font-medium mx-[-20px] my-0">
                         &nbsp;Connexion ...
                    </p>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
// Ce composant est purement visuel, pas de logique nécessaire ici
</script>
