import { defineStore } from 'pinia'
import { usePublicApi } from '@/composables/usePublicApi'

export const usePublicStore = defineStore('public', {
     state: () => ({
          loading: false,
          error: null as string | null,
          token: process.client ? localStorage.getItem('panel_token') : null
     }),

     actions: {
          async login(email: string, password: string) {
               const { apiFetch } = usePublicApi()
               this.loading = true
               this.error = null
               try {
                    const data = await apiFetch('/auth/login', {
                         method: 'POST',
                         body: JSON.stringify({ email, password })
                    })
                    if (process.client) {
                         localStorage.setItem('panel_token', data.success.token)
                    }
                    this.token = data.success.token
                    return true
               } catch (err: any) {
                    this.error = err.message
                    return false
               } finally {
                    this.loading = false
               }
          },

          async register(email: string, password: string, siteweb: string) {
               const { apiFetch } = usePublicApi()
               this.loading = true
               this.error = null
               try {
                    const data = await apiFetch('/auth/register', {
                         method: 'POST',
                         body: JSON.stringify({ email, password, siteweb })
                    })
                    if (process.client) {
                         localStorage.setItem('panel_token', data.success.token)
                    }
                    this.token = data.success.token
                    return true
               } catch (err: any) {
                    this.error = err.message
                    return false
               } finally {
                    this.loading = false
               }
          },

          logout() {
               if (process.client) {
                    localStorage.removeItem('panel_token')
               }
               this.token = null
          }
     }
})
