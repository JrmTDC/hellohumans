<template>
     <div id="hellohumans-panel-modal" class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[132] flex items-center justify-center p-[30px]" :class="['transition-opacity duration-[150ms] ease-linear backdrop-blur-sm', show ? 'opacity-100' : 'opacity-0']">
          <div class="m-auto transition duration-300 ease-out outline-none" :class="[show ? 'translate-y-0' : 'translate-y-[-25%]']">
               <div class="m-auto w-[min(-32px+100vw,500px)] h-auto">
                    <div class="flex flex-col items-center bg-white relative rounded-[8px]">
                         <!-- Image -->
                         <img src="public/assets/img/modules/ads_guideplus.png" alt="Image" class="w-full rounded-t-[8px]" />

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

const { t } = useI18n()
const emit = defineEmits(['close'])

const show = ref(false)
onMounted(() => {
     setTimeout(() => (show.value = true), 100)
})
</script>
