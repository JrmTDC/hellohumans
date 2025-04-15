<template>
     <div
          id="hellohumans-panel-modal"
          class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[132] flex items-center justify-center p-[30px]"
          :class="['transition-opacity duration-[150ms] ease-linear', show ? 'opacity-100' : 'opacity-0']"
     >
          <div class="m-auto transition duration-300 ease-out outline-none" :class="[show ? 'translate-y-0' : 'translate-y-[-25%]']">
               <div class="w-[min(-32px+100vw,500px)] h-auto">
                    <div class="p-[40px_64px_32px] flex flex-col items-center bg-white relative rounded-[8px]">
                         <!-- Header -->
                         <header class="text-center mb-[24px] w-full">
                              <div class="flex flex-col justify-start items-center">
                                   <h2 class="mt-0 mb-0 font-semibold text-[32px] leading-[41px] tracking-[-0.01em]">{{ title }}</h2>
                              </div>
                         </header>

                         <!-- Close button -->
                         <button @click="emit('close')" class="absolute bg-white rounded-full border-[3px] border-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] cursor-pointer flex items-center justify-center w-[36px] h-[36px] top-[-12px] right-[-12px] hover:bg-[#dce9ff]">
                              <svgo-panel-icon-cross class="w-[22px] h-[22px] fill-[#647491]" />
                         </button>

                         <!-- Slot pour contenu -->
                         <div class="w-full pt-[16px]">
                              <slot />
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['close'])
const props = defineProps<{ title: string }>()

const show = ref(false)
onMounted(() => {
     setTimeout(() => (show.value = true), 100)
})
</script>
