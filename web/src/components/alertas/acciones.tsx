"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { HojaResolver } from "@/components/alertas/hoja-resolver"

import { rutaResolver, type AlertaVista } from "@/lib/alertas"
import { guardarMascotaActiva } from "@/lib/registro-local"
import { resolverAlerta } from "@/lib/usar-alertas"

/**
 * Acciones de una alerta que comparten J1, J2 y J4. La pantalla debe mostrar
 * `hojaResolver`: la hoja que explica "Marcar resuelta" antes de abrir el formulario.
 */
export function useAccionesAlerta() {
  const router = useRouter()
  const [resolviendo, setResolviendo] = useState<AlertaVista | null>(null)

  function registrar(a: AlertaVista) {
    setResolviendo(null)
    guardarMascotaActiva(a.mascota_id)
    router.push(rutaResolver(a)!)
  }

  return {
    /** "Marcar resuelta": la hoja que explica qué pasa y lleva al formulario de E lleno. El alimento se marca comprado ahí mismo. */
    resolver(a: AlertaVista) {
      if (!rutaResolver(a)) {
        resolverAlerta(a.id)
        toast.success("Listo, empezamos a contar la bolsa nueva")
        return
      }
      setResolviendo(a)
    },
    hojaResolver: <HojaResolver alerta={resolviendo} onRegistrar={registrar} onCerrar={() => setResolviendo(null)} />,
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
