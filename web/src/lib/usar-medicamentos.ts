"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { HorarioToma, Toma, Tratamiento } from "@/lib/datos"
import { estadoTratamiento, registrosDelCsv, type RegistroToma, type TratamientoVista } from "@/lib/medicamentos"

const CLAVE_TRATAMIENTOS = "balto:tratamientos"
const CLAVE_TOMAS = "balto:tomas"

type TratamientoLocal = Partial<Tratamiento> & { horas?: string[] }

/** Crea o cambia un tratamiento (G4, G8, reactivar). */
export function guardarTratamiento(id: string, cambios: TratamientoLocal) {
  guardarEnMapa<TratamientoLocal>(CLAVE_TRATAMIENTOS, id, cambios)
}

/** Confirma, pospone u omite una toma (G1, G2, G5, G6). */
export function registrarToma(clave: string, registro: RegistroToma) {
  guardarEnMapa<RegistroToma>(CLAVE_TOMAS, clave, registro)
}

export type DatosMedicamentos = { tratamientos: Tratamiento[]; horarios: HorarioToma[]; tomas: Toma[] }

/** Tratamientos del CSV más los creados o cambiados en este navegador, y todas las tomas registradas. */
export function useMedicamentos({ tratamientos, horarios, tomas }: DatosMedicamentos) {
  const locales = useMapaLocal<TratamientoLocal>(CLAVE_TRATAMIENTOS)
  const tomasLocales = useMapaLocal<RegistroToma>(CLAVE_TOMAS)

  return useMemo(() => {
    const base = tratamientos.map((t) => ({ ...t, horas: horarios.filter((h) => h.tratamiento_id === t.id).map((h) => h.hora) }))
    const ids = new Set(base.map((t) => t.id))
    const nuevos = Object.entries(locales)
      .filter(([id]) => !ids.has(id))
      .map(([id, t]) => ({ id, horas: [], ...t }) as TratamientoVista)
    const lista: TratamientoVista[] = [...base.map((t) => ({ ...t, ...locales[t.id] })), ...nuevos].map((t) => ({
      ...t,
      horas: [...t.horas].sort(),
      estado: estadoTratamiento(t),
    }))
    return { tratamientos: lista, registros: { ...registrosDelCsv(tomas), ...tomasLocales } }
  }, [tratamientos, horarios, tomas, locales, tomasLocales])
}
