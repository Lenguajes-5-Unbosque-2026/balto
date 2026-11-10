"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { HorarioToma, Toma, Tratamiento } from "@/lib/datos"
import { estadoTratamiento, registrosDelCsv, type RegistroToma, type TratamientoVista } from "@/lib/medicamentos"
import { enSupabase } from "@/lib/sincronizar"

const CLAVE_TRATAMIENTOS = "balto:tratamientos"
const CLAVE_TOMAS = "balto:tomas"

type TratamientoLocal = Partial<Tratamiento> & { horas?: string[] }

/** Crea o cambia un tratamiento (G4, G8, reactivar). */
export function guardarTratamiento(id: string, cambios: TratamientoLocal) {
  guardarEnMapa<TratamientoLocal>(CLAVE_TRATAMIENTOS, id, cambios)
  const { horas, ...fila } = cambios
  enSupabase({ tipo: "guardar", tabla: "tratamientos", donde: { id }, fila })
  if (horas)
    enSupabase({ tipo: "reemplazar", tabla: "horarios_toma", donde: { tratamiento_id: id }, filas: horas.map((hora, i) => ({ id: `${id}-h${i + 1}`, hora })) })
}

/** Confirma, pospone u omite una toma (G1, G2, G5, G6). */
export function registrarToma(clave: string, registro: RegistroToma) {
  guardarEnMapa<RegistroToma>(CLAVE_TOMAS, clave, registro)
  // La clave es "tratamiento|2026-09-23 08:00" (claveToma); las horas del registro son del mismo día.
  const [tratamientoId, programada] = clave.split("|")
  const [fecha, hora] = programada.split(" ")
  const conFecha = (h?: string) => (h ? `${fecha} ${h}` : "")
  enSupabase({
    tipo: "guardar",
    tabla: "tomas",
    donde: { tratamiento_id: tratamientoId, fecha_hora_programada: programada },
    fila: { estado: registro.estado, hora_real: conFecha(registro.hora_real), aviso_reprogramado: conFecha(registro.aviso_reprogramado) },
    alCrear: { id: `${tratamientoId}-${fecha}-${hora.replace(":", "")}` },
  })
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
