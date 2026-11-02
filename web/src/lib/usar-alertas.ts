"use client"

import { useMemo, useSyncExternalStore } from "react"

import { alertaDeEvento, grupoAlerta, proximaFechaEvento, type AlertaVista } from "@/lib/alertas"
import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { Evento } from "@/lib/eventos"
import { HOY } from "@/lib/fecha"
import type { Alerta } from "@/lib/perfil"
import { eventosRegistrados, suscribirEventos } from "@/lib/registro-local"
import { useEventos } from "@/lib/usar-eventos"

const CLAVE = "balto:alertas"

/** Lo que cambió el dueño en una alerta desde este navegador. */
type CambioAlerta = { resuelta?: string; evento_resolucion_id?: string; pospuesta?: string }

/** "Ya lo resolví" (J5): la alerta pasa a Resueltas con el evento que la resolvió. */
export function resolverAlerta(id: string, eventoId?: string) {
  guardarEnMapa<CambioAlerta>(CLAVE, id, { resuelta: HOY, evento_resolucion_id: eventoId ?? "" })
}

/** J3: mueve el aviso, no el vencimiento. */
export function posponerAlerta(id: string, fecha: string) {
  guardarEnMapa<CambioAlerta>(CLAVE, id, { pospuesta: fecha })
}

export type MascotaAlerta = { id: string; nombre: string; imagen: string }

const VACIO: never[] = []
const nada = () => VACIO

/**
 * Alertas del CSV más las que crean los eventos registrados en este navegador,
 * con los cambios locales (resueltas, pospuestas) y sin las de eventos eliminados.
 */
export function useAlertas(base: Alerta[], eventosBase: Evento[], mascotas: MascotaAlerta[], marcas: Record<string, string> = {}) {
  const eventos = useEventos(eventosBase)
  const locales = useSyncExternalStore(suscribirEventos, eventosRegistrados, nada)
  const cambios = useMapaLocal<CambioAlerta>(CLAVE)

  return useMemo(() => {
    const porId = new Map(eventos.map((e) => [e.id, e]))
    const editados = new Set(locales.map((e) => e.id))
    const conEvento = new Set(base.map((a) => a.evento_id).filter(Boolean))

    const todas: Alerta[] = [
      ...base.flatMap((a) => {
        if (!a.evento_id) return [a]
        const e = porId.get(a.evento_id)
        if (!e) return [] // Se eliminó el evento de origen (D7).
        if (!editados.has(e.id) || a.estado === "resuelta") return [a]
        const fecha = proximaFechaEvento(e)
        return fecha ? [{ ...a, fecha_vencimiento: fecha }] : []
      }),
      ...locales.filter((e) => !conEvento.has(e.id)).flatMap((e) => alertaDeEvento(e) ?? []),
    ]

    return todas.flatMap((a): AlertaVista[] => {
      const mascota = mascotas.find((m) => m.id === a.mascota_id)
      if (!mascota) return []
      const c = cambios[a.id]
      const resuelta = a.estado === "resuelta" || !!c?.resuelta
      return [
        {
          ...a,
          estado: resuelta ? "resuelta" : a.estado,
          fecha_resuelta: c?.resuelta ?? a.fecha_resuelta,
          evento_resolucion_id: c?.evento_resolucion_id || a.evento_resolucion_id,
          evento: a.evento_id ? porId.get(a.evento_id) : undefined,
          marca: a.plan_id ? marcas[a.plan_id] : undefined,
          mascota,
          grupo: resuelta ? "resuelta" : grupoAlerta(a.fecha_vencimiento),
          pospuesta: c?.pospuesta || a.fecha_aviso_pospuesto || undefined,
        },
      ]
    })
  }, [base, eventos, locales, cambios, mascotas, marcas])
}
