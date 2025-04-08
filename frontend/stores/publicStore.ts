import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePublicApi } from '~/composables/usePublicApi'

export const usePublicStore = defineStore('public', () => {
     const loading = ref(false)
     const error = ref<string | null>(null)
     const supabase = useSupabaseClient()

     const login = async (email: string, password: string) => {
          loading.value = true
          error.value = null

          const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

          loading.value = false
          if (authError) {
               error.value = authError.message
               return false
          }

          return true
     }

     const register = async (email: string, password: string, website: string, accept_cg: boolean, lang: string) => {
          loading.value = true
          error.value = null

          // garde le call API si tu crées un compte + client + projet
          try {
               const { apiFetch } = usePublicApi()
               await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, website, accept_cg, lang }),
               })
               return true
          } catch (err: any) {
               error.value = err.message
               return false
          } finally {
               loading.value = false
          }
     }

     const forgotPassword = async (email: string) => {
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

     return {
          // state
          loading,
          error,

          // actions
          login,
          register,
          forgotPassword
     }
})
