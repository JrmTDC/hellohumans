import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePanelApi } from '~/composables/usePanelApi'

export const usePanelStore = defineStore('panel', () => {
     const supabase = useSupabaseClient()

     const user = ref<{ uuid: string; email: string; lang:string; selected_project_uuid:string;  } | null>(null)
     const client = ref<{} | null>(null)
     const project_usages = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const subscription = ref<{ id: string; name: string; status: string }[]>([])
     const modules = ref<string[]>([])
     const project = ref<any[]>([])
     const projects = ref<any[]>([])


     async function initPanelSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          const { setLocale } = useI18n()
          try {
               const [userRes, clientRes, usagesRes, projectRes, projectsRes] = await Promise.all([
                    apiFetch('/user'),
                    apiFetch('/client'),
                    apiFetch('/usages'),
                    apiFetch('/project'),
                    apiFetch('/projects'),
               ])

               user.value = userRes.success.user
               client.value = clientRes.success.client
               project.value = projectRes.success.project
               projects.value = projectsRes.success.projects || []
               project_usages.value = usagesRes.success.usages || []
               modules.value = usagesRes.modules || []
               subscription.value = usagesRes.subscription || []

               // Mettre à jour la langue locale
               if (userRes.success.user?.lang) {
                    await setLocale(userRes.success.user.lang)
               }
               return true
          } catch (err) {
               console.warn('Session invalide / déconnectée', err)
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
               subscription.value = data.subscription || []
               modules.value = data.modules || []
          } catch (error) {
               console.error('Erreur récupération des usages :', error)
          }
     }

     async function createProject(website: string) {
          const { apiFetch } = usePanelApi()
          try {
               await apiFetch('/projects', {
                    method: 'POST',
                    body: JSON.stringify({ website }),
               })
               return true
          } catch (err: any) {
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

     async function logout() {
          await supabase.auth.signOut()
          user.value = null
          project_usages.value = []
          subscription.value = []
          modules.value = []
     }

     async function previewSubscription(projectId: string, planId: string, modules: string[]) {
          const { apiFetch } = usePanelApi()
          try {
               const response = await apiFetch('/stripe/preview', {
                    method: 'POST',
                    body: JSON.stringify({
                         project_id: projectId,
                         plan_id: planId,
                         modules,
                    }),
               })

               const invoice = response.invoice
               const todayAmount = invoice.amount_due / 100
               const monthlyAmount = invoice.lines.data.reduce((acc: number, line: any) => {
                    if (line.recurring && line.period?.start !== line.period?.end) {
                         return acc + line.amount / 100
                    }
                    return acc
               }, 0)

               return { todayAmount, monthlyAmount }
          } catch (err: any) {
               console.error('Erreur preview abonnement:', err)
               return { todayAmount: 0, monthlyAmount: 0 }
          }
     }


     return {
          // state
          user,
          client,
          project_usages,
          subscription,
          modules,
          project,
          projects,

          // actions
          initPanelSession,
          fetchUser,
          fetchUsage,
          createProject,
          updateUserLang,
          switchProject,
          updatePassword,
          logout,
          previewSubscription,
     }
})
