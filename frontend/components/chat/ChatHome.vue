<template>
     <div class="p-[24px] pt-[0] pb-[0] max-h-[434px] mt-[-40px] overflow-y-auto flex flex-col z-30 scroll-px-[24px] flex-[1_1_0%]">
          <!-- Questions suggérées -->
          <div v-if="suggestedQuestions" class="flex rounded-[12px] divide-solid overflow-y-hidden mb-[16px] w-full border border-[#EFF2F6] z-20">
               <div class="flex flex-col w-full items-center overflow-y-auto bg-[#fff]">
                    <div
                         v-for="(question, index) in suggestedQuestions"
                         :key="index"
                         class="w-full"
                    >
                         <button
                              @click="$emit('sendSuggestedMessage', question)"
                              class="flex scroll-px-[16px] items-center gap-[8px] justify-between w-full hover:bg-[#EFF2F6] p-[16px]"
                         >
                                <span class="text-[15px] font-medium text-left text-[#06132b] overflow-hidden text-ellipsis">
                                  {{ question }}
                                </span>
                              <svgo-chat-icon-next class="w-[20px] h-[20px]"/>
                         </button>
                         <hr
                              class="ml-[15px] mr-[15px]"
                              v-if="index !== suggestedQuestions.length - 1"
                         />
                    </div>
               </div>
          </div>

          <!-- Bouton Chat avec nous -->
          <button
               @click="$emit('openChat')"
               class="flex px-4 py-3 items-center gap-2 w-full rounded-xl border border-[#e2e8ef] bg-white hover:bg-[#EFF2F6] z-20"
          >
               <div class="flex flex-col items-start gap-[2px] flex-grow">
                    <span class="font-semibold text-[15px] leading-[19px]">Parlez à notre assistant</span>
                    <span class="text-[14px] font-normal text-left text-[#4C596B] overflow-hidden text-ellipsis line-clamp-2">Je suis là pour vous aider !</span>
               </div>
               <svgo-chat-icon-send class="w-[20px] h-[21px]" :style="{ fill:clientConfig.actionColor }" />
          </button>

          <!-- Powered by HelloHumans Agent -->
          <div class="flex justify-center items-center flex-[0_0_48px]">
               <a
                    href="https://hellohumans.fr"
                    target="_blank"
                    class="text-[#6e7a95] text-xs font-normal uppercase text-center"
               >
                    Propulsé par HelloHumans
               </a>
          </div>
     </div>
     <!-- Barre de navigation du bas (ex: Accueil, Discussion) -->
     <div class="bg-white flex flex-col px-[24px]">
          <div class="px-5 py-3 flex justify-center items-start gap-1 self-stretch border-t border-[#e2e8ef] bg-white">
               <!-- Home -->
               <button
                    @click="$emit('openChat')"
                    class="flex flex-1 flex-col items-center gap-[2px] text-[15px] font-semibold"
               >
                    <svgo-chat-icon-home class="w-[28px] h-[28px]" :style="{ fill:clientConfig.actionColor }"/>
                    <span class="text-sm text-gray-700">Accueil</span>
               </button>

               <!-- Chat -->
               <button
                    @click="$emit('openChat')"
                    @mouseover="isHovered = true"
                    @mouseleave="isHovered = false"
                    class="group flex flex-1 flex-col items-center gap-[2px] text-[15px] font-semibold text-[#647491] hover:text-gray-700"
               >
                    <svgo-chat-icon-chat class="w-[28px] h-[28px]" :style="{ fill: isHovered ? clientConfig.actionColor : '' }" />
                    <span class="text-sm">Discussion</span>
               </button>
          </div>
     </div>
</template>
<script setup lang="ts">

const props = defineProps<{
     suggestedQuestions: string[];
     clientConfig: object;
}>();

const emits = defineEmits(['sendSuggestedMessage', 'openChat']);
const isHovered = ref(false);

</script>
