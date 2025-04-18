<template>
     <div>
     </div>
</template>
<script setup lang="ts">
const { t } = useI18n()

const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.settings.chat.appearance.metaTitle'),
     description: t('panel.pages.settings.chat.appearance.metaDescription')
})
pageHeaderTitle.value = 'Paramètres'
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true

definePageMeta({
     layout: 'panel'
})
</script>
