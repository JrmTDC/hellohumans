<template>
     <LoadingOverlay v-if="isChecking" :progress="progress" />
     <div v-else class="flex flex-col h-screen font-[euclidcircularb,sans-serif]">
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <menuNavPage />
               <div class="app-content-wrapper items-stretch bg-[#f5f7f9] flex flex-1 flex-col justify-start max-w-[calc(100%-65px)] overflow-hidden relative">
                    <headerPage :title="pageTitle" :isBilled="pageIsBilled" :isPaid="pageIsPaid" />
                    <div class="app-content">
                         <slot />
                    </div>
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { usePanelStore } from '@/stores/panelStore'
import menuNavPage from '~/components/panel/common/menuNavPage.vue'
import headerPage from '~/components/panel/common/headerPage.vue'
import LoadingOverlay from "~/components/panel/common/loadingOverlay.vue";

const panelStore = usePanelStore()
const router = useRouter()

const isChecking = ref(true)
const progress = ref(0)

const pageTitle = useState('pageTitle')
const pageIsBilled = useState('pageIsBilled')
const pageIsPaid = useState('pageIsPaid')

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
