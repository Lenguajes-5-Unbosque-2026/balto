"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { rutaResolver, type AlertaVista } from "@/lib/alertas"
import { guardarMascotaActiva } from "@/lib/registro-local"
import { resolverAlerta } from "@/lib/usar-alertas"

/** Acciones de una alerta que comparten J1, J2 y J4. */
export function useAccionesAlerta() {
  const router = useRouter()
  return {
    /** "Ya lo resolví": abre el formulario de E lleno, con la mascota de la alerta. */
    resolver(a: AlertaVista) {
      const ruta = rutaResolver(a)
      if (!ruta) {
        resolverAlerta(a.id)
        toast.success("Listo, empezamos a contar la bolsa nueva")
        return
      }
      guardarMascotaActiva(a.mascota_id)
      router.push(ruta)
    },
    /** "Agendar cita": K3 filtrado por el servicio, con la alerta para resolverla después (spec de J). */
    agendar(a: AlertaVista) {
      guardarMascotaActiva(a.mascota_id)
      const servicio = a.tipo === "refuerzo_vacuna" || a.tipo === "proxima_desparasitacion" ? "vacunacion" : "consulta"
      router.push(`/veterinarias?servicio=${servicio}&alerta=${a.id}`)
    },
    /** "Comprar la vacuna" (N5) o el alimento (N2). */
    comprar(a: AlertaVista) {
      guardarMascotaActiva(a.mascota_id)
      router.push(a.tipo === "alimento_por_acabarse" ? "/tienda/alimentos" : `/tienda/vacuna?mascota=${a.mascota_id}&alerta=${a.id}`)
    },
  }
}
