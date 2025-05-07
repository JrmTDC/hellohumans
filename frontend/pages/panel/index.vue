<template>
</template>

<script setup lang="ts">
const { t } = useI18n()

const { pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.index.megaTitle'),
     description: t('panel.pages.index.megaDescription')
})
pageMenuPanel.value = false

definePageMeta({
     layout: 'base'
})
</script>
