// src/utils/supabase-client.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE as string // use service role for server-side ops
)

export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'images'
