<template>
     <PanelCommonLoadingOverlay v-if="isChecking" :progress="progress" />
     <LayoutAccountBlocked v-else-if="AccountBlocked" />
     <div v-else class="flex flex-col h-screen">
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <div class="app-content">
                    <slot />
               </div>
          </div>
     </div>
     <div v-else class="flex flex-col h-screen">
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <div class="app-content">
                    <slot />
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import LayoutAccountBlocked from '~/components//panel/layout/LayoutAccountBlocked.vue'

const { t } = useI18n()
const panelStore = usePanelStore()
const router = useRouter()

const isChecking = ref(true)
const AccountBlocked = ref(true)
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
usePanelPageMeta(t('panel.layout.empty.metaTitle'))
</script>
