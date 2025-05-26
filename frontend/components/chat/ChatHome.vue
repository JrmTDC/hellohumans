<template>
     <div class="p-[24px] pt-[0] pb-[0] mt-[-40px] flex flex-col z-[300] scroll-px-[24px] flex-1 overflow-y-auto">
          <!-- Questions suggérées -->
          <template v-if="suggestedQuestions.length">
               <div class="flex w-full rounded-[12px] border border-[rgb(226,232,239)] overflow-y-hidden mb-[16px]">
                    <div class="flex flex-col items-center w-full bg-white max-h-[250px] overflow-y-auto">
                         <template
                              v-for="(question, index) in suggestedQuestions"
                              :key="index">
                              <button
                                   @click="$emit('sendSuggestedMessage', question.id)"
                                   class="flex items-center justify-between w-full bg-transparent px-[16px] py-[16px] gap-[8px]"
                              >
                                <span class="text-[15px] font-normal text-left text-[rgb(6,19,43)] overflow-hidden text-ellipsis line-clamp-3">
                                  {{ question.label }}
                                </span>
                                   <svgo-chat-icon-next class="w-[20px] h-[20px]"/>
                              </button>
                              <hr v-if="index !== suggestedQuestions.length - 1" class="w-[calc(100%-32px)] border-b border-b-[rgb(226,232,239)] mx-[16px] my-0" />
                         </template>
                    </div>
               </div>
          </template>

          <!-- Bouton Chat avec nous -->
          <button @click="$emit('openChat')" class="flex px-4 py-3 items-center gap-2 w-full rounded-xl border border-[#e2e8ef] bg-white hover:bg-[#EFF2F6] z-20">
               <div class="flex flex-col items-start gap-[2px] flex-grow">
                    <span class="font-semibold text-[15px] leading-[19px]">Parlez à notre assistant</span>
                    <span class="text-[14px] font-normal text-left text-[#4C596B] overflow-hidden text-ellipsis line-clamp-2">Je suis là pour vous aider !</span>
               </div>
               <svgo-chat-icon-send class="w-[20px] h-[21px]" :style="{ fill:chatStore.configChat.actionColor }" />
          </button>
          <div class="flex-[1_100_16px]"></div>
          <!-- Powered by HelloHumans -->
          <div class="flex justify-center items-center flex-[0_0_48px]">
               <a href="https://hellohumans.fr" target="_blank" class="flex items-center text-[rgb(136,148,171)] font-normal text-[10px] uppercase text-center">Propulsé par <svgo-chat-logo-hello-humans-full class="ml-[5px] w-[90px] h-auto fill-[rgb(100,116,145)]" /></a>
          </div>
     </div>
     <!-- Barre de navigation du bas (ex: Accueil, Discussion) -->
     <div class="bg-white flex flex-col px-[24px]">
          <div class="px-5 py-3 flex justify-center items-start gap-1 self-stretch border-t border-[#e2e8ef] bg-white">
               <!-- Home -->
               <button class="flex flex-1 flex-col items-center gap-[2px] text-[15px] font-semibold">
                    <svgo-chat-icon-home class="w-[28px] h-[28px]" :style="{ fill:chatStore.configChat.actionColor }"/>
                    <span class="text-sm text-gray-700">Accueil</span>
               </button>

               <!-- Chat -->
               <button
                    @click="$emit('openChat')"
                    @mouseover="isHovered = true"
                    @mouseleave="isHovered = false"
                    class="group flex flex-1 flex-col items-center gap-[2px] text-[15px] font-semibold text-[#647491] hover:text-gray-700"
               >
                    <svgo-chat-icon-chat class="w-[28px] h-[28px]" :style="{ fill: isHovered ? chatStore.configChat.actionColor : '' }" />
                    <span class="text-sm">Discuter</span>
               </button>
          </div>
     </div>
</template>
<script setup lang="ts">
const chatStore = useChatStore();
const suggestedQuestions = computed(() =>
     chatStore.suggestions
          .filter(s => s.enabled)
          .sort((a, b) => a.order - b.order)
)

const emits = defineEmits(['sendSuggestedMessage', 'openChat']);
const isHovered = ref(false);

const props = defineProps({
     previewMode: {
          type: Boolean,
          default: false
     }
});
const previewMode = computed(() => props.previewMode);

</script>
