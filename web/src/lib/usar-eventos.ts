"use client"

import { useMemo, useSyncExternalStore } from "react"

import { ordenarEventos, type Evento } from "@/lib/eventos"
import { eventosEliminados, eventosRegistrados, suscribirEventos } from "@/lib/registro-local"

const VACIO: never[] = []
const nada = () => VACIO

/**
 * Eventos de data/mock/ más los cambios hechos en este navegador: los nuevos,
 * los editados (reemplazan al del CSV con el mismo id) y sin los eliminados.
 * Del más reciente al más antiguo.
 */
export function useEventos(base: Evento[]) {
  const locales = useSyncExternalStore(suscribirEventos, eventosRegistrados, nada)
  const eliminados = useSyncExternalStore(suscribirEventos, eventosEliminados, nada)
  return useMemo(() => {
    const fuera = new Set([...eliminados, ...locales.map((e) => e.id)])
    return ordenarEventos([...locales, ...base.filter((e) => !fuera.has(e.id))].filter((e) => !eliminados.includes(e.id)))
  }, [base, locales, eliminados])
}
