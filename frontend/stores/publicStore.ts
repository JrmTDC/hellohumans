import { defineStore } from 'pinia'
import { usePublicApi } from '@/composables/usePublicApi'

export const usePublicStore = defineStore('public', {
     state: () => ({
          loading: false,
          error: null as string | null,
          token: import.meta.client ? localStorage.getItem('panel_token') : null
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

          async register(email: string, password: string, website: string) {
               const { apiFetch } = usePublicApi()
               this.loading = true
               this.error = null
               try {
                    const data = await apiFetch('/auth/register', {
                         method: 'POST',
                         body: JSON.stringify({ email, password, website })
                    })
                    if (import.meta.client) {
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

          async forgotPassword(email: string) {
               const { apiFetch } = usePublicApi()
               this.loading = true
               this.error = null
               try {
                    await apiFetch('/auth/forgot-password', {
                         method: 'POST',
                         body: JSON.stringify({ email })
                    })
                    return true
               } catch (err: any) {
                    this.error = err.message
                    return false
               } finally {
                    this.loading = false
               }
          },

          async resetPasswordToken(password: string) {
               const { apiFetch } = usePublicApi()
               this.loading = true
               this.error = null
               try {
                    await apiFetch('/auth/reset-password', {
                         method: 'POST',
                         body: JSON.stringify({ password })
                    })
                    return true
               } catch (err: any) {
                    this.error = err.message
                    return false
               } finally {
                    this.loading = false
               }
          },

          async resetPasswordAttempt(password: string) {
               const { apiFetch } = usePublicApi()
               this.loading = true
               this.error = null
               try {
                    await apiFetch('/auth/reset-password', {
                         method: 'POST',
                         body: JSON.stringify({ password })
                    })
                    return true
               } catch (err: any) {
                    this.error = err.message
                    return false
               } finally {
                    this.loading = false
               }
          },
     }
})
