<template>
     <div
          id="hellohumans-panel-modal"
          class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[132] flex items-center justify-center"
          :class="['transition-opacity duration-[150ms] ease-linear backdrop-blur-sm', show ? 'opacity-100' : 'opacity-0']"
     >
          <div class="m-auto transition duration-300 ease-out outline-none" :class="[show ? 'translate-y-0' : 'translate-y-[-25%]']">
               <div class="m-auto w-[min(-32px+100vw,500px)] h-auto">
                    <div class="p-[32px_32px_24px] flex flex-col items-center bg-white relative rounded-[8px]">
                         <!-- Slot pour contenu -->
                         <div class="w-full">
                              <slot />
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const show = ref(false)
onMounted(() => {
     setTimeout(() => (show.value = true), 100)
})
</script>
