"use client"

import { guardarEnMapa, leerMapa } from "@/lib/almacen-local"

/**
 * Cuentas y sesión simuladas mientras no hay Supabase Auth: viven en este
 * navegador y la contraseña se guarda como hash SHA-256, nunca en texto.
 * La cuenta de prueba es samuel@correo.com con la contraseña Balto2026.
 */
const CLAVE_CUENTAS = "balto:cuentas"
const CLAVE_SESION = "balto:sesion"

export const CORREO_PRUEBA = "samuel@correo.com"
export const CLAVE_PRUEBA = "Balto2026"

type Cuenta = { correo: string; hash: string; verificada: boolean }

export async function hash(texto: string) {
  const datos = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto))
  return Array.from(new Uint8Array(datos), (b) => b.toString(16).padStart(2, "0")).join("")
}

const normalizar = (correo: string) => correo.trim().toLowerCase()

async function cuentas(): Promise<Record<string, Cuenta>> {
  const guardadas = leerMapa<Cuenta>(CLAVE_CUENTAS)
  if (guardadas[CORREO_PRUEBA]) return guardadas
  return { ...guardadas, [CORREO_PRUEBA]: { correo: CORREO_PRUEBA, hash: await hash(CLAVE_PRUEBA), verificada: true } }
}

export async function existeCuenta(correo: string) {
  return !!(await cuentas())[normalizar(correo)]
}

export async function crearCuenta(correo: string, clave: string) {
  guardarEnMapa<Cuenta>(CLAVE_CUENTAS, normalizar(correo), { correo: normalizar(correo), hash: await hash(clave), verificada: false })
}

export function verificarCuenta(correo: string) {
  guardarEnMapa<Cuenta>(CLAVE_CUENTAS, normalizar(correo), { verificada: true })
}

export async function cambiarClave(correo: string, clave: string) {
  const c = (await cuentas())[normalizar(correo)]
  if (c) guardarEnMapa<Cuenta>(CLAVE_CUENTAS, c.correo, { ...c, hash: await hash(clave) })
}

/** A6: "ok", "credenciales" (A7) o "sin_verificar" (va a A4). */
export async function iniciarSesion(correo: string, clave: string) {
  const c = (await cuentas())[normalizar(correo)]
  if (!c || c.hash !== (await hash(clave))) return "credenciales" as const
  if (!c.verificada) return "sin_verificar" as const
  guardarEnMapa(CLAVE_SESION, "actual", { correo: c.correo, desde: Date.now() })
  return "ok" as const
}

export function cerrarSesion() {
  guardarEnMapa(CLAVE_SESION, "actual", null)
}

/** Reglas de contraseña de A3 y A9. */
export function reglasClave(clave: string) {
  return [
    { texto: "8+ caracteres", ok: clave.length >= 8 },
    { texto: "Mayúscula", ok: /[A-ZÁÉÍÓÚÑ]/.test(clave) },
    { texto: "Número", ok: /\d/.test(clave) },
  ]
}

export const correoValido = (c: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.trim())

/** Código de 6 dígitos para A4 (sin servidor de correo, se muestra como código de prueba). */
export function nuevoCodigo() {
  return String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, "0")
}
