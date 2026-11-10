import type { Metadata } from "next"

import { CentroAlertas } from "@/components/alertas/centro-alertas"
import { marcasDePlanes, mascotasAlerta } from "@/lib/alertas-servidor"
import { cargarDatos, obtenerEventosDueno, obtenerTodasAlertas } from "@/lib/datos"

export const metadata: Metadata = { title: "Alertas · Balto" }

/** J1 · Centro de alertas: lo que vence pronto para todas las mascotas del dueño. */
export default async function AlertasPage() {
  await cargarDatos()
  return (
    <CentroAlertas
      alertas={obtenerTodasAlertas()}
      eventos={obtenerEventosDueno()}
      mascotas={mascotasAlerta()}
      marcas={marcasDePlanes()}
    />
  )
}
