<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <PanelCommonChildSideMenu :items="menuItems" :groups="menuGroups" />
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import MenuAppearance from "assets/icons/panel/settings/iconMenuAppearance.svg";
import MenuSetup from "assets/icons/panel/settings/iconMenuSetup.svg";
import MenuTranslation from "assets/icons/panel/settings/iconMenuTranslation.svg";
const menuGroups = ref([
     { id: 'chat', name: t('panel.components.settingsChildSideMenu.menuGroups.chat') },
     { id: 'settings', name: t('panel.components.settingsChildSideMenu.menuGroups.settings') }
])
const menuItems = ref([
     { group:'chat', type: 'link', icon: rawIcon(MenuAppearance), routeURL: '/panel/settings/chat/appearance', name: t('panel.components.settingsChildSideMenu.chat.appearance') },
     { group:'chat', type: 'link', icon: rawIcon(MenuSetup), routeURL: '/panel/', name: t('panel.components.settingsChildSideMenu.chat.installa') },
     { group:'chat', type: 'link', icon: rawIcon(MenuTranslation), routeURL: '/panel/', name: t('panel.components.settingsChildSideMenu.chat.translations') },
     { group:'settings',  type: 'link', icon: rawIcon(MenuAppearance), routeURL: '/panel/', name: t('panel.components.settingsChildSideMenu.settings.teste') }
])
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.components.settingsChildSideMenu.metaTitle'));
const pageDescription = computed(() => t('panel.components.settingsChildSideMenu.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.components.settingsChildSideMenu.title'), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.components.settingsChildSideMenu.title')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>
