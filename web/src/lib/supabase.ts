import { createClient } from "@supabase/supabase-js"

/** Cliente de Supabase para el navegador. Usa solo la llave pública (anon); los permisos los da RLS. */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const llave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = url && llave ? createClient(url, llave) : null
