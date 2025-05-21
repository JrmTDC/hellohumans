<template>
     <PanelCommonLoadingOverlay v-if="layoutLoadingPanel" :progress="progress" />
     <PanelLayoutAccountBlocked v-if="isAccountBlocked" />
     <div v-else class="flex flex-col h-screen">
          <PanelCommonToastContainer />
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
const { t } = useI18n()
const panelStore = usePanelStore()
const router = useRouter()

const layoutLoadingPanel = useState('layoutLoadingPanel', () => true)
const isAccountBlocked = useState('isAccountBlocked', () => false)
const subscriptionPaiement = useState('subscriptionPaiement', () => false)

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

     clearInterval(interval)
     progress.value = 100

     try {
          if(!isAccountBlocked.value){
               const isStartPage = ['/panel/onboarding', '/panel/upgrade', '/panel/upgrade/modules'].includes(router.currentRoute.value.path)
               if(isStartPage){
                    await panelStore.fetchUpgrade()
               }else{
                    await panelStore.initPanelData()
               }
          }
          return
     } catch (e) {
          console.error('Erreur layout panel initPanelData:', e)
          await router.push('/panel/login')
     }
})
usePanelPageMeta().setMeta({
     title: t('panel.layout.menu.metaTitle'),
})
</script>
