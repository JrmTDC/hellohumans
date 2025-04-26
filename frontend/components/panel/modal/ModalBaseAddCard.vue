<template>
     <div id="hellohumans-panel-modal" class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[132] flex items-center justify-center backdrop-blur-sm bg" :class="['transition-opacity duration-[150ms] ease-linear', show ? 'opacity-100' : 'opacity-0']">
          <div class="transition duration-300 ease-out outline-none py-8 flex items-center justify-center h-screen w-full overflow-auto" :class="[show ? 'translate-y-0' : 'translate-y-[-25%]']">
               <div class="m-auto bg-[#fff] relative z-50 w-full max-w-screen border shadow-md dark:shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-[0%] data-[state=closed]:slide-out-to-top-[0%] data-[state=open]:slide-in-from-left-[0%] data-[state=open]:slide-in-from-top-[0%] sm:rounded-lg md:w-full bg-dash-sidebar sm:align-middle sm:w-full sm:max-w-lg">
                    <div class="flex flex-col gap-1.5 text-center sm:text-left py-4 px-4 md:px-5 border-b">
                         <h2 class="text-base leading-none font-normal">{{ title }}</h2>
                    </div>
                    <!-- Close button -->
                    <button @click="emit('close')" class="absolute right-4 top-4 rounded-sm opacity-20 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-foreground-muted">
                         <svgo-panel-icon-cross class="w-[22px] h-[22px] fill-[#647491]" />
                    </button>

                    <!-- Slot pour contenu -->
                    <slot />
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
