import { defineStore } from 'pinia'
import { usePanelApi } from '~/composables/usePanelApi'

export const usePanelStore = defineStore('panel', {
     state: () => ({
          usageData: [] as { id: string, usage: number, limit: number | '∞' }[],
          subscription : [] as { id: string, name: string, status: string }[],
          modules: [] as string[],
          user: null,
          isAuthenticated: false,
          token: import.meta.client ? localStorage.getItem('panel_token') : null
     }),

     actions: {

          async initPanelSession(): Promise<boolean> {
               const { apiFetch } = usePanelApi()

               try {
                    const [user, usage] = await Promise.all([
                         apiFetch('/client'),
                         apiFetch('/usage'),
                    ])

                    this.user = user.user
                    this.isAuthenticated = true
                    this.usageData = usage.usage || []
                    this.modules = usage.modules || []

                    return true
               } catch (err) {
                    console.warn('Session invalide / déconnectée', err)
                    this.logout()
                    return false
               }
          },

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
                    this.usageData = data.usage
                    this.subscription = data.subscription
                    this.modules = data.modules

               } catch (error) {
                    console.error('Erreur récupération des usages :', error)
               }
          },

          logout() {
               if (import.meta.client) {
                    localStorage.removeItem('panel_token')
               }
               this.token = null
               this.user = null
               this.isAuthenticated = false
          }

     }
})
