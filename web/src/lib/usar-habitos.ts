"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { Evento } from "@/lib/eventos"
import { registrosDe, type Habito } from "@/lib/habitos"
import { useEventos } from "@/lib/usar-eventos"

const CLAVE = "balto:habitos"

type HabitoLocal = Habito | { eliminado: true }

export function guardarHabito(h: Habito) {
  guardarEnMapa<HabitoLocal>(CLAVE, h.id, h)
}

export function eliminarHabito(id: string) {
  guardarEnMapa<HabitoLocal>(CLAVE, id, { eliminado: true })
}

/** Registros de la bitácora de una mascota: hábitos (CSV y de este navegador) y eventos de E7. */
export function useBitacora(habitos: Habito[], eventosBase: Evento[], mascotaId: string) {
  const locales = useMapaLocal<HabitoLocal>(CLAVE)
  const eventos = useEventos(eventosBase)
  return useMemo(() => {
    const ids = new Set(habitos.map((h) => h.id))
    const todos = [
      ...habitos.filter((h) => !(locales[h.id] && "eliminado" in locales[h.id])),
      ...Object.entries(locales)
        .filter(([id, h]) => !ids.has(id) && !("eliminado" in h))
        .map(([, h]) => h as Habito),
    ]
    return registrosDe(
      todos.filter((h) => h.mascota_id === mascotaId),
      eventos.filter((e) => e.mascota_id === mascotaId),
    )
  }, [habitos, eventos, locales, mascotaId])
}
