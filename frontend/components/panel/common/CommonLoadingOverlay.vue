<template>
     <div id="hellohumans-loading" class="fixed inset-0 bg-[#001433] z-[2147483647] grid place-items-center transition-opacity duration-300">
          <div class="flex flex-col items-center w-[240px] text-center animate-fade-in">
               <!-- Logo qui pulse -->
               <svgo-logo-hello-humans-full class="w-auto h-[40px] fill-white animate-pulse" />

               <!-- Barre de progression -->
               <div class="progress w-full h-[12px] rounded-[4px] bg-[#002661] my-6 overflow-hidden">
                    <div
                         class="progress-bar bg-[#0566ff] h-full transition-all duration-[500ms] ease-[ease]"
                         :style="`width: ${progress}%`"
                    />
               </div>

               <!-- Texte animé -->
               <transition-group name="fade" tag="div">
                    <p v-for="(msg, index) in displayedMessages" :key="index" class="text-white font-medium text-sm leading-5 mb-0 animate-fade-in">
                         {{ msg }}
                    </p>
               </transition-group>
          </div>
     </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const { t } = useI18n()

const props = defineProps<{
     progress: number
}>()

const messages = [
     t('panel.components.common.loadingOverlay.messages.int_1'),
     t('panel.components.common.loadingOverlay.messages.int_2'),
     t('panel.components.common.loadingOverlay.messages.int_3'),
     t('panel.components.common.loadingOverlay.messages.int_4')
]

const displayedMessages = ref<string[]>([])

onMounted(() => {
     let i = 0
     const interval = setInterval(() => {
          if (i < messages.length) {
               displayedMessages.value = [messages[i]]
               i++
          } else {
               clearInterval(interval)
          }
     }, 1600)
})
</script>
