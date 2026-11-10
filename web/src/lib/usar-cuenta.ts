"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import { enSupabase } from "@/lib/sincronizar"

/** Datos del dueño que se editan en M2 (y se muestran en D1, L5 y los PDF). */
export type DatosDueno = { id: string; nombre: string; correo: string; ciudad: string; telefono: string }

const CLAVE_DUENO = "balto:dueno"
const CLAVE_PREFERENCIAS = "balto:preferencias"
const CLAVE_LEIDAS = "balto:notificaciones-leidas"

export function guardarDueno(id: string, cambios: Partial<DatosDueno>) {
  guardarEnMapa<Partial<DatosDueno>>(CLAVE_DUENO, id, cambios)
  enSupabase({ tipo: "actualizar", tabla: "duenos", donde: { id }, fila: cambios })
}

/** El dueño con los cambios de M2. */
export function useDueno<T extends { id: string }>(base: T): T {
  const cambios = useMapaLocal<Partial<DatosDueno>>(CLAVE_DUENO)[base.id]
  return useMemo(() => ({ ...base, ...cambios }), [base, cambios])
}

/** Una fila de data/mock/preferencias_notificacion.csv (M3). */
export type Preferencia = { tipo: string; activo: string; anticipacion: string }

export function guardarPreferencia(tipo: string, cambios: Partial<Preferencia>) {
  guardarEnMapa<Partial<Preferencia>>(CLAVE_PREFERENCIAS, tipo, cambios)
  enSupabase({ tipo: "guardar", tabla: "preferencias_notificacion", donde: { dueno_id: DUENO_ACTUAL_ID, tipo }, fila: cambios })
}

export function usePreferencias(base: Preferencia[]) {
  const cambios = useMapaLocal<Partial<Preferencia>>(CLAVE_PREFERENCIAS)
  return useMemo(() => {
    const tipos = new Set([...base.map((p) => p.tipo), ...Object.keys(cambios)])
    return Object.fromEntries(
      [...tipos].map((tipo) => [tipo, { tipo, activo: "false", anticipacion: "", ...base.find((p) => p.tipo === tipo), ...cambios[tipo] }]),
    ) as Record<string, Preferencia>
  }, [base, cambios])
}

/** Notificaciones de la bandeja (M9) que el dueño ya vio (solo en este navegador). */
export function marcarLeidas(ids: string[]) {
  for (const id of ids) guardarEnMapa<{ leida: boolean }>(CLAVE_LEIDAS, id, { leida: true })
}

export function useLeidas() {
  return useMapaLocal<{ leida: boolean }>(CLAVE_LEIDAS)
}
