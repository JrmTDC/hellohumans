<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <PanelCommonChildSideMenu :items="menuItems" :groups="menuGroups" :subs="menuSubs" />
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import MenuChat from "assets/icons/panel/settings/iconMenuChat.svg";
import MenuAppearance from "assets/icons/panel/settings/iconMenuAppearance.svg";
import MenuSetup from "assets/icons/panel/settings/iconMenuSetup.svg";
import MenuTranslation from "assets/icons/panel/settings/iconMenuTranslation.svg";
import MenuBilling from "assets/icons/panel/settings/iconMenuBilling.svg";
import MenuPreferences from "assets/icons/panel/settings/iconMenuPreferences.svg";

const menuGroups = ref([
     {
          id: 'chats',
          name: t('panel.components.settingsChildSideMenu.menuGroups.chat')
     },
     {
          id: 'projects',
          name: 'Projet'
     }
])
const menuItems = ref([
     {
          id: 'chat',
          group:'chats',
          type: 'submenu',
          icon: rawIcon(MenuChat),
          routeURL: '/panel/settings/chat/appearance',
          name: "Chat en direct",
          isActive: undefined,
          beta: false,
          disabled: false
     },
     {
          id: 'project-billing',
          group:'projects',
          type: 'link',
          icon: rawIcon(MenuBilling),
          routeURL: '/panel/settings/billing/subscription',
          name: 'Facturation',
          isActive: undefined,
          beta: false,
          disabled: false
     },
     {
          id: 'project-settings',
          group:'projects',
          type: 'link',
          icon: rawIcon(MenuPreferences),
          routeURL: '/panel/settings/preferences',
          name: 'Préférances',
          isActive: undefined,
          beta: false,
          disabled: false
     }
])
const menuSubs = ref([
     {
          sub: 'chat',
          icon: rawIcon(MenuAppearance),
          routeURL: '/panel/settings/chat/appearance',
          name: t('panel.components.settingsChildSideMenu.chat.appearance'),
     },
     {
          sub: 'chat',
          icon: rawIcon(MenuSetup),
          routeURL: '/panel/settings/installation',
          name: t('panel.components.settingsChildSideMenu.chat.installa'),
     },
     {
          sub: 'chat',
          icon: rawIcon(MenuTranslation),
          routeURL: '/panel/settings/translations',
          name: t('panel.components.settingsChildSideMenu.chat.translations'),
     },
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
