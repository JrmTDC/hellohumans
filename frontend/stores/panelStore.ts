import { defineStore } from 'pinia'

export const usePanelStore = defineStore('panel', () => {
     const router = useRouter()
     const supabase = useSupabaseClient()

     const user = ref<{ uuid: string; email: string; lang:string; selected_project_uuid:string; blocked:boolean; } | null>(null)
     const client = ref<{} | null>(null)
     const project = ref<{} | null>(null)
     const clients = ref<{ id: string; name: string }[]>([])
     const project_usages = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const subscription = ref<{ id: string; name: string; status: string }[]>([])
     const modules = ref<string[]>([])
     const projects = ref<any[]>([])
     const activities = ref<any[]>([])

     const panelReturn = ref<string | null>(null)

     async function initPanelSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          const { setLocale } = useI18n()
          panelReturn.value = null
          try {

               // 1) Vérifier la session / récupérer l’utilisateur
               const userRes = await apiFetch('/user')
               user.value = userRes.success.user || null

               if (!user.value) {
                    await logout()
                    return false
               }

               // Mettre à jour la langue locale si disponible
               if (userRes.success.user?.lang) {
                    await setLocale(userRes.success.user.lang)
               }

               // 2) Vérifier si client et projet sont présents
               const [clientRes, projectRes] = await Promise.all([
                    apiFetch('/client'),
                    apiFetch('/project'),
               ])

               if(!clientRes.success || clientRes.success.client.length === 0) {
                    client.value = null
                    return true
               }
               if(!projectRes.success || projectRes.success.project.length === 0) {
                    project.value = null
                    return true
               }

               client.value = clientRes.success.client || null
               project.value = projectRes.success.project || null

               // 3) Puisque le client et le projet sont valides, on récupère d’autres informations
               const [clientsRes, projectsRes, usagesRes] = await Promise.all([
                    apiFetch('/clients'),
                    apiFetch('/projects'),
                    apiFetch('/usages'),
               ])
               clients.value = clientsRes.success.clients || []
               projects.value = projectsRes.success.projects || []
               project_usages.value = usagesRes.success.usages || []
               modules.value = usagesRes.modules || []
               subscription.value = usagesRes.subscription || []

               return true
          } catch (err: any) {
               setApiError(panelReturn, err, 'panel.pages.layout')
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

     async function createClient(name: string): Promise<{ id: string; name: string } | null> {
          const { apiFetch } = usePanelApi()
          try {
               const res = await apiFetch('/clients', {
                    method: 'POST',
                    body: JSON.stringify({ name }),
               })
               return res.success.client
          } catch (err) {
               console.error('Erreur création compte client:', err)
               return null
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

     async function logout() {
          await supabase.auth.signOut()
          user.value = null
          project_usages.value = []
          subscription.value = []
          modules.value = []
     }


     return {
          // state
          user,
          client,
          clients,
          project_usages,
          subscription,
          modules,
          project,
          projects,
          activities,

          // actions
          initPanelSession,
          fetchUser,
          fetchUsage,
          createProject,
          createClient,
          updateUserLang,
          switchProject,
          updatePassword,
          fetchListActivity,
          createOnboarding,
          logout
     }
})
