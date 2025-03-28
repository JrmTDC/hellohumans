import { defineStore } from 'pinia'
import { usePublicApi } from '@/composables/usePublicApi'

export const usePublicStore = defineStore('public', {
     state: () => ({
          loading: false,
          error: null
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
                    localStorage.setItem('panel_token', data.token)
                    return true
               } catch (err: any) {
                    this.error = err.message
                    return false
               } finally {
                    this.loading = false
               }
          }
     }
})
