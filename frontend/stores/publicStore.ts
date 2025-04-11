import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usePublicApi } from '~/composables/usePublicApi'

export const usePublicStore = defineStore('public', () => {
     const publicReturn = ref<string | null>(null)
     const supabase = useSupabaseClient()

     const login = async (email: string, password: string) => {
          publicReturn.value = null
          try {
               publicReturn.value = await supabase.auth.signInWithPassword({ email, password })
               return true
            } catch (err: any) {
               return false
          }
     }

     const register = async (email: string, password: string, displayName: string, accept_cg: boolean, lang: string) => {
          publicReturn.value = null
          try {
               const { apiFetch } = usePublicApi()
               publicReturn.value = await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, displayName, accept_cg, lang }),
               })
               return true
          }
          catch (err: any) {
               return false
          }
     }

     const forgotPassword = async (email: string) => {
          const { apiFetch } = usePublicApi()
          publicReturn.value = null
          try {
               publicReturn.value =  await apiFetch('/auth/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email })
               })
               return true
          } catch (err: any) {
               return false
          }
     }

     const resetPasswordUpdate = async (password: string) => {
          publicReturn.value = null
          try {
               publicReturn.value = await supabase.auth.updateUser({ password })
               return true
          } catch (err: any) {
               return false
          }
     }

     const resetPasswordSession = async (access_token: string, refresh_token: string) => {
          publicReturn.value = null
          try {
               publicReturn.value = await supabase.auth.setSession({access_token, refresh_token})
               return true
          } catch (err: any) {
               return false
          }
     }

     return {
          // state
          publicReturn,

          // actions
          login,
          register,
          forgotPassword,
          resetPasswordUpdate,
          resetPasswordSession
     }
})
