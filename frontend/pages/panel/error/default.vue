﻿<template>
     <div>
          <h1>{{ t('panel.pages.error.default.title') }}</h1>
          <p>{{ t('panel.pages.error.default.description') }}</p>
          <nuxt-link to="/">{{ t('panel.pages.error.default.backToHome') }}</nuxt-link>
     </div>
</template>

<script setup lang="ts">
import {computed} from "vue";

const { t } = useI18n()
const { setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.pages.error.default.metaTitle'));
const pageDescription = computed(() => t('panel.pages.error.default.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
</script>
