"use client"

import { useSyncExternalStore } from "react"

/**
 * Registros por id guardados en este navegador mientras no hay Supabase
 * (alertas resueltas o pospuestas, tomas, tratamientos…). Igual que
 * registro-local: si no hay almacenamiento (modo privado), quedan en memoria.
 */
const AVISO = "balto:almacen"
const enMemoria: Record<string, string> = {}
const cache: Record<string, { crudo: string | null; valor: Record<string, unknown> }> = {}
const VACIO = Object.freeze({}) as Record<string, never>

export function leerMapa<T>(clave: string): Record<string, T> {
  let crudo: string | null
  try {
    crudo = window.localStorage.getItem(clave)
  } catch {
    crudo = enMemoria[clave] ?? null
  }
  if (!crudo) return VACIO
  if (cache[clave]?.crudo !== crudo) cache[clave] = { crudo, valor: JSON.parse(crudo) }
  return cache[clave].valor as Record<string, T>
}

/** Mezcla `cambios` en el registro `id` (o lo borra con null). */
export function guardarEnMapa<T extends object>(clave: string, id: string, cambios: Partial<T> | null) {
  const actual = { ...leerMapa<T>(clave) }
  if (cambios === null) delete actual[id]
  else actual[id] = { ...actual[id], ...cambios } as T
  const crudo = JSON.stringify(actual)
  enMemoria[clave] = crudo
  try {
    window.localStorage.setItem(clave, crudo)
  } catch {
    // Sin almacenamiento: queda en memoria.
  }
  window.dispatchEvent(new Event(AVISO))
}

function suscribir(aviso: () => void) {
  window.addEventListener(AVISO, aviso)
  window.addEventListener("storage", aviso)
  return () => {
    window.removeEventListener(AVISO, aviso)
    window.removeEventListener("storage", aviso)
  }
}

const vacio = () => VACIO

/** El mapa de `clave`, actualizado cuando cambia en esta pestaña o en otra. */
export function useMapaLocal<T>(clave: string): Record<string, T> {
  return useSyncExternalStore(suscribir, () => leerMapa<T>(clave), vacio)
}
