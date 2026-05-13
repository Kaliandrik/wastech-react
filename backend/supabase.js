// Local: src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://zytxidfpcmeowqmbluxx.supabase.co'
const supabaseKey = 'sb_publishable_6adotA7tMzfjrnatqVCwyQ_VjbipSvB'

export const supabase = createClient(supabaseUrl, supabaseKey)