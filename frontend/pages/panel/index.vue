<template>
</template>

<script setup lang="ts">
const { t } = useI18n()
const router = useRouter()

onMounted(async () => {
     await router.replace('/panel/dashboard')
})

const { pageMenuPanel, setMeta } = usePanelPageMeta()
setMeta({
     title: t('panel.pages.index.megaTitle'),
     description: t('panel.pages.index.megaDescription')
})
pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
