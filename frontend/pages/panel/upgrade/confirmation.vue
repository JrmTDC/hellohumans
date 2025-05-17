<template>
     <div id="app-content" class="w-full h-full overflow-auto fixed left-0 top-0 z-[133] bg-white">
          <div class="flex flex-col justify-start items-[normal] h-full">
               <PanelUpgradeStepperHeader :step="4" @goStep="goStep"/>
               <div class=" flex flex-col items-center justify-center w-full h-full">
                    <div class="max-w-md text-center p-8 ">
                         <div class="border border-[4px] border-[#0569FF] w-fit rounded-[100%] p-[5px] mb-[32px] flex justify-center items-center mx-auto">
                              <svgo-panel-icon-checked class="w-[50px] h-[50px] fill-[#0569FF]" />
                         </div>
                         <h1 class="text-3xl font-semibold mb-4">{{ t('panel.pages.upgrade.confirmation.title') }}</h1>
                         <p class=" text-1xl text-gray-600 mb-6">
                              {{ t('panel.pages.upgrade.confirmation.description') }}
                         </p>
                         <p class=" font-semibold mb-4 text-gray-700 mb-6">{{ t('panel.pages.upgrade.confirmation.message') }}</p>
                         <div>
                              <NuxtLink to="/panel/" class="flex-[0_0_auto] bg-[#0569FF] border-[2px] border-[#0569FF] text-[#ffff] font-normal hover:bg-[#044bcc] hover:border-[#044bcc] bg-none border border-transparent rounded-[8px] cursor-pointer inline-block text-[18px] leading-[1.28571429] mb-0 min-w-[64px] px-[14px] py-[6px] text-center touch-manipulation select-none align-middle whitespace-nowrap">{{ t('panel.pages.upgrade.confirmation.cta') }}</NuxtLink>
                         </div>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const panelStore = usePanelStore()
const upgradeStore = useUpgradeStore()
const router = useRouter()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const subscriptionPaiement = useState('subscriptionPaiement')
const upgradeFlow = useUpgradeFlow()

onMounted(async () => {
     if(!subscriptionPaiement.value) {
          await router.push('/panel/upgrade')
     }
     if (upgradeFlow.currentStep < 2 || !subscriptionPaiement.value) {
          router.replace('/panel/upgrade')
          return
     }
     upgradeFlow.setStep(3)
     layoutLoadingPanel.value = false
})


const { pageMenuPanel, setMeta } = usePanelPageMeta()

const pageTitle = computed(() => t('panel.pages.upgrade.confirmation.metaTitle'));
const pageDescription = computed(() => t('panel.pages.upgrade.confirmation.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})

pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
