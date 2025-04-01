<template>
     <div
          class="flex flex-row justify-start items-center bg-white flex-grow-0 flex-shrink-0 px-[20px] sticky top-0 z-[5] border-b border-[#e2e8ef] h-[64px]"
     >
          <h2 class="mt-0 mb-0 font-semibold text-[18px] leading-[24px] tracking-[-0.01em]">
               Mettre à niveau
          </h2>
          <span class="block w-[24px] min-w-[24px] h-[24px] min-h-[24px] ml-0"></span>

          <div class="flex flex-row gap-[8px] ml-0 items-center">
               <!-- ÉTAPE 1 -->
               <div class="flex flex-row items-center">
                    <div
                         class="text-[12px] w-[24px] h-[24px] flex justify-center items-center font-semibold rounded-full text-white cursor-pointer"
                         :class="{
            'bg-[#0566ff]': step === 1,
            'bg-[#34b857]': step > 1,
            'bg-[#d3dbe5] text-[#647491]': step < 1
          }"
                         @click="$emit('goStep', 1)"
                         title="Revenir à l'étape 1"
                    >
                         <!-- S’il est validé (step > 1), on peut mettre un icône check -->
                         <template v-if="step > 1">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   fill="none"
                                   viewBox="0 0 24 24"
                                   stroke-width="2"
                                   stroke="white"
                                   class="w-4 h-4"
                              >
                                   <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                   />
                              </svg>
                         </template>
                         <template v-else>1</template>
                    </div>
                    <div
                         :class="[
            'text-[14px] leading-[18px] tracking-[-0.01em] font-medium ml-[8px]',
            step === 1 ? 'text-[#080f1a]' : 'text-[#647491]'
          ]"
                    >
                         Offre
                    </div>
               </div>

               <div class="bg-[#acb8cb] w-[24px] h-[2px] rounded-[1px]"></div>

               <!-- ÉTAPE 2 -->
               <div class="flex flex-row items-center">
                    <div
                         class="text-[12px] w-[24px] h-[24px] flex justify-center items-center font-semibold rounded-full cursor-pointer"
                         :class="{
            'bg-[#0566ff] text-white': step === 2,
            'bg-[#34b857] text-white': step > 2,
            'border-[#d3dbe5] border-[2px] text-[#647491]': step < 2
          }"
                         @click="step > 1 ? $emit('goStep', 2) : null"
                         title="Aller à l'étape 2"
                    >
                         <template v-if="step > 2">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   fill="none"
                                   viewBox="0 0 24 24"
                                   stroke-width="2"
                                   stroke="white"
                                   class="w-4 h-4"
                              >
                                   <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                   />
                              </svg>
                         </template>
                         <template v-else>2</template>
                    </div>
                    <div
                         :class="[
            'text-[14px] leading-[18px] tracking-[-0.01em] font-medium ml-[8px]',
            step === 2 ? 'text-[#080f1a]' : 'text-[#647491]'
          ]"
                    >
                         Modules
                    </div>
               </div>

               <div class="bg-[#acb8cb] w-[24px] h-[2px] rounded-[1px]"></div>

               <!-- ÉTAPE 3 -->
               <div class="flex flex-row items-center">
                    <div
                         class="text-[12px] w-[24px] h-[24px] flex justify-center items-center font-semibold rounded-full cursor-pointer"
                         :class="{
            'bg-[#0566ff] text-white': step === 3,
            'bg-[#34b857] text-white': step > 3,
            'border-[#d3dbe5] border-[2px] text-[#647491]': step < 3
          }"
                         @click="step > 2 ? $emit('goStep', 3) : null"
                         title="Aller à l'étape 3"
                    >
                         <template v-if="step > 3">
                              <svg
                                   xmlns="http://www.w3.org/2000/svg"
                                   fill="none"
                                   viewBox="0 0 24 24"
                                   stroke-width="2"
                                   stroke="white"
                                   class="w-4 h-4"
                              >
                                   <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M4.5 12.75l6 6 9-13.5"
                                   />
                              </svg>
                         </template>
                         <template v-else>3</template>
                    </div>
                    <div
                         :class="[
            'text-[14px] leading-[18px] tracking-[-0.01em] font-medium ml-[8px]',
            step === 3 ? 'text-[#080f1a]' : 'text-[#647491]'
          ]"
                    >
                         Paiement
                    </div>
               </div>
          </div>

          <div class="flex flex-grow ml-0"></div>

          <!-- Bouton de fermeture -->
          <button
               class="bg-transparent border-0 inline-flex shadow-none outline-none px-[4px] py-0 items-center justify-center cursor-pointer rounded-[4px] text-current w-[30px] h-[30px] hover:bg-[#dce9ff] group"
               @click="$emit('close')"
          >
               <svgo-panel-icon-cross
                    class="w-[22px] h-[22px] fill-[#647491] group-hover:fill-[#0566ff]"
               />
          </button>
     </div>
</template>

<script setup lang="ts">
import { } from 'vue'

const props = defineProps({
     step: {
          type: Number,
          default: 1
     }
})

const emit = defineEmits(['goStep', 'close'])
</script>
