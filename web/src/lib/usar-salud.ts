"use client"

import { useRouter } from "next/navigation"

import { puedeVolver } from "@/lib/navegacion"
import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { Condicion } from "@/lib/datos"
import type { Evento } from "@/lib/eventos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { enSupabase } from "@/lib/sincronizar"
import { useEventos } from "@/lib/usar-eventos"

/** La mascota activa de Inicio y sus eventos (con los cambios de este navegador). */
export function useMascotaYEventos<T extends { id: string }>(mascotas: T[], base: Evento[]) {
  const [mascota] = useMascotaActiva(mascotas)
  const todos = useEventos(base)
  return { mascota, eventos: todos.filter((e) => e.mascota_id === mascota.id), todos }
}

/** Flecha atrás: vuelve a la pantalla anterior o, si se abrió el enlace directo, a `respaldo`. */
export function useVolver(respaldo: string) {
  const router = useRouter()
  return () => {
    if (puedeVolver()) router.back()
    else router.push(respaldo)
  }
}

const CLAVE = "balto:salud"

/** Alergias y condiciones editadas en F6 desde este navegador (reemplazan las del CSV). */
type SaludLocal = { alergias?: string[]; condiciones?: Condicion[] }

export function guardarSalud(mascotaId: string, cambios: SaludLocal) {
  guardarEnMapa<SaludLocal>(CLAVE, mascotaId, cambios)
  if (cambios.alergias)
    enSupabase({
      tipo: "reemplazar",
      tabla: "alergias",
      donde: { mascota_id: mascotaId },
      filas: cambios.alergias.map((alergia, i) => ({ id: `${mascotaId}-al${i + 1}`, alergia })),
    })
  if (cambios.condiciones) enSupabase({ tipo: "reemplazar", tabla: "condiciones", donde: { mascota_id: mascotaId }, filas: cambios.condiciones })
}

/** Alergias y condiciones vigentes de la mascota: las de data/mock/ o las editadas en F6. */
export function useSalud(mascota: { id: string; alergias: string[] }, condiciones: Condicion[]) {
  const local = useMapaLocal<SaludLocal>(CLAVE)[mascota.id]
  return {
    alergias: local?.alergias ?? mascota.alergias,
    condiciones: local?.condiciones ?? condiciones.filter((c) => c.mascota_id === mascota.id),
  }
}

/** Sugerencias fijas de F6 (spec de F): las comunes por especie que aún no están agregadas. */
export const ALERGIAS_SUGERIDAS = ["Pollo", "Res", "Cerdo", "Trigo", "Soya", "Lácteos", "Pulgas (DAPP)", "Polen", "Ácaros"]
