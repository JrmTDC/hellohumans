<template>
     <div id="hellohumans-panel-modal" class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[132] flex items-center justify-center backdrop-blur-sm" :class="['transition-opacity duration-[150ms] ease-linear', show ? 'opacity-100' : 'opacity-0']">
          <div class="m-auto transition duration-300 ease-out outline-none" :class="[show ? 'translate-y-0' : 'translate-y-[-25%]']">
               <div class="">
                    <div class="bg-[#fff] relative z-50 w-full max-w-screen border shadow-md sm:rounded-lg md:w-full sm:align-middle sm:w-full md:max-w-3xl p-0">

                         <!-- Close button -->
                         <button @click="emit('close')" class="absolute right-4 top-4 rounded-sm opacity-20 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-foreground-muted">
                              <svgo-panel-icon-cross class="w-[22px] h-[22px] fill-[#647491]" />
                         </button>

                         <!-- Slot pour contenu -->
                         <div class="grid grid-cols-1 md:grid-cols-2 h-full items-stretch">
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
