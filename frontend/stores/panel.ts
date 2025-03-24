import { defineStore } from 'pinia'
import { usePanelApi } from '@/composables/usePanelApi'

export const usePanelStore = defineStore('panel', {
     state: () => ({
          usageData: [],
          user: null,
          isAuthenticated: false,
     }),

     actions: {
          async fetchUser() {
               const { apiFetch } = usePanelApi()
               try {
                    const data = await apiFetch('/me')
                    this.user = data.user
                    this.isAuthenticated = true
               } catch (error) {
                    console.error('Erreur utilisateur :', error)
                    this.isAuthenticated = false
               }
          },

          async fetchUsage() {
               const { apiFetch } = usePanelApi()
               try {
                    const data = await apiFetch('/usage')
                    this.usageData = data.success || []
               } catch (error) {
                    console.error('Erreur de récupération des usages :', error)
               }
          }


     }
})
