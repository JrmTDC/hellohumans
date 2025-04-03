import type { Session, User } from '@supabase/supabase-js'
export const useResetPassword = () => {
     const supabase = useSupabaseClient()
     const user = ref<User | null>(null)
     const error = ref<string | null>(null)
     const session = ref<Session | null>(null)

     const isClient = () => typeof window !== 'undefined'

     const exchangeToken = async (token: string) => {
          error.value = null
          const { data, error: supabaseError } = await supabase.auth.exchangeCodeForSession(token)

          if (supabaseError) {
               error.value = supabaseError.message
               return false
          }

          session.value = data.session
          user.value = data.user

          if (isClient()) {
               localStorage.setItem('panel_token', data.session.access_token)
          }

          return true
     }

     return {
          exchangeToken,
          user,
          session,
          error
     }
}
