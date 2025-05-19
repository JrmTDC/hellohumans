<template>
     <div id="hellohumans-simulateVisitor" class="bg-no-repeat bg-[position:center_140px] absolute bg-[rgb(228,230,235)] bg-[position:center_50px] h-full w-full " :style="{ backgroundImage: `url('${backgroundPlaceHodlder}')`}">
          <ChatModalModulesModalRandoMore
               v-if="showModuleRandoMoreModal"
               @close="showModuleRandoMoreModal = false" />
          <div class="p-[5px]">
               <button class="bg-[rgb(255,221,167)] text-[rgb(58,35,0)] rounded-[8px] px-[20px] py-[10px] text-[16px] font-medium leading-[24px] tracking-[-0.01em] flex items-center justify-center gap-2 flex items-center mx-auto" @click="showModuleRandoMoreModal = true">
                    <span>Modal Test</span>
               </button>
          </div>
          <Chat :clientConfig="clientConfig" />
     </div>
</template>
<script setup lang="ts">

const { t } = useI18n()
const panelStore = usePanelStore()
const layoutLoadingPanel = useState('layoutLoadingPanel')
const backgroundPlaceHodlder = useSvgBase64Loader('panel/simulateVisitor/backgroundPlaceHolder')
const chatStore = useChatStore()
const showModuleRandoMoreModal = ref(false)
onMounted(async () => {
     setTimeout(() => {
          layoutLoadingPanel.value = false
          chatStore.fetchConfig()
     }, 400)
})

const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()

const pageTitle = computed(() => t('panel.pages.dashboard.metaTitle'));
const pageDescription = computed(() => t('panel.pages.dashboard.metaDescription'));
const clientConfig = computed(() => chatStore.config)

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() => t('panel.pages.dashboard.pageTitle'), (newValue) => {
     pageHeaderTitle.value = newValue
})

pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
