<template>
     <div class="p-[24px] text-white rounded-t-lg" :style="{ background: clientConfig.backgroundColor }">
          <div class="flex justify-between items-center">
               <div v-if="!isChatActive">
                    <svgo-chat-logo-hello-humans-full class="w-[189px] h-[28px]" :style="{ fill: clientConfig.textColor }"/>
               </div>
               <div v-else>
                    <div class="flex space-x-2 items-center">
                         <button
                              @click="$emit('goToHome')"
                              class="hhcss_btnOption group ml-[-15px]"
                         >
                              <svgo-chat-icon-back class="w-[24px] h-[24px]" :style="{ fill: clientConfig.textColor }"/>

                              <span
                                   class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] start-full ms-[10px] translate-x-[-5px] translate-y-[-50%] opacity-0 group-hover:opacity-100"
                              >
              Retour
            </span>
                         </button>
                         <svgo-chat-logo-hello-humans-mini class="w-[24px] h-[27px]" :style="{ fill: clientConfig.textColor }"/>
                         <div class="flex space-x-2 items-center">
                              <span :style="{ color: clientConfig.textColor }">Bonjour !</span>
                              <svgo-chat-emoji-hello class="w-[15px] h-[15px]"/>
                         </div>
                    </div>
               </div>

               <div class="flex">
                    <!-- Open options -->

                    <button @click.stop="$emit('toggleOptions')" class="hhcss_btnOption group">
                         <svgo-chat-icon-option class="w-[24px] h-[24px]" :style="{ fill: clientConfig.textColor }"/>
                         <span
                              v-if="!showOptions"
                              class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100"
                         >Ouvrir les options</span>
                         <span
                              v-else
                              class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100"
                         >Fermer les options</span>
                    </button>

                    <!-- Minimize -->
                    <button @click="$emit('toggleChat')" class="hhcss_btnOption group mr-[-15px]">
                         <svgo-chat-icon-minimize class="w-[24px] h-[24px]" :style="{ fill: clientConfig.textColor }"/>
                         <span
                              class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100"
                         >Réduire</span>
                    </button>
               </div>
          </div>

          <!-- Titre si accueil -->
          <div v-if="!isChatActive" class="mt-[28px] text-white text-[32px] font-medium leading-[40px] gap-[12px] flex flex-col mb-[40px]">
               <div class="flex flex-row justify-start items-center" :style="{ color: clientConfig.textColor }">
                    Bonjour !
                    <svgo-chat-emoji-hello class="w-[27px] h-[27px] ml-[10px]"/>
               </div>
               <div class="text-white text-[15px] font-normal leading-[20px]" :style="{ color: clientConfig.textColor }">
                    Bienvenue sur le site de l'Office de Tourisme, Avez vous besoin d’aider ?
               </div>
          </div>

          <!-- Sous-titre si chat actif -->
          <div v-else class="mt-[15px] text-white text-[15px] font-normal" :style="{ color: clientConfig.textColor }">
               Je suis là pour vous aider !
          </div>
     </div>
</template>

<script setup lang="ts">

const props = defineProps<{
     isChatActive: boolean;
     isOpen: boolean;
     notificationSound: boolean;
     showOptions: boolean;
     clientConfig: object;
}>();

const emits = defineEmits([
     'goToHome',
     'toggleChat',
     'toggleOptions',
]);
</script>
