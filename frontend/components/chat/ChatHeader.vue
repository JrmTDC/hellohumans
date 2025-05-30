<template>
     <div class="p-[24px] text-white rounded-t-lg" :style="{ background: chatStore.configChat.backgroundColor }">
          <div class="flex justify-between items-center">
               <div v-if="!isChatActive">
                    <svgo-chat-logo-hello-humans-full class="w-[189px] h-[28px]" :style="{ fill: chatStore.configChat.textColor }"/>
               </div>
               <div v-else>
                    <div class="flex space-x-2 items-center">
                         <button @click="!previewMode && $emit('goToHome')" class="hhcss_btnOption group ml-[-15px]">
                              <svgo-chat-icon-back class="w-[24px] h-[24px]" :style="{ fill: chatStore.configChat.textColor }"/>

                              <span class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] start-full ms-[10px] translate-x-[-5px] translate-y-[-50%] opacity-0 group-hover:opacity-100">{{ t('chat.components.header.back') }}</span>
                         </button>
                         <svgo-chat-logo-hello-humans-mini class="w-[24px] h-[27px]" :style="{ fill: chatStore.configChat.textColor }"/>
                         <div class="flex space-x-2 items-center">
                              <span :style="{ color: chatStore.configChat.textColor }">{{ chatStore.configChat.welcomeTitle }}</span>
                         </div>
                    </div>
               </div>

               <div class="flex">
                    <!-- Open options -->

                    <button @click.stop="!previewMode && $emit('toggleOptions')" class="hhcss_btnOption group">
                         <svgo-chat-icon-option class="w-[24px] h-[24px]" :style="{ fill: chatStore.configChat.textColor }"/>
                         <span v-if="!showOptions" class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100">{{ t('chat.components.header.openOptions') }}</span>
                         <span v-else class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100">{{ t('chat.components.header.closeOptions') }}</span>
                    </button>

                    <!-- Minimize -->
                    <button @click="!previewMode && $emit('toggleChat')" class="hhcss_btnOption group mr-[-15px]">
                         <svgo-chat-icon-minimize class="w-[24px] h-[24px]" :style="{ fill: chatStore.configChat.textColor }"/>
                         <span class="bg-white px-2 py-[6px] rounded shadow-lg text-[13px] absolute pointer-events-none whitespace-nowrap transition-[opacity,transform] duration-[160ms] ease-in-out z-1 top-1/2 text-[#06132B] end-full me-[10px] translate-x-[5px] translate-y-[-50%] opacity-0 group-hover:opacity-100">{{ t('chat.components.header.minimize') }}</span>
                    </button>
               </div>
          </div>

          <!-- Titre si accueil -->
          <div v-if="!isChatActive" class="mt-[28px] text-white text-[32px] font-medium leading-[40px] gap-[12px] flex flex-col mb-[40px]">
               <div class="flex flex-row justify-start items-center" :style="{ color: chatStore.configChat.textColor }">
                    {{ chatStore.configChat.welcomeTitle }}
               </div>
               <div class="text-white text-[15px] font-normal leading-[20px]" :style="{ color: chatStore.configChat.textColor }">
                    {{ chatStore.configChat.welcomeMessage }}
               </div>
          </div>

          <!-- Sous-titre si chat actif -->
          <div v-else class="mt-[15px] text-white text-[15px] font-normal" :style="{ color: chatStore.configChat.textColor }">
               {{ t('chat.components.header.imHereToHelp') }}
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const chatStore = useChatStore();
const props = defineProps<{
     isChatActive: boolean;
     isOpen: boolean;
     notificationSnoozed: boolean;
     showOptions: boolean;
     previewMode: boolean;
}>();

const emits = defineEmits([
     'goToHome',
     'toggleChat',
     'toggleOptions',
]);
</script>
