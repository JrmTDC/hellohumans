<template>
     <nav class="app-nav z-[99] text-[#8796af] flex flex-row items-stretch justify-start">
          <ul class="w-[65px] border-r border-[#e2e8ef] m-0 p-[4px] list-none bg-[#f5f7f9] flex flex-col z-[10]">

               <!-- Éléments du haut -->
               <li v-for="item in topItems" :key="item.route">
                    <PanelCommonTooltip :text="item.tooltip" left-ajust="-10" placement="right" variant="blue">
                         <NuxtLink v-if="item.type === 'link'" :to="item.route" :class="{ 'text-white bg-[#dce9ff]': $route.path === item.route }" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative hover:bg-[#e2e8ef]" @mouseover="hoveredItem = item.icon" @mouseleave="hoveredItem = null">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[24px] h-[24px] hover:fill-[rgb(0,20,51)]" />
                              </span>
                         </NuxtLink>
                         <button v-else @click="toggleMenu" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[32px] h-[32px] hover:fill-[rgb(0,20,51)]" />
                              </span>
                         </button>
                    </PanelCommonTooltip>

               </li>

               <!-- Séparateur -->
               <div class="m-auto"></div>

               <!-- Éléments du bas -->
               <li v-for="item in bottomItems" :key="item.route">
                    <PanelCommonTooltip :text="item.tooltip" left-ajust="-10" placement="right" variant="blue">
                         <NuxtLink v-if="item.type === 'link'" :to="item.route" :class="{ 'text-white bg-[#dce9ff]': $route.path === item.route }" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative hover:bg-[#e2e8ef]" @mouseover="hoveredItem = item.icon" @mouseleave="hoveredItem = null">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[24px] h-[24px] hover:fill-[rgb(0,20,51)]" />
                              </span>
                         </NuxtLink>
                         <button v-else @click="toggleSideMenuUser" class="nav-link w-[56px] h-[56px] rounded-[12px] border-[4px] border-[#f5f7f9] block text-center relative">
                              <span class="absolute inset-0 outline-none flex items-center justify-center flex-col">
                                   <component :is="item.icon" class="fill-[rgb(53,72,105)] w-[32px] h-[32px] hover:fill-[rgb(0,20,51)]" />
                              </span>
                         </button>
                    </PanelCommonTooltip>
               </li>
          </ul>
          <PanelLayoutSideMenu
               v-if="showSideUserMenu"
               @closeSideUserMenu="showSideUserMenu = false"
               @openCreateClient="handleCreateClient"
               @openCreateProjectModal="openCreateProjectModal" />
     </nav>
     <PanelModalCreateProject
          v-if="showCreateProjectModal"
          @close="showCreateProjectModal = false"
          @create="handleCreateProject"
     />
</template>

<script setup lang="ts">
import iconMenuLogo from '~/assets/icons/panel/logoHelloHumansMini.svg'
import iconMenuRobot from '~/assets/icons/panel/iconMenuRobot.svg'
import iconMenuFlow from '~/assets/icons/panel/iconMenuFlow.svg'
import iconMenuSetting from '~/assets/icons/panel/iconMenuSetting.svg'
import iconUserPicture from '~/assets/icons/panel/iconMenuUserPicture.svg'
import iconMenuModule from '~/assets/icons/panel/iconMenuModule.svg'
import iconMenuBulb from '~/assets/icons/panel/iconMenuBulb.svg'
import iconMenuAnalytic from '~/assets/icons/panel/iconMenuAnalytic.svg'

const { t } = useI18n()
const router = useRouter()

/*
     { position: 'bottom', type: 'link', icon: rawIcon(iconMenuBulb), route: '/panel/getting-started', tooltip: t('panel.components.layout.menuNavPage.gettingStarted') },
     { position: 'bottom', type: 'link', icon: rawIcon(iconMenuModule), route: '/panel/integrations', tooltip: t('panel.components.layout.menuNavPage.integrations') },
 */
const menuItems = ref([
     { position: 'top', type: 'link', icon: rawIcon(iconMenuLogo), route: '/panel/dashboard', tooltip: t('panel.components.layout.menuNavPage.dashboard'), tooltipKey: 'panel.components.layout.menuNavPage.dashboard' },
     { position: 'top', type: 'link', icon: rawIcon(iconMenuFlow), route: '/panel/', tooltip: t('panel.components.layout.menuNavPage.siteAnalysis'), tooltipKey: 'panel.components.layout.menuNavPage.siteAnalysis' },
     { position: 'top', type: 'link', icon: rawIcon(iconMenuAnalytic), route: '/panel/analytics/', tooltip: t('panel.components.layout.menuNavPage.analytics'), tooltipKey: 'panel.components.layout.menuNavPage.analytics' },
     { position: 'bottom', type: 'link', icon: rawIcon(iconMenuSetting), route: '/panel/settings/chat/appearance', tooltip: t('panel.components.layout.menuNavPage.settings'), tooltipKey: 'panel.components.layout.menuNavPage.settings' },
     { position: 'bottom', type: 'button', icon: rawIcon(iconUserPicture), route: null, tooltip: t('panel.components.layout.menuNavPage.account'), tooltipKey: 'panel.components.layout.menuNavPage.account' }
])

// Watch pour mettre à jour les tooltips lors du changement de langue
watch(() => t('panel.components.layout.menuNavPage.dashboard'), () => {
     menuItems.value = menuItems.value.map(item => ({
         ...item,
         tooltip: t(item.tooltipKey)
     }))
})


// Séparer les éléments "top" et "bottom"
const topItems = computed(() => menuItems.value.filter(item => item.position === 'top'))
const bottomItems = computed(() => menuItems.value.filter(item => item.position === 'bottom'))

const hoveredItem = ref(null)
const showSideUserMenu = ref(false)
const showCreateProjectModal = ref(false)

const openCreateProjectModal = () => {
     showCreateProjectModal.value = true
     showSideUserMenu.value = false // Ferme le menu utilisateur
}

const toggleSideMenuUser = () => {
     showSideUserMenu.value = !showSideUserMenu.value
}

const onboardingStore = useOnboardingStore()

const handleCreateProject = async (website: string) => {
     onboardingStore.prepareNewFromDashboard({ webSite: website })
     await router.push('/panel/onboarding')
     showCreateProjectModal.value = false
}

const handleCreateClient = () => {
     onboardingStore.prepareNewFromDashboard({ newClient: true })
     router.push('/panel/onboarding')
}
</script>
