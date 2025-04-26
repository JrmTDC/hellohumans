import type { RefSymbol } from '@vue/reactivity'
import { defineStore } from 'pinia'
interface ProjectSubscription {
     status: 'active' | 'inactive' | 'canceled' | string
}

interface Project {
     id: string
     name: string
     subscription?: ProjectSubscription | null
}

export interface UpgradePlan {
     id: string
     name: string
     description: string
     monthlyPrice: number
     discountMonths: number
     includedFeatures: string[]
     baseSubtitle: string
     popular?: boolean
     includedModules?: string[]
}

export interface ModuleAddOn {
     id: string
     name: string
     description: string
     basePrice: number
     discountMonths?: number
     multipleChoice?: boolean
     choices?: Array<{
          label: string
          monthlyPrice: number
          discountMonths?: number
     }>
     selectedChoiceIndex?: number
     selected: boolean
     disabled?: boolean
     comingSoon?: boolean
}
interface StripeSetupIntent {
     client_secret?: string
     payment_method_types?: string[]
}
interface StripeCustomer {
     payment_methods?: Array<{
          id: string
          brand: string
          last4: string
          exp_month: number
          exp_year: number
     }>
}

export const usePanelStore = defineStore('panel', () => {
     const supabase = useSupabaseClient()

     const user = ref<{ id: string; email: string; lang:string; selected_project_uuid:string; blocked:boolean; } | null>(null)
     const client = ref<{ id: string } | null>(null)
     const project = ref<Project | null>(null)
     const clients = ref<{ id: string; name: string }[]>([])
     const project_usages = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const project_subscription = ref<{ id: string; name: string; status: string }[]>([])
     const plans = ref<UpgradePlan[]>([])
     const availableModules = ref<ModuleAddOn[]>([])
     const modules = ref<string[]>([])
     const projects = ref<any[]>([])
     const activities = ref<any[]>([])
     const stripe_setup_intent = ref<StripeSetupIntent | null>(null)
     const stripe_customer = ref<StripeCustomer | null>(null)

     const panelReturn = ref<string | null>(null)

     async function initPanelAccessSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          panelReturn.value = null

          try {
               // 1) Vérifier la session utilisateur
               const userRes = await apiFetch('/user')
               user.value = userRes?.success?.user ?? null

               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) Récupérer les infos client, projet, etc.
               const [clientsRes, clientRes, projectRes] = await Promise.allSettled([
                    apiFetch('/clients'),
                    apiFetch('/client'),
                    apiFetch('/project'),
               ])

               // 3) Clients
               if (clientsRes.status === 'fulfilled' && clientsRes.value.success) {
                    clients.value = clientsRes.value.success.clients ?? []
               } else {
                    clients.value = []
               }

               // 4) Client courant
               if (
                    clientRes.status !== 'fulfilled' ||
                    !clientRes.value.success ||
                    !clientRes.value.success.client
               ) {
                    client.value = null
               } else {
                    client.value = clientRes.value.success.client
               }

               // 5) Projet courant
               if (
                    projectRes.status !== 'fulfilled' ||
                    !projectRes.value.success ||
                    !projectRes.value.success.project
               ) {
                    project.value = null
                    project_subscription.value = []
                    return true
               }

               const currentProject = projectRes.value.success.project
               project.value = currentProject

               // 6) Abonnement (peut être null volontairement)
               if (currentProject.subscription) {
                    project_subscription.value = [currentProject.subscription]
               } else {
                    project_subscription.value = []
               }

               return true
          } catch (err: any) {
               console.error('[initPanelAccessSession] Erreur :', err)
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

     async function fetchUpgrade(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          panelReturn.value = null
          try {
               // 1) Vérifier la session / récupérer l’utilisateur
               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) On récupère d’autres informations
               const [plansRes, modulesRes] = await Promise.all([
                    apiFetch('/upgrade/plans'),
                    apiFetch('/upgrade/modules'),
               ])
               plans.value = plansRes.success.plans || []
               availableModules.value = modulesRes.success.modules || []
               return true
          } catch (err: any) {
               await logout()
               return false
          }
     }

     async function fetchPlans(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          panelReturn.value = null
          try {
               // 1) Vérifier la session / récupérer l’utilisateur
               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) On récupère d’autres informations
               const plansRes = await apiFetch('/upgrade/plans')
               plans.value = plansRes.success.plans || []
               return true
          } catch (err: any) {
               await logout()
               return false
          }
     }

     async function fetchModules() {
          const { apiFetch } = usePanelApi()
          panelReturn.value = null
          try {
               // 1) Vérifier la session / récupérer l’utilisateur
               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) On récupère d’autres informations
               const modulesRes = await apiFetch('/upgrade/modules')
               availableModules.value = modulesRes.success.modules || []
               return true
          } catch (err: any) {
               await logout()
               return false
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

     async function fetchStripeSetupIntent() {
          const { apiFetch } = usePanelApi()
          try {
               const res = await apiFetch('/stripe/setup-intent')
               stripe_setup_intent.value = res.success.setupIntent
          } catch (error) {
               console.error('Erreur activités :', error)
          }
     }

     async function fetchStripePaymentMethods() {
          const { apiFetch } = usePanelApi()
          try {
               const res = await apiFetch('/stripe/payment-methods')
               stripe_customer.value = {
                    ...stripe_customer.value,
                    payment_methods: res.success.paymentMethods
               }
          } catch (error) {
               console.error('Erreur activités :', error)
          }
     }

     async function fetchUpgradePreview() {
          const { apiFetch } = usePanelApi()
          const res = await apiFetch('/panel/stripe/preview-upgrade', {
               method: 'POST',
          })
          return res.success
     }

     async function createOnboarding(data: Record<string, any>): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               const res = await apiFetch('/onboarding', {
                    method: 'POST',
                    body: JSON.stringify(data)
               })
               if(res.success) {
                    client.value = res.success.client
                    project.value = res.success.project
               }
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
               modules: selectedAddOns || [],
               billing_cycle: billingCycle || 'monthly'
          }

          const res = await usePanelApi().apiFetch('/stripe/create-subscription', {
               method: 'POST',
               body: JSON.stringify(payload)
          })

          if (!res.success) throw new Error('Erreur lors de la création de l’abonnement.')

          if (res.success.project.subscription.status === 'free') {
               project.value = res.success.project
               project_subscription.value = res.success.project.subscription
               return 'free'
          }

          if (res.success.subscription.status === 'active' && res.success.stripe.client_secret) {
               // Paiement via Stripe
               /*
               const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY!)

               const result = await stripe?.confirmCardPayment(res.stripe.client_secret, {
                    payment_method: {
                         card: elements.getElement(CardElement)!
                    }
               })

               if (result?.error) {
                    throw new Error(result.error.message)
               }
               */
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
          plans,
          availableModules,
          modules,
          project,
          projects,
          activities,
          stripe_setup_intent,
          stripe_customer,

          // actions
          initPanelAccessSession,
          initPanelData,
          updateUserLang,
          switchProject,
          updatePassword,
          fetchListActivity,
          createOnboarding,
          confirmUpgrade,
          fetchUpgrade,
          fetchPlans,
          fetchModules,
          fetchStripeSetupIntent,
          fetchStripePaymentMethods,
          fetchUpgradePreview,
          logout
     }
})
