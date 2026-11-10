"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import type { Cita } from "@/lib/datos"
import { ZONAS, type Punto } from "@/lib/proveedores"
import { enSupabase } from "@/lib/sincronizar"

const CLAVE_UBICACION = "balto:ubicacion"
const CLAVE_FAVORITA = "balto:favorita"
const CLAVE_CITAS = "balto:citas"

/** De dónde se miden las distancias: el GPS (K1) o una zona elegida a mano (K7). */
export type Ubicacion = Punto & { modo: "gps" | "zona"; zona: string }

export function guardarUbicacion(u: Ubicacion) {
  guardarEnMapa<Ubicacion>(CLAVE_UBICACION, "actual", u)
}

/** La ubicación guardada; null la primera vez (se muestra K1). */
export function useUbicacion(): Ubicacion | null {
  return useMapaLocal<Ubicacion>(CLAVE_UBICACION).actual ?? null
}

/** Punto de referencia: la ubicación guardada o la casa del dueño (Chapinero). */
export function puntoReferencia(u: Ubicacion | null): Punto {
  return u ?? ZONAS.Chapinero
}

export function alternarFavorita(id: string, actual: string | undefined) {
  guardarEnMapa<{ id: string }>(CLAVE_FAVORITA, "veterinaria", { id: actual === id ? "" : id })
}

export function useFavorita() {
  return useMapaLocal<{ id: string }>(CLAVE_FAVORITA).veterinaria?.id || undefined
}

export function guardarCita(id: string, cambios: Partial<Cita>) {
  guardarEnMapa<Partial<Cita>>(CLAVE_CITAS, id, cambios)
  enSupabase({ tipo: "guardar", tabla: "citas", donde: { id }, fila: cambios, alCrear: { dueno_id: DUENO_ACTUAL_ID } })
}

/** Citas del CSV más las agendadas, reprogramadas o canceladas en este navegador. */
export function useCitas(base: Cita[]) {
  const locales = useMapaLocal<Partial<Cita>>(CLAVE_CITAS)
  return useMemo(() => {
    const ids = new Set(base.map((c) => c.id))
    const nuevas = Object.entries(locales)
      .filter(([id]) => !ids.has(id))
      .map(([id, c]) => ({ id, ...c }) as Cita)
    return [...base.map((c) => ({ ...c, ...locales[c.id] })), ...nuevas].sort((a, b) => a.fecha_hora.localeCompare(b.fecha_hora))
  }, [base, locales])
}
