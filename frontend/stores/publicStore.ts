import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User, Session } from '@supabase/supabase-js'

export const usePublicStore = defineStore('public', () => {
     const supabase = useSupabaseClient()

     const publicReturn = ref<string | null>(null) // message d'erreur ou clé de traduction
     const publicSession = ref<{ user: User; session: Session } | null>(null) // session actuelle

     // Connexion
     const login = async (email: string, password: string) => {
          publicReturn.value = null
          publicSession.value = null

          try {
               const { data, error } = await supabase.auth.signInWithPassword({ email, password })
               if (error) return false

               publicSession.value = {
                    user: data.user,
                    session: data.session
               }

               return true
          } catch (err: any) {
               setApiError(publicReturn, err)
               return false
          }
     }

     // Inscription
     const register = async (email: string, password: string, displayName: string, accept_cg: boolean, lang: string) => {
          publicReturn.value = null
          try {
               const { apiFetch } = usePublicApi()
               await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, displayName, accept_cg, lang })
               })
               return true
          } catch (err: any) {
               setApiError(publicReturn, err)
               return false
          }
     }

     // Mot de passe oublié
     const forgotPassword = async (email: string) => {
          publicReturn.value = null
          try {
               const { apiFetch } = usePublicApi()
               await apiFetch('/auth/forgot-password', {
                    method: 'POST',
                    body: JSON.stringify({ email })
               })
               return true
          } catch (err: any) {
               setApiError(publicReturn, err)
               return false
          }
     }

     // Mise à jour du mot de passe (après reset)
     const resetPasswordUpdate = async (password: string) => {
          publicReturn.value = null
          try {
               const { error } = await supabase.auth.updateUser({ password })
               return !error;

          } catch (err: any) {
               setApiError(publicReturn, err)
               return false
          }
     }

     // Session après reset (avec token)
     const resetPasswordSession = async (access_token: string, refresh_token: string) => {
          publicReturn.value = null
          try {
               const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
               if (error) return false

               if (!data.user || !data.session) {
                    return false
               }

               publicSession.value = {
                    user: data.user,
                    session: data.session
               }

               return true
          } catch (err: any) {
               setApiError(publicReturn, err)
               return false
          }
     }

     return {
          // states
          publicReturn,
          publicSession,

          // actions
          login,
          register,
          forgotPassword,
          resetPasswordUpdate,
          resetPasswordSession
     }
})
