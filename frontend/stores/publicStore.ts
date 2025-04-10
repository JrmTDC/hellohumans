import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePublicApi } from '~/composables/usePublicApi'

export const usePublicStore = defineStore('public', () => {
     const loading = ref(false)
     const error = ref<string | null>(null)
     const supabase = useSupabaseClient()

     const login = async (email: string, password: string) => {
          const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
          return !authError;
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
          }
          catch (err: any) {
               const message = err?.data?.message || err?.message || ''

               // Détection spécifique de l’erreur e-mail déjà utilisé
               if (
                    message.toLowerCase().includes('email') &&
                    (message.toLowerCase().includes('existe') || message.toLowerCase().includes('used'))
               ) {
                    error.value = 'EMAIL_ALREADY_USED'
               } else {
                    error.value = message
               }

               return false
          }
          finally {
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

     const resetPasswordUpdate = async (password: string) => {
          const { error : authError} = await supabase.auth.updateUser({ password: password })

          return !authError;
     }

     const resetPasswordSession = async (access_token: string, refresh_token: string) => {
          const { error: sessionError } = await supabase.auth.setSession({access_token, refresh_token})
          return !sessionError;
     }

     return {
          // state
          loading,
          error,

          // actions
          login,
          register,
          forgotPassword,
          resetPasswordUpdate,
          resetPasswordSession
     }
})
