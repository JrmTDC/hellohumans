<template>
     <div v-if="show" id="hellohumans-panel-modal" class="fixed inset-0 bg-[rgba(8,15,26,0.8)] z-[800] flex items-center justify-center p-[30px]" :class="['transition-opacity duration-[150ms] ease-linear backdrop-blur-sm', show ? 'opacity-100' : 'opacity-0']">
          <div class="m-auto transition duration-300 ease-out outline-none" :class="[show ? 'translate-y-0' : 'translate-y-[-25%]']">
               <div class="m-auto w-[min(-32px+100vw,500px)] h-auto">
                    <div class="flex flex-col items-center bg-white relative rounded-[8px]">

                         <!-- Close button -->
                         <button @click="closeModal()" class="absolute bg-white rounded-full border-[3px] border-white shadow-[0px_8px_20px_rgba(0,20,51,0.24)] cursor-pointer flex items-center justify-center w-[36px] h-[36px] top-[-12px] right-[-12px] hover:bg-[#dce9ff]">
                              <svgo-panel-icon-cross class="w-[22px] h-[22px] fill-[#647491]" />
                         </button>
                         <!-- Slot pour contenu -->
                         <slot :close="closeModal" :redirect="handleRedirect" />
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const router = useRouter()
const props = defineProps({
     modalId: {
          type: String,
          required: true
     },
     delay: {
          type: Number,
          default: 1000
     }
})

const emit = defineEmits(['close', 'redirect'])

const show = ref(false)
const modalShownKey = `modal_shown_${props.modalId}`

onMounted(() => {
     const hasModalBeenShown = localStorage.getItem(modalShownKey)
     if (!hasModalBeenShown) {
          setTimeout(() => {
               show.value = true
          }, props.delay)
     }
})

const closeModal = () => {
     localStorage.setItem(modalShownKey, 'true')
     emit('close')
     show.value = false
}

const handleRedirect = (to: string) => {
     if (to) {
          router.push(to)
     }
     closeModal()
}

</script>
