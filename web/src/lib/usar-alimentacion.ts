"use client"

import { useMemo } from "react"

import type { Comida, Plan } from "@/lib/alimentacion"
import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import type { ComidaProgramada, PlanAlimentacion } from "@/lib/datos"
import { AHORA, HOY } from "@/lib/fecha"
import { enSupabase } from "@/lib/sincronizar"

const CLAVE_PLANES = "balto:planes"
const CLAVE_SERVIDAS = "balto:comidas-servidas"

export function guardarPlan(mascotaId: string, plan: Plan) {
  guardarEnMapa<Plan>(CLAVE_PLANES, mascotaId, plan)
  const { comidas, ...datos } = plan
  enSupabase({ tipo: "plan", mascotaId, plan: datos, comidas, idNuevo: `${mascotaId}-plan-${Date.now()}` })
}

const claveComida = (mascotaId: string, hora: string) => `${mascotaId}|${HOY}|${hora}`

/** "Servir" (H1) o "Servida" (H5): la comida de hoy queda servida con la hora actual (solo en este navegador). */
export function servirComida(mascotaId: string, hora: string) {
  guardarEnMapa<{ hora: string }>(CLAVE_SERVIDAS, claveComida(mascotaId, hora), { hora: AHORA })
}

export type DatosAlimentacion = { planes: PlanAlimentacion[]; comidas: ComidaProgramada[] }

/** Plan de cada mascota: el de data/mock/ o el guardado en H4 desde este navegador. */
export function usePlanes({ planes, comidas }: DatosAlimentacion) {
  const locales = useMapaLocal<Plan>(CLAVE_PLANES)
  const servidas = useMapaLocal<{ hora: string }>(CLAVE_SERVIDAS)
  return useMemo(() => {
    const porMascota: Record<string, Plan> = {}
    for (const p of planes.filter((x) => x.activo === "true")) {
      porMascota[p.mascota_id] = {
        mascota_id: p.mascota_id,
        tipo: p.tipo,
        marca: p.marca,
        tipo_alimento: p.tipo_alimento,
        presentacion_kg: Number(p.presentacion_kg) || 0,
        gramos_dia: Number(p.gramos_dia) || 0,
        actividad: (p.actividad || "media") as Plan["actividad"],
        fecha_bolsa_abierta: p.fecha_bolsa_abierta,
        comidas: comidas
          .filter((c) => c.plan_id === p.id)
          .map((c): Comida => ({ nombre: c.nombre, hora: c.hora, gramos: Number(c.gramos) }))
          .sort((a, b) => a.hora.localeCompare(b.hora)),
        recordatorio: true,
      }
    }
    return {
      planes: { ...porMascota, ...locales },
      servida: (mascotaId: string, hora: string) => servidas[claveComida(mascotaId, hora)],
    }
  }, [planes, comidas, locales, servidas])
}
