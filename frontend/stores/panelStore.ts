import { defineStore } from 'pinia'
import { loadStripe } from '@stripe/stripe-js'

interface User{
     id: string;
     email: string;
     lang:string;
     selected_project_uuid:string;
     blocked:boolean;
     display_name:string;
}
interface ProjectSubscription {
     status: 'active' | 'inactive' | 'canceled' | string
}

interface Project {
     id: string
     name: string
     subscription?: ProjectSubscription | null
     website: string,
     public_key: string,
     widget_installed: boolean
}
interface UpgradePreviewResponse {
     today_amount: number
     cycle_amount: number
     ends_at: number | null
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
     includedModules?: string[],
     billingYear?: boolean
}

export interface ModuleAddOn {
     id: string
     name: string
     key: string
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
     comingSoon?: boolean,
     displayMore?: boolean
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
interface StripeSetupIntent {
     client_secret?: string
     payment_method_types?: string[]
}
interface Stripe {
     customer?: StripeCustomer
     setup_intent?: StripeSetupIntent
     preview?: any
}

interface Client {
     id: string
     name: string
}
interface Visitors {
     count: number
}
export const usePanelStore = defineStore('panel', () => {
     const supabase = useSupabaseClient()
     const chatStore = useChatStore()

     const user = ref<User | null>(null)
     const client = ref<Client | null>(null)
     const project = ref<Project | null>(null)
     const clients = ref<{ id: string; name: string }[]>([])
     const project_usages = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const project_subscription = ref<{ id: string; name: string; status: string }[]>([])
     const plans = ref<UpgradePlan[]>([])
     const modules = ref<ModuleAddOn[]>([])
     const projects = ref<any[]>([])
     const activities = ref<any[]>([])
     const visitors = ref<Visitors>( { count: 0 })
     const stripe = ref<Stripe | null>(null)
     const config = useRuntimeConfig()

     async function initPanelAccessSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
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
               //modules.value = usagesRes.modules || []
               return true
          } catch (err: any) {
               console.error('[initPanelData] Erreur :', err)
               await logout()
               return false
          }
     }

     async function fetchUpgrade(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
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
               modules.value = modulesRes.success.modules || []
               return true
          } catch (err: any) {
               await logout()
               return false
          }
     }

     async function fetchPlans(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
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
          try {
               // 1) Vérifier la session / récupérer l’utilisateur
               if (!user.value) {
                    await logout()
                    return false
               }

               // 2) On récupère d’autres informations
               const modulesRes = await apiFetch('/upgrade/modules')
               modules.value = modulesRes.success.modules || []
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

     async function switchClient(uuid: string): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               await apiFetch(`/switch-client/${uuid}`, {
                    method: 'POST'
               })
               return true
          } catch (error) {
               console.error('Erreur switch client:', error)
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
               stripe.value = {
                    ...stripe.value,
                    setup_intent: res.success.setupIntent
               }
          } catch (error) {
               console.error('Erreur activités :', error)
          }
     }

     async function fetchStripePaymentMethods() {
          const { apiFetch } = usePanelApi()
          try {
               const res = await apiFetch('/stripe/payment-methods')
               stripe.value = {
                    ...stripe.value,
                    customer: {
                         ...stripe.value?.customer,
                         payment_methods: res.success.payment_methods
                    }
               }
          } catch (error) {
               console.error('Erreur activités :', error)
          }
     }

     async function initUpgradePayment(data: Record<string, any>) {
          const { apiFetch } = usePanelApi()

          const [previewRes, methodsRes] = await Promise.all([
               apiFetch('/stripe/preview-upgrade'),
               apiFetch('/stripe/payment-methods'),
          ])
          stripe.value = {
               ...stripe.value,
               preview: previewRes.success.preview || null,
               customer: {
                    ...stripe.value?.customer,
                    payment_methods: methodsRes.success.payment_methods || []
               }
          }
     }

     async function fetchUpgradePreview(data: Record<string, any>) {
          const { apiFetch } = usePanelApi()
          const res = await apiFetch('/stripe/preview-upgrade', {
               method: 'POST',
               body: JSON.stringify(data)
          })
          stripe.value = {
               ...stripe.value,
               preview: res.success.preview || null
          }
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

     async function confirmUpgrade(paymentMethodId: string | null = null ) {
         const { selectedPlanId, selectedAddOns, billingCycle } = useUpgradeStore()
          const stripe = await loadStripe(config.public.stripeKey!)

          const payload = {
               plan_id: selectedPlanId!,
               modules: selectedAddOns.map((m) => typeof m === 'string' ? m : m.id),
               billing_cycle: billingCycle,
               payment_method_id: paymentMethodId,
          }

          const res = await usePanelApi().apiFetch('/stripe/confirm-upgrade', {
               method: 'POST',
               body: JSON.stringify(payload),
          })

          if (!res.success) throw new Error('Erreur lors de la confirmation de l’abonnement.')

          const { status, requiresAction, clientSecret } = res.success

          if (!stripe) throw new Error('Stripe non initialisé')

          if (requiresAction && clientSecret) {
               const result = await stripe.confirmCardPayment(clientSecret)
               if (result.error) throw new Error(result.error.message)
          }

          return {
               clientSecret,
               requiresAction,
               status
          }
     }

     async function reportIssue(data: Record<string, any>) {
          const { apiFetch } = usePanelApi()
          const payload = {
               type: data.type,
               description: data.description,
               screenshot: data.screenshot,
               device_name: navigator.userAgent,
               page_url: window.location.href
          }
          const res = await apiFetch('/report-issue', {
               method: 'POST',
               body: JSON.stringify(payload),
          })
          return res.success
     }

     async function saveChatConfig(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               const fullConfig = {
                    ...chatStore.configChat,
                    suggestedQuestions: chatStore.suggestions.map(({ label, enabled, order }) => ({
                         label,
                         enabled,
                         order
                    }))
               }
               const res = await apiFetch('/config-chat', {
                    method: 'POST',
                    body: JSON.stringify({ config: fullConfig }),
               })
               return !!res.success
          } catch (err) {
               console.error('Erreur sauvegarde config chat:', err)
               return false
          }
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
          modules,
          project,
          projects,
          activities,
          visitors,
          stripe,

          // actions
          initPanelAccessSession,
          initPanelData,
          updateUserLang,
          switchProject,
          switchClient,
          updatePassword,
          fetchListActivity,
          createOnboarding,
          confirmUpgrade,
          reportIssue,
          fetchUpgrade,
          fetchPlans,
          fetchModules,
          fetchStripeSetupIntent,
          fetchStripePaymentMethods,
          fetchUpgradePreview,
          saveChatConfig,
          logout
     }
})
