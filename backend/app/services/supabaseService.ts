import { createClient } from '@supabase/supabase-js'
import Env from '#start/env'

const supabaseUrl = Env.get('SUPABASE_URL') || ''
const supabaseSecretKey = Env.get('SUPABASE_SECRET_KEY') || ''
const supabaseAnonKey = Env.get('SUPABASE_ANON_KEY') || ''


export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey)

export default supabase

