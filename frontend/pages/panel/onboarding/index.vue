<template>
     <div id="app-content" class="absolute inset-0 grid grid-cols-[1fr] h-full max-h-full overflow-hidden">
          <div class="flex flex-col justify-start items-[normal] h-full max-h-full overflow-hidden relative">
               <div class="mt-0 mb-0 flex flex-col absolute inset-0">

                    <!-- Contenu principal -->
                    <div class="overflow-auto flex flex-[1_1_0%] flex-col items-stretch bg-white scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#acb8cb]">
                         <!-- Header -->
                         <header class="h-[100px] flex-[0_0_100px] px-[40px] justify-start w-full flex items-center">
                              <svgo-logo-hello-humans-full class="w-[180px] fill-[#3886ff]" />
                              <div class="ml-auto">
                                   <PanelCommonLanguageSelector />
                              </div>
                         </header>

                         <!-- Étapes -->
                         <main class="flex flex-col gap-[24px] px-[16px] pb-[24px] mx-auto w-[840px] max-w-full flex-grow sm:gap-[40px] sm:px-[40px] sm:pb-[40px]">
                              <span class="block w-[8px] min-w-[8px] h-[8px] min-h-[8px]"></span>
                              <PanelOnboardingSteps />
                         </main>
                    </div>

                    <!-- Navigation -->
                    <PanelOnboardingNav />
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const onboardingStore = useOnboardingStore()

onMounted(async () => {
     const onboardingStore = useOnboardingStore()
     const panelStore = usePanelStore()
     if (!panelStore.activities || panelStore.activities.length === 0) {
          await panelStore.fetchListActivity()
     }
     onboardingStore.initialize()
     await nextTick()
     for (let step = 1; step <= onboardingStore.totalSteps; step++) {
          onboardingStore.validateSections(step)
     }
     onboardingStore.redirectIfInvalid()
})

const { pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.onboarding.index.metaTitle'),
     description: t('panel.pages.onboarding.index.metaDescription')
})
pageMenuPanel.value = false
definePageMeta({
     layout: 'panel',
     middleware: ['panel-access']
})
</script>
