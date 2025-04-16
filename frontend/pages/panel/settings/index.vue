<template>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()
router.push("/panel/settings/chat/appearance")
usePanelPageMeta( t('panel.pages.settings.index.metaTitle'), t('panel.pages.settings.index.metaDescription'))
</script>
