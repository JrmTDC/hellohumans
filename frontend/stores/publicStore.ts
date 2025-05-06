import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePublicStore = defineStore('public', () => {
     const supabase = useSupabaseClient()
     const panelStore = usePanelStore()

     const publicReturn = ref<string | null>(null)
     // Connexion
     const login = async (email: string, password: string) => {
          publicReturn.value = null

          try {
               const { error } = await supabase.auth.signInWithPassword({ email, password })
               if (error){
                    setApiError(publicReturn, error, 'panel.pages.login')
                    return false
               }
               return true
          } catch (err: any) {
               setApiError(publicReturn, err, 'panel.pages.login')
               return false
          }
     }

     // Inscription
     const register = async (email: string, password: string, displayName: string, accept_cg: boolean, lang: string) => {
          await panelStore.logout()
          publicReturn.value = null
          try {
               const { apiFetch } = usePublicApi()
               await apiFetch('/auth/register', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, displayName, accept_cg, lang })
               })
               return true
          } catch (err: any) {
               setApiError(publicReturn, err, 'panel.pages.register')
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
               setApiError(publicReturn, err, 'panel.pages.forgotPassword')
               return false
          }
     }

     // Mise à jour du mot de passe (après reset)
     const resetPasswordUpdate = async (password: string, email: string) => {
          publicReturn.value = null

          try {
               const { error: updateError } = await supabase.auth.updateUser({ password })
               if (updateError) {
                    setApiError(publicReturn, updateError, 'panel.pages.resetPassword')
                    return false
               }
               await supabase.auth.signOut()
               const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
               return !loginError;
          } catch (err: any) {
               setApiError(publicReturn, err, 'panel.pages.resetPassword')
               return false
          }
     }

     // Version de la session du reset de mot de passe
     const resetPasswordSession = async (access_token: string, refresh_token: string) => {
          publicReturn.value = null
          try {
               const { data, error } = await supabase.auth.setSession({ access_token, refresh_token })
               if (error){
                    return false
               }
               return !(!data.user || !data.session);
          } catch (err: any) {
               return false
          }
     }

     const resetPasswordRefreshToken = async () => {
          publicReturn.value = null
          try {
               await supabase.auth.signOut()
               const { data: sessionData, error } = await supabase.auth.refreshSession()
               return !(error || !sessionData.session);
          } catch (err: any) {
               return false
          }
     }


     return {
          // states
          publicReturn,

          // actions
          login,
          register,
          forgotPassword,
          resetPasswordSession,
          resetPasswordRefreshToken,
          resetPasswordUpdate,
     }
})
