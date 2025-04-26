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
setMeta({
     title: t('panel.pages.gettingStarted.index.metaTitle'),
     description: t('panel.pages.gettingStarted.index.metaDescription')
})
pageHeaderTitle.value = ''
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true

definePageMeta({
     layout: 'panel'
})
</script>
