"use client"

import { useSyncExternalStore } from "react"

import { guardarMascotaActiva, leerMascotaActiva } from "@/lib/registro-local"

const EVENTO = "balto:mascota-activa"

function suscribir(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener("storage", aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener("storage", aviso)
  }
}

/** Mascota activa del selector de Inicio, compartida por todas las pantallas. */
export function useMascotaActiva<T extends { id: string }>(mascotas: T[]) {
  const guardada = useSyncExternalStore(suscribir, leerMascotaActiva, () => null)
  const activa = mascotas.find((m) => m.id === guardada) ?? mascotas[0]

  function cambiar(id: string) {
    guardarMascotaActiva(id)
    window.dispatchEvent(new Event(EVENTO))
  }

  return [activa, cambiar] as const
}
