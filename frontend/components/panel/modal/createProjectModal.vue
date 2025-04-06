<template>
     <div id="hellohumans-panel-modal" class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[132] flex items-center justify-center p-[30px]" :class="['transition-opacity duration-[150ms] ease-linear', showModal ? 'opacity-100' : 'opacity-0']">
          <div class="opacity-100 m-auto transition duration-300 ease-out outline-non" :class="[showModal ? 'translate-y-0' :  'translate-y-[-25%]']">
               <div class="w-[min(-32px+100vw,500px)] h-auto">
                    <div class="p-[40px_64px_32px] flex flex-col items-center bg-white relative rounded-[8px]">
                         <header class="text-center mb-[24px] w-full">
                              <div class="flex flex-col justify-start items-center">
                                   <h2 class="mt-0 mb-0 font-semibold text-[32px] leading-[41px] tracking-[-0.01em]">Nouveau projet</h2>
                              </div>
                         </header>
                         <button @click="close" class="outline-none absolute bg-white rounded-full border-[3px] border-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] cursor-pointer flex items-center justify-center p-0 z-[10] w-[36px] h-[36px] top-[-12px] right-[-12px] hover:bg-[#dce9ff]">
                              <svgo-panel-icon-cross class="w-[22px] h-[22px] fill-[#647491]" />
                         </button>
                         <div class="w-full pt-[16px]">
                              <form @submit.prevent="submit">
                                   <div class="hhcss_1iwez1q text-[16px] leading-[20px] tracking-[-0.01em] w-full text-left text-[#647491] relative mb-[-4px] group">
                                        <label class="flex flex-col relative font-normal max-w-full">
                                             <span class="hhcss_e1uwiaj07 self-start inline-block text-[12px] leading-[16px] tracking-[-0.01em] px-[8px] pb-[2px] pt-0 ml-[8px] bg-white absolute top-0 translate-y-[-7px] transition-transform duration-[100ms] rounded-[4px] group-focus-within:text-[#0566ff]" :class="['',urlError ? 'text-[#e81332]' : 'text-[#647491]']"  >URL de votre site</span>
                                        </label>
                                        <input v-model="url"
                                               type="text"
                                               class="order-2 block w-full text-[16px] leading-[20px] tracking-[-0.01em] h-[51px] text-[#080f1a] border-2 border-solid rounded-[8px] px-[14px] py-[16px] outline-none focus:border-[#0566ff]" :class="[urlError ? 'border-[#e81332]' : 'border-[#d3dbe5]']">
                                        <span v-if="!urlError" class="text-[12px] leading-[16px] tracking-[-0.01em] text-[#647491] pt-[4px] pr-[12px] pb-0 pl-[14px] block">par exemple, monsiteweb.com</span>
                                        <span v-if="urlError" class="text-[12px] leading-[16px] tracking-[-0.01em] pt-[4px] pr-[12px] pb-0 pl-[14px] block text-[#e81332]">Cette URL est invalide.</span>
                                   </div>
                                   <span class="block w-[20px] min-w-[20px] h-[20px] min-h-[20px]"></span>
                                   <div class="flex flex-wrap justify-center items-center pt-[20px]">
                                        <button type="submit" class="rounded-[8px] text-[18px] h-[46px] leading-[23px] min-w-[100px] px-[20px] bg-[#0566ff] border border-[#0566ff] text-white inline-flex items-center justify-center mb-0 hover:bg-[#0049bd] hover:border-[#0049bd] hover:text-white">
                                             <span>Ajouter un projet</span>
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import {onMounted, ref} from 'vue'

const emit = defineEmits(['close', 'create'])

const url = ref('')
const urlError = ref(false)
const showModal = ref(false)

const close = () => {
     emit('close')
}

const isValidUrl = (value: string) => {
     const pattern = /^(https?:\/\/)?([a-zA-Z0-9\-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
     return pattern.test(value)
}

const submit = () => {
     if (!isValidUrl(url.value)) {
          urlError.value = true
          return
     }
     urlError.value = false
     emit('create', url.value)
     close()
}
onMounted(() => {
     setTimeout(() => {
          showModal.value = true
     }, 100)
})
</script>
