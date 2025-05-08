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
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/analysis', name: t('panel.components.common.analysisChildSideMenu.menu.page1') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/analysis/pageUrls', name: t('panel.components.common.analysisChildSideMenu.menu.page2') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/analysis/contenu', name: t('panel.components.common.analysisChildSideMenu.menu.page3') },
     { type: 'link', icon: rawIcon(iconTemp), routeURL: '/panel/analysis/questions', name: t('panel.components.common.analysisChildSideMenu.menu.page4') }
])
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.components.common.analysisChildSideMenu.metaTitle'));
const pageDescription = computed(() => t('panel.components.common.analysisChildSideMenu.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.components.common.analysisChildSideMenu.title'), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.components.common.analysisChildSideMenu.title')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>

