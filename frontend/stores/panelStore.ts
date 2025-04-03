import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePanelApi } from '~/composables/usePanelApi'

export const usePanelStore = defineStore('panel', () => {
     const supabase = useSupabaseClient()

     const user = ref<{ id: string; email: string } | null>(null)
     const usageData = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const subscription = ref<{ id: string; name: string; status: string }[]>([])
     const modules = ref<string[]>([])

     async function initPanelSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()
          try {
               const [userData, usage] = await Promise.all([
                    apiFetch('/client'),
                    apiFetch('/usage'),
               ])

               user.value = userData.user
               usageData.value = usage.usage || []
               modules.value = usage.modules || []
               subscription.value = usage.subscription || []

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
               usageData.value = data.usage || []
               subscription.value = data.subscription || []
               modules.value = data.modules || []
          } catch (error) {
               console.error('Erreur récupération des usages :', error)
          }
     }

     async function logout() {
          await supabase.auth.signOut()
          user.value = null
          usageData.value = []
          subscription.value = []
          modules.value = []
     }

     return {
          // state
          user,
          usageData,
          subscription,
          modules,

          // actions
          initPanelSession,
          fetchUser,
          fetchUsage,
          logout,
     }
})
