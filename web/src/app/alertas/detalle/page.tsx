import type { Metadata } from "next"
import { Suspense } from "react"

import { DetalleAlerta } from "@/components/alertas/detalle-alerta"
import { marcasDePlanes, mascotasAlerta } from "@/lib/alertas-servidor"
import { cargarDatos, obtenerEventosDueno, obtenerTodasAlertas } from "@/lib/datos"

export const metadata: Metadata = { title: "Alerta · Balto" }

/** J2 · Detalle de alerta y J4 · Alerta vencida (/alertas/detalle?id=a08). */
export default async function DetalleAlertaPage() {
  await cargarDatos()
  return (
    <Suspense>
      <DetalleAlerta alertas={obtenerTodasAlertas()} eventos={obtenerEventosDueno()} mascotas={mascotasAlerta()} marcas={marcasDePlanes()} />
    </Suspense>
  )
}
