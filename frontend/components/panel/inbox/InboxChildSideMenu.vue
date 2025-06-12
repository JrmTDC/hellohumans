<template>
     <div class="relative overflow-hidden bg-[#f5f7f9] z-[1]">
          <div class=" overflow-x-hidden w-full h-full">
               <PanelCommonChildSideMenu :items="menuItems" :subs="menuSubs" />
          </div>
     </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
import MenuUnassigned from "assets/icons/panel/inbox/iconUnassigned.svg";
import MenuOpen from "assets/icons/panel/inbox/iconOpen.svg";
import MenuSolved from "assets/icons/panel/inbox/iconSolved.svg";

const menuItems = ref([
     {
          id: 'live',
          group: null,
          type: 'submenu',
          icon: null,
          routeURL: '/panel/inbox/conversations/unassigned',
          name: t('panel.components.inboxChildSideMenu.menuItems.conversations'),
          isActive: undefined,
          beta: false,
          disabled: false
     }
])
const menuSubs = ref([
     {
          sub: 'live',
          icon: rawIcon(MenuUnassigned),
          routeURL: '/panel/inbox/conversations/unassigned',
          name: t('panel.components.inboxChildSideMenu.menuSubs.unassigned'),
     },
     {
          sub: 'live',
          icon: rawIcon(MenuOpen),
          routeURL: '/panel/inbox/conversations/operatormoney(n: number',
          name: t('panel.components.inboxChildSideMenu.menuSubs.open'),
     },
     {
          sub: 'live',
          icon: rawIcon(MenuSolved),
          routeURL: '/panel/inbox/conversations/solved',
          name: t('panel.components.inboxChildSideMenu.menuSubs.solved'),
     },
])
const { pageHeaderTitle, pageHeaderBilled, pageHeaderPaid, pageMenuPanel, setMeta } = usePanelPageMeta()
const pageTitle = computed(() => t('panel.components.inboxChildSideMenu.metaTitle'));
const pageDescription = computed(() => t('panel.components.inboxChildSideMenu.metaDescription'));

watchEffect(() => {
     setMeta({
          title: pageTitle.value,
          description: pageDescription.value
     });
})
watch(() =>  t('panel.components.inboxChildSideMenu.title'), (newValue) => {
     pageHeaderTitle.value = newValue
})
pageHeaderTitle.value = t('panel.components.inboxChildSideMenu.title')
pageHeaderBilled.value = false
pageHeaderPaid.value = false
pageMenuPanel.value = true
</script>
