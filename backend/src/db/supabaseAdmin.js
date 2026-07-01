import { createClient } from '@supabase/supabase-js'
import ws from 'ws'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '[supabaseAdmin] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing — ' +
      'privileged writes (e.g. storing Gmail tokens) will fail until these are set.'
  )
}

export const supabaseAdmin = createClient(
  SUPABASE_URL || 'https://placeholder.supabase.co',
  SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  {
    auth: { persistSession: false },
    realtime: { transport: ws },
  }
)