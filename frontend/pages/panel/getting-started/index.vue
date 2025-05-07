<template>
     <div id="app-content">
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()
const layoutLoadingPanel = useState('layoutLoadingPanel')

onMounted(async () => {
     layoutLoadingPanel.value = false
})

const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()

const pageTitle = computed(() => t('panel.pages.gettingStarted.index.metaTitle'));
const pageDescription = computed(() => t('panel.pages.gettingStarted.index.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() => t('panel.pages.dashboard.pageTitle'), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.pages.gettingStarted.index.pageTitle')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true

definePageMeta({
     layout: 'panel'
})
</script>
