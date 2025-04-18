<template>
     <PanelCommonLoadingOverlay v-if="isChecking" :progress="progress" />
     <LayoutAccountBlocked v-else-if="isAccountBlocked" />
     <div id="hellohumans-panel" v-else class="flex flex-col h-screen">
          <div class="app-container flex items-stretch flex-[1_1_100%] flex-row overflow-hidden relative">
               <div class="app-content">
                    <slot />
               </div>
          </div>
     </div>
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
const isAccountBlocked = ref(false)
const progress = ref(0)

// États de page récupérés depuis le composable global
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel } = usePanelPageMeta()

onMounted(async () => {
     const steps = [10, 30, 60, 100]
     let index = 0

     const interval = setInterval(() => {
          if (progress.value < 95) {
               progress.value = steps[index++] ?? 95
          }
     }, 500)

     const ok = await panelStore.initPanelSession()
     isAccountBlocked.value = panelStore.user?.blocked || false

     console.log(router.currentRoute.value.path)
     if(panelStore.user?.blocked === false) {
          if (!panelStore.client || !panelStore.project || !panelStore.project?.subscription || panelStore.project?.subscription.status == 'inactive') {

               if(router.currentRoute.value.path !== '/panel/onboarding'){
                    await router.push('/panel/onboarding')
               }

               if(panelStore.client && panelStore.project && router.currentRoute.value.path !== '/panel/upgrade'){
                    await router.push('/panel/upgrade')
               }
          }
     }
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
