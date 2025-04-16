<template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const { t } = useI18n()
const router = useRouter()

onMounted(async () => {
     await router.replace('/panel/dashboard')
})
usePanelPageMeta( t('panel.pages.index.metaTitle'), t('panel.pages.index.metaDescription'))
</script>
