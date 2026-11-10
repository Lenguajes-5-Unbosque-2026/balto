import { createClient } from "@supabase/supabase-js"

/** Cliente de Supabase para el navegador. Usa solo la llave pública (anon); los permisos los da RLS (supabase/permisos-abiertos.sql). */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const llave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = url && llave ? createClient(url, llave) : null

/** Para leer en el servidor (lib/datos.ts): sin sesión que guardar. */
export const supabaseServidor = url && llave ? createClient(url, llave, { auth: { persistSession: false, autoRefreshToken: false } }) : null
