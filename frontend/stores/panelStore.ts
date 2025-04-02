import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePanelApi } from '~/composables/usePanelApi'

function isClient() {
     return typeof window !== 'undefined'
}

export const usePanelStore = defineStore('panel', () => {
     const usageData = ref<{ id: string; usage: number; limit: number | '∞' }[]>([])
     const subscription = ref<{ id: string; name: string; status: string }[]>([])
     const modules = ref<string[]>([])
     const user = ref<any>(null)
     const isAuthenticated = ref(false)
     const token = ref<string | null>(isClient() ? localStorage.getItem('panel_token') : null)

     async function initPanelSession(): Promise<boolean> {
          const { apiFetch } = usePanelApi()

          try {
               const [userData, usage] = await Promise.all([
                    apiFetch('/client'),
                    apiFetch('/usage'),
               ])

               user.value = userData.user
               isAuthenticated.value = true
               usageData.value = usage.usage || []
               modules.value = usage.modules || []

               return true
          } catch (err) {
               console.warn('Session invalide / déconnectée', err)
               return false
          }
     }

     async function fetchUser() {
          const { apiFetch } = usePanelApi()
          try {
               const data = await apiFetch('/me')
               user.value = data.user
               isAuthenticated.value = true
          } catch (error) {
               console.error('Erreur utilisateur :', error)
               isAuthenticated.value = false
          }
     }

     async function fetchUsage() {
          const { apiFetch } = usePanelApi()
          try {
               const data = await apiFetch('/usage')
               usageData.value = data.usage
               subscription.value = data.subscription
               modules.value = data.modules
          } catch (error) {
               console.error('Erreur récupération des usages :', error)
          }
     }

     function logout() {
          if (isClient()) {
               localStorage.removeItem('panel_token')
          }
          token.value = null
          user.value = null
          isAuthenticated.value = false
     }

     return {
          // state
          usageData,
          subscription,
          modules,
          user,
          isAuthenticated,
          token,

          // actions
          initPanelSession,
          fetchUser,
          fetchUsage,
          logout,
     }
})
