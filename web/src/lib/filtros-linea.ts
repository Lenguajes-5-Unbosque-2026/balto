"use client"

import { useSyncExternalStore } from "react"

import type { Categoria } from "@/lib/eventos"

/**
 * Búsqueda y filtros de la línea de tiempo (D2, D3, D9, D10). No se guardan:
 * viven mientras dura la sesión (spec de D), así que al volver de D4 siguen ahí.
 */
export type Filtros = {
  busqueda: string
  categorias: Categoria[]
  desde: string
  hasta: string
}

export const SIN_FILTROS: Filtros = { busqueda: "", categorias: [], desde: "", hasta: "" }

const CLAVE = "balto:filtros-linea"
const AVISO = "balto:filtros-linea"
let enMemoria: string | null = null
let cache: { crudo: string | null; valor: Filtros } = { crudo: null, valor: SIN_FILTROS }

function leer(): Filtros {
  let crudo = enMemoria
  try {
    crudo = window.sessionStorage.getItem(CLAVE)
  } catch {
    // Sin almacenamiento: se usa la copia en memoria.
  }
  if (!crudo) return SIN_FILTROS
  if (crudo !== cache.crudo) cache = { crudo, valor: { ...SIN_FILTROS, ...(JSON.parse(crudo) as Partial<Filtros>) } }
  return cache.valor
}

function suscribir(aviso: () => void) {
  window.addEventListener(AVISO, aviso)
  return () => window.removeEventListener(AVISO, aviso)
}

export function useFiltrosLinea() {
  const filtros = useSyncExternalStore(suscribir, leer, () => SIN_FILTROS)

  function cambiar(cambios: Partial<Filtros>) {
    const crudo = JSON.stringify({ ...leer(), ...cambios })
    enMemoria = crudo
    try {
      window.sessionStorage.setItem(CLAVE, crudo)
    } catch {
      // Queda en memoria.
    }
    window.dispatchEvent(new Event(AVISO))
  }

  return [filtros, cambiar] as const
}
