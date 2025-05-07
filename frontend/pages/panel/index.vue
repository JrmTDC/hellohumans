<template>
</template>

<script setup lang="ts">
const { t } = useI18n()

const { pageMenuPanel, setMeta } = usePanelPageMeta()

const pageTitle = computed(() => t('panel.pages.index.megaTitle'));
const pageDescription = computed(() => t('panel.pages.index.megaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})

pageMenuPanel.value = false

definePageMeta({
     layout: 'base'
})
</script>
