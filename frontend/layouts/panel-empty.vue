<template>
     <div v-else class="flex flex-col h-screen">
          <PanelCommonLoadingOverlay v-if="isChecking" :progress="progress" />
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <div class="app-content">
                    <slot />
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
const panelStore = usePanelStore()
const router = useRouter()

const isChecking = ref(true)
const progress = ref(0)

onMounted(async () => {
     const steps = [10, 30, 60, 100]
     let index = 0

     const interval = setInterval(() => {
          if (progress.value < 95) {
               progress.value = steps[index++] ?? 95
          }
     }, 500)

     const ok = await panelStore.initPanelSession()

     clearInterval(interval)
     progress.value = 100
     setTimeout(() => {
          isChecking.value = false
          if (!ok) router.push('/panel/login')
     }, 400)
})
</script>
