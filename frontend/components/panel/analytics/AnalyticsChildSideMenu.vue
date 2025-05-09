<!-- components/AnalysisSidebar.vue -->
<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <div class="min-w-full table min-h-full h-full">
                    <PanelCommonChildSideMenu :items="menuItems"/>
               </div>
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import iconTemp from "assets/icons/panel/iconUsageMenu.svg";
const menuItems = ref([
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/analytics', name: t('panel.components.analyticsChildSideMenu.menu.page1') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/analytic', name: t('panel.components.analyticsChildSideMenu.menu.page2') },
])
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.components.analyticsChildSideMenu.metaTitle'));
const pageDescription = computed(() => t('panel.components.analyticsChildSideMenu.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.components.analyticsChildSideMenu.title'), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.components.analyticsChildSideMenu.title')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>

