<template></template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()
router.push("/panel/customers/visitors")

const { pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.pages.customers.metaTitle'));
const pageDescription = computed(() => t('panel.pages.customers.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})

pageMenuPanel.value = false

definePageMeta({
     layout: 'panel'
})
</script>
