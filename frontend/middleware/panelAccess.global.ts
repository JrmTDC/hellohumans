export default defineNuxtRouteMiddleware(async (to, from) => {
     const isAccountBlocked = useState('isAccountBlocked', () => false)
     const isStopped = useState('isStopped', () => false)
     if (to.meta.layout === 'panel') {
          const panelStore = usePanelStore()

          // Init session si nécessaire
          if (!panelStore.user) {
               await panelStore.initPanelAccessSession()
          }

          // Vérification de l'authentification
          if (!panelStore.user) {
               isStopped.value = true
               return navigateTo('/panel/login')
          }

          // Si utilisateur bloqué
          if (panelStore.user?.blocked) {
               isAccountBlocked.value = true
               return
          }

          // Redirection si onboarding nécessaire
          if (!panelStore.client || !panelStore.project) {
               isStopped.value = true
               if (to.path !== '/panel/onboarding') {
                    return navigateTo('/panel/onboarding')
               }
          }

          // Redirection si upgrade requis
          const isUpgradePage = ['/panel/upgrade', '/panel/upgrade/modules'].includes(to.path)
          if (panelStore.project?.subscription?.status != 'inactive' && panelStore.project?.subscription?.status != 'trialing' && panelStore.project?.subscription?.status != 'free') {
               isStopped.value = true
             if(!isUpgradePage) {
                    return navigateTo('/panel/upgrade')
               }
          }
     }
})
