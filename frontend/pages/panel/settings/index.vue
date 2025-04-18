<template>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()
router.push("/panel/settings/chat/appearance")

const { pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.settings.index.metaTitle'),
     description: t('panel.pages.settings.index.metaDescription')
})
pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
