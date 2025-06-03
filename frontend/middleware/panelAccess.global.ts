export default defineNuxtRouteMiddleware(async (to, from) => {
     const isAccountBlocked = useState('isAccountBlocked', () => false)
     const isAccountError = useState('isAccountError', () => false)
     const isStopped = useState('isStopped', () => false)

     if (to.meta.layout === 'panel' || to.meta.layout === 'base' ) {
          const panelStore = usePanelStore()

          try {
               // Init session si nécessaire
               if (!panelStore.user || !panelStore.project) {
                    const ok = await panelStore.initPanelAccessSession()
                    if (!ok) {
                         isAccountBlocked.value = true
                         return
                    }
               }

               // Utilisateur bloqué
               if (panelStore.user?.blocked) {
                    isAccountBlocked.value = true
                    return
               }

               // Si projet manquant → onboarding
               if (!panelStore.project) {
                    isStopped.value = true
                    if (to.path !== '/panel/onboarding') {
                         return navigateTo('/panel/onboarding')
                    }
                    return
               }

               // Si l’abonnement est manquant ou inactif → upgrade
               const subStatus = panelStore.project.subscription?.status || 'inactive'
               const isUpgradePage = ['/panel/upgrade', '/panel/upgrade/modules', '/panel/upgrade/confirmation'].includes(to.path)

               if (['inactive'].includes(subStatus)) {
                    isStopped.value = true
                    if (!isUpgradePage) {
                         return navigateTo('/panel/upgrade')
                    }
               }
          } catch (err) {
               console.error('Erreur dans le middleware panelAccess:', err)
               return navigateTo('/panel/login')
          }
     }
})
