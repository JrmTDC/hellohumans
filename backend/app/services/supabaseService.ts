import { createClient } from '@supabase/supabase-js'
import Env from '#start/env'

const supabaseUrl = Env.get('SUPABASE_URL') || ''
const supabaseSecretKey = Env.get('SUPABASE_SECRET_KEY') || ''
const supabaseAnonKey = Env.get('SUPABASE_ANON_KEY') || ''

// Client principal avec service role
export const supabase = createClient(supabaseUrl, supabaseSecretKey)

// Client avec clé anonyme
export const createSupabaseClientWithToken = (token: string) => {
     return createClient(supabaseUrl, supabaseAnonKey, {
          auth: {
               persistSession: false
          },
          global: {
               headers: {
                    Authorization: `Bearer ${token}`,
               },
          },
     })
}

//Permet d'utiliser un recoveryToken reçu dans l'email pour accéder à l'utilisateur
export const exchangeRecoveryTokenForSession = async (token: string) => {
     const supabase = createClient(supabaseUrl, supabaseAnonKey)
     return await supabase.auth.exchangeCodeForSession(token)
}

export default supabase

