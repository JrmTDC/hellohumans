export default defineNuxtRouteMiddleware(async (to, from) => {
     if (to.meta.layout === 'panel') {
          const panelStore = usePanelStore()

          // Init session si nécessaire
          if (!panelStore.user || !panelStore.client || !panelStore.project) {
               await panelStore.initPanelAccessSession()
          }

          // Redirection si utilisateur bloqué
          if (panelStore.user?.blocked) {
               return navigateTo('/panel/login')
          }

          // Redirection si onboarding nécessaire
          if (!panelStore.client || !panelStore.project) {
               if (to.path !== '/panel/onboarding') {
                    return navigateTo('/panel/onboarding')
               }
          }

          // Redirection si upgrade requis
          const isUpgradePage = ['/panel/upgrade', '/panel/upgrade/modules'].includes(to.path)
          if (panelStore.project?.subscription?.status === 'inactive' && !isUpgradePage) {
               return navigateTo('/panel/upgrade')
          }
     }
})
