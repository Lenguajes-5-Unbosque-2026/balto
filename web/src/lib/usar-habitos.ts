"use client"

import { useEffect, useMemo, useState } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { Evento } from "@/lib/eventos"
import { registrosDe, type Habito } from "@/lib/habitos"
import { refrescarDatos } from "@/lib/refrescar"
import { enSupabase } from "@/lib/sincronizar"
import { supabase } from "@/lib/supabase"
import { useEventos } from "@/lib/usar-eventos"

const CLAVE = "balto:habitos"

type HabitoLocal = Habito | { eliminado: true }

/** Guarda un hábito en la tabla `habitos` de Supabase. Lanza un error si no se pudo. */
export async function guardarHabito(h: Habito) {
  if (!supabase) throw new Error("Supabase no está configurado")
  const { error } = await supabase.from("habitos").insert({
    id: h.id,
    mascota_id: h.mascota_id,
    tipo: h.tipo,
    fecha: h.fecha,
    duracion_min: h.duracion_min ? Number(h.duracion_min) : null,
    consistencia: h.consistencia || null,
    observacion: h.observacion || null,
    imagen: h.imagen || null,
  })
  if (error) throw error
  void refrescarDatos().catch(() => undefined)
}

/** Hábitos de una mascota guardados en Supabase (vacío si no hay conexión o configuración). */
async function leerHabitos(mascotaId: string): Promise<Habito[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from("habitos").select("*").eq("mascota_id", mascotaId)
  if (error || !data) return []
  return data.map((h) => ({
    id: h.id,
    mascota_id: h.mascota_id,
    tipo: h.tipo,
    fecha: h.fecha,
    duracion_min: h.duracion_min == null ? "" : String(h.duracion_min),
    consistencia: h.consistencia ?? "",
    observacion: h.observacion ?? "",
    imagen: h.imagen ?? "",
  }))
}

export function eliminarHabito(id: string) {
  guardarEnMapa<HabitoLocal>(CLAVE, id, { eliminado: true })
  enSupabase({ tipo: "borrar", tabla: "habitos", donde: { id } })
}

/** Registros de la bitácora de una mascota: hábitos (CSV y Supabase) y eventos de E7. */
export function useBitacora(habitos: Habito[], eventosBase: Evento[], mascotaId: string) {
  const locales = useMapaLocal<HabitoLocal>(CLAVE)
  const eventos = useEventos(eventosBase)
  const [remotos, setRemotos] = useState<Habito[]>([])

  useEffect(() => {
    let vigente = true
    leerHabitos(mascotaId).then((r) => vigente && setRemotos(r))
    return () => {
      vigente = false
    }
  }, [mascotaId])

  return useMemo(() => {
    const ids = new Set(habitos.map((h) => h.id))
    const todos = [...habitos, ...remotos.filter((h) => !ids.has(h.id))].filter((h) => !(locales[h.id] && "eliminado" in locales[h.id]))
    return registrosDe(
      todos.filter((h) => h.mascota_id === mascotaId),
      eventos.filter((e) => e.mascota_id === mascotaId),
    )
  }, [habitos, remotos, eventos, locales, mascotaId])
}
