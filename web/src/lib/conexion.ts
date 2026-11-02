"use client"

import { useSyncExternalStore } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"

const CLAVE_PENDIENTES = "balto:pendientes"

function suscribir(aviso: () => void) {
  window.addEventListener("online", aviso)
  window.addEventListener("offline", aviso)
  return () => {
    window.removeEventListener("online", aviso)
    window.removeEventListener("offline", aviso)
  }
}

/** ¿Hay internet? (O2). En el servidor se asume que sí. */
export function useEnLinea() {
  return useSyncExternalStore(suscribir, () => navigator.onLine, () => true)
}

/** Lo registrado sin conexión que falta por subir (O3, O8). */
export type Pendiente = { titulo: string; detalle: string; icono: string; eventoId?: string }

export function marcarPendiente(id: string, p: Pendiente) {
  guardarEnMapa<Pendiente>(CLAVE_PENDIENTES, id, p)
}

export function limpiarPendientes(ids: string[]) {
  for (const id of ids) guardarEnMapa<Pendiente>(CLAVE_PENDIENTES, id, null)
}

export function usePendientes() {
  return useMapaLocal<Pendiente>(CLAVE_PENDIENTES)
}
