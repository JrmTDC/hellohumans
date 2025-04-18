<template>
     <PanelCommonLoadingOverlay v-if="isChecking" :progress="progress" />
     <LayoutAccountBlocked v-else-if="isAccountBlocked" />
     <div v-else class="flex flex-col h-screen">
          <div v-if="pageMenuPanel" class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <PanelLayoutMenuNavPage />
               <div class="app-content-wrapper items-stretch bg-[#f5f7f9] flex flex-1 flex-col justify-start max-w-[calc(100%-65px)] overflow-hidden relative">
                    <PanelLayoutHeaderPage :title="pageHeaderTitle" :isBilled="pageHeaderBilled" :isPaid="pageHeaderPaid" />
                    <div class="app-content">
                         <slot />
                    </div>
               </div>
          </div>
          <div v-else class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <div  class="app-content">
                    <slot />
               </div>
          </div>
     </div>
</template>
<script setup lang="ts">
import LayoutAccountBlocked from '~/components/panel/layout/LayoutAccountBlocked.vue'

const { t } = useI18n()
const panelStore = usePanelStore()
const router = useRouter()

const isChecking = ref(true)
const isAccountBlocked = useState('isAccountBlocked', () => false)
const progress = ref(0)
const { locale, setLocale } = useI18n()

// États de page récupérés depuis le composable global
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel } = usePanelPageMeta()

onMounted(async () => {
     if (panelStore.user?.lang && panelStore.user.lang !== locale.value) {
          try {
               const setClientLocale = useSetClientLocale()
               await setClientLocale(panelStore.user?.lang)
          } catch (e) {
               console.warn('[LayoutPanel] Failed to set locale:', e)
          }
     }

     const steps = [10, 30, 60, 100]
     let index = 0

     const interval = setInterval(() => {
          if (progress.value < 95) {
               progress.value = steps[index++] ?? 95
          }
     }, 500)

     const ok = await panelStore.initPanelData()

     clearInterval(interval)
     progress.value = 100
     setTimeout(() => {
          isChecking.value = false
          if (!ok) router.push('/panel/login')
     }, 400)
})
usePanelPageMeta().setMeta({
     title: t('panel.layout.menu.metaTitle'),
})
</script>
