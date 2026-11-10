"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { Envio } from "@/lib/datos"
import { enSupabase } from "@/lib/sincronizar"

const CLAVE = "balto:envios"

/** Guarda un envío nuevo o cambia uno (vencimiento del enlace, desactivarlo). */
export function guardarEnvio(id: string, cambios: Partial<Envio>) {
  guardarEnMapa<Partial<Envio>>(CLAVE, id, cambios)
  enSupabase({ tipo: "guardar", tabla: "envios", donde: { id }, fila: cambios })
}

/** Envíos del CSV más los hechos en este navegador, del más reciente al más antiguo. */
export function useEnvios(base: Envio[]) {
  const locales = useMapaLocal<Partial<Envio>>(CLAVE)
  return useMemo(() => {
    const ids = new Set(base.map((e) => e.id))
    const nuevos = Object.entries(locales)
      .filter(([id]) => !ids.has(id))
      .map(([id, e]) => ({ id, ...e }) as Envio)
    return [...nuevos, ...base.map((e) => ({ ...e, ...locales[e.id] }))].sort((a, b) => b.fecha.localeCompare(a.fecha))
  }, [base, locales])
}
