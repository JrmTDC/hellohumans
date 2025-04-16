<template>
     <div>
          <h1>{{ t('panel.pages.error.default.title') }}</h1>
          <p>{{ t('panel.pages.error.default.description') }}</p>
          <nuxt-link to="/">{{ t('panel.pages.error.default.backToHome') }}</nuxt-link>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
usePanelPageMeta( t('panel.pages.error.default.metaTitle'), t('panel.pages.error.default.metaDescription'))
</script>
