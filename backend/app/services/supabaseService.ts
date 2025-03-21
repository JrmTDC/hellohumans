import { createClient } from '@supabase/supabase-js'
import Env from '#start/env'

const supabaseUrl = Env.get('SUPABASE_URL') || ''
const supabaseKey = Env.get('SUPABASE_KEY') || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
