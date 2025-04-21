import { defineStore } from 'pinia'

interface ProjectSubscription {
     status: 'active' | 'inactive' | 'canceled' | string
}

interface Project {
     id: string
     name: string
     subscription?: ProjectSubscription | null
}

export const usePanelStore = defineStore('panel', () => {
     const supabase = useSupabaseClient()

     const user = ref<{ id: string; email: string; lang:string; selected_project_uuid:string; blocked:boolean; } | null>(null)
     const client = ref<{ id: string } | null>(null)
     const project = ref<Project | null>(null)
     const clients = ref<{ id: string; name: string }[]>([])
     const project_usages = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const project_subscription = ref<{ id: string; name: string; status: string }[]>([])
     const modules = ref<string[]>([])
     const projects = ref<any[]>([])
     const activities = ref<any[]>([])

     const panelReturn = ref<string | null>(null)

     async function initPanelAccessSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          panelReturn.value = null
          try {
               // 1) Vérifier la session / récupérer l’utilisateur
               const userRes = await apiFetch('/user')
               user.value = userRes.success.user || null

               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) Vérifier si client et projet sont présents
               const [clientsRes, clientRes, projectRes] = await Promise.all([
                    apiFetch('/clients'),
                    apiFetch('/client'),
                    apiFetch('/project'),
               ])

               clients.value = clientsRes.success.clients || null

               if(!clientRes.success || clientRes.success.client.length === 0) {
                    client.value = null
                    return true
               }
               client.value = clientRes.success.client || null

               if(!projectRes.success || projectRes.success.project.length === 0) {
                    project.value = null
                    return true
               }
               project.value = projectRes.success.project || null

               // 3) Vérifier si le projet a une souscription valide
               if(!projectRes.success.project.subscription || projectRes.success.project.subscription.length === 0) {
                    return true
               }

               project_subscription.value = projectRes.success.project.subscription || []

               return true
          } catch (err: any) {
               await logout()
               return false
          }
     }

     async function initPanelData(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          panelReturn.value = null
          try {
               // 1) Vérifier la session / récupérer l’utilisateur
               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) On récupère d’autres informations
               const [projectsRes, usagesRes] = await Promise.all([
                    apiFetch('/projects'),
                    apiFetch('/usages'),
               ])
               project_usages.value = usagesRes.success.usages || []
               projects.value = projectsRes.success.projects || []
               modules.value = usagesRes.modules || []
               return true
          } catch (err: any) {
               await logout()
               return false
          }
     }

     async function fetchUser() {
          const { apiFetch } = usePanelApi()
          try {
               const data = await apiFetch('/me')
               user.value = data.user
          } catch (error) {
               console.error('Erreur utilisateur :', error)
          }
     }

     async function fetchUsage() {
          const { apiFetch } = usePanelApi()
          try {
               const data = await apiFetch('/usage')
               project_usages.value = data.usage || []
               project_subscription.value = data.subscription || []
               modules.value = data.modules || []
          } catch (error) {
               console.error('Erreur récupération des usages :', error)
          }
     }

     async function updateUserLang(lang: string): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               await apiFetch('/lang', {
                    method: 'POST',
                    body: JSON.stringify({ lang }),
               })
               return true
          } catch (err) {
               console.error('Erreur update lang:', err)
               return false
          }
     }

     async function switchProject(uuid: string): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               await apiFetch(`/switch-project/${uuid}`, {
                    method: 'POST'
               })

               await fetchUser()
               return true
          } catch (error) {
               console.error('Erreur switch project:', error)
               return false
          }
     }

     async function updatePassword(current: string, newPass: string) {
          try {
               // Pas de vérification du mot de passe actuel côté client
               const { data, error } = await supabase.auth.updateUser({
                    password: newPass
               })

               if (error || !data) {
                    console.error('Erreur modification mot de passe:', error)
                    return false
               }

               return true
          } catch (err) {
               console.error('Erreur updatePassword:', err)
               return false
          }
     }

     async function fetchListActivity() {
          const { apiFetch } = usePanelApi()
          try {
               const data = await apiFetch('/onboarding/activities')
               activities.value = data.success.activities
          } catch (error) {
               console.error('Erreur activités :', error)
          }
     }

     async function createOnboarding(data: Record<string, any>): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               const res = await apiFetch('/onboarding', {
                    method: 'POST',
                    body: JSON.stringify(data)
               })
               return !!res.success
          } catch (err) {
               console.error('Erreur lors de la soumission de l’onboarding :', err)
               return false
          }
     }

     async function confirmUpgrade(): Promise<'free' | 'stripe'> {
          const { selectedPlanId, selectedAddOns, billingCycle } = useUpgradeStore()

          const payload = {
               project_id: project.value?.id,
               plan_id: selectedPlanId!,
               modules: selectedAddOns.value || [],
               billing_cycle: billingCycle.value || 'monthly'
          }

          const res = await usePanelApi().apiFetch('/stripe/create-subscription', {
               method: 'POST',
               body: JSON.stringify(payload)
          })

          if (!res.success) throw new Error('Erreur lors de la création de l’abonnement.')

          if (res.mode === 'free') {
               return 'free'
          }

          if (res.mode === 'paid' && res.stripe.client_secret) {
               // Paiement via Stripe
               const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!)

               const result = await stripe?.confirmCardPayment(res.stripe.client_secret, {
                    payment_method: {
                         card: elements.getElement(CardElement)!
                    }
               })

               if (result?.error) {
                    throw new Error(result.error.message)
               }

               return 'stripe'
          }

          throw new Error('Type d’abonnement non géré.')
     }

     async function logout() {
          user.value = null
          project_usages.value = []
          project_subscription.value = []
          modules.value = []
          const isAccountBlocked = useState('isAccountBlocked', () => false)
          isAccountBlocked.value = false
          await supabase.auth.signOut()
     }

     return {
          // state
          user,
          client,
          clients,
          project_usages,
          project_subscription,
          modules,
          project,
          projects,
          activities,

          // actions
          initPanelAccessSession,
          initPanelData,
          fetchUser,
          fetchUsage,
          updateUserLang,
          switchProject,
          updatePassword,
          fetchListActivity,
          createOnboarding,
          confirmUpgrade,
          logout
     }
})
