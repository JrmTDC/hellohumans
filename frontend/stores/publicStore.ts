import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePublicApi } from '~/composables/usePublicApi'

function isClient() {
     return typeof window !== 'undefined'
}

export const usePublicStore = defineStore('public', () => {
     const loading = ref(false)
     const error = ref<string | null>(null)
     const token = ref<string | null>(isClient() ? localStorage.getItem('panel_token') : null)

     async function login(email: string, password: string) {
          const { apiFetch } = usePublicApi()
          loading.value = true
          error.value = null
          try {
               const data = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
               })
               if (isClient()) {
                    localStorage.setItem('panel_token', data.success.token)
               }
               token.value = data.success.token
               return true
          } catch (err: any) {
               error.value = err.message
               return false
          } finally {
               loading.value = false
          }
     }

     async function register(email: string, password: string, website: string) {
          const { apiFetch } = usePublicApi()
          loading.value = true
          error.value = null
          try {
               const data = await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, website })
               })
               if (isClient()) {
                    localStorage.setItem('panel_token', data.success.token)
               }
               token.value = data.success.token
               return true
          } catch (err: any) {
               error.value = err.message
               return false
          } finally {
               loading.value = false
          }
     }

     async function forgotPassword(email: string) {
          const { apiFetch } = usePublicApi()
          loading.value = true
          error.value = null
          try {
               await apiFetch('/auth/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email })
               })
               return true
          } catch (err: any) {
               error.value = err.message
               return false
          } finally {
               loading.value = false
          }
     }

     async function resetPasswordToken(token: string) {
          const { apiFetch } = usePublicApi()
          loading.value = true
          error.value = null
          try {
               await apiFetch('/auth/verify-reset-token', {
                    method: 'POST',
                    body: JSON.stringify({ token })
               })
               return true
          } catch (err: any) {
               error.value = err.message
               return false
          } finally {
               loading.value = false
          }
     }

     async function resetPasswordAttempt(password: string) {
          const { apiFetch } = usePublicApi()
          loading.value = true
          error.value = null
          try {
               await apiFetch('/auth/reset-password', {
                    method: 'POST',
                    body: JSON.stringify({ password })
               })
               return true
          } catch (err: any) {
               error.value = err.message
               return false
          } finally {
               loading.value = false
          }
     }

     return {
          // state
          loading,
          error,
          token,

          // actions
          login,
          register,
          forgotPassword,
          resetPasswordToken,
          resetPasswordAttempt
     }
})
