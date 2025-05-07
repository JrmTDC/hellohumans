<template>
     <div>
          <h1>{{ t('panel.pages.error.notFound.title') }}</h1>
          <p>{{ t('panel.pages.error.notFound.description') }}</p>
          <nuxt-link to="/">{{ t('panel.pages.error.notFound.backToHome') }}</nuxt-link>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const { setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.pages.error.notFound.metaTitle'));
const pageDescription = computed(() => t('panel.pages.error.notFound.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
</script>




