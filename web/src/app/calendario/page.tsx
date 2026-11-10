import type { Metadata } from "next"
import { Suspense } from "react"

import { CalendarioCitas } from "@/components/proveedores/citas"
import { marcasDePlanes, mascotasAlerta } from "@/lib/alertas-servidor"
import { cargarDatos, obtenerEventosDueno, obtenerTodasAlertas } from "@/lib/datos"
import { datosProveedores } from "@/lib/proveedores-servidor"

export const metadata: Metadata = { title: "Calendario · Balto" }

/** K6 · Calendario unificado: citas y las alertas que el dueño agregó desde J1. */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <CalendarioCitas
        {...datosProveedores()}
        recordatorios={{ alertas: obtenerTodasAlertas(), eventos: obtenerEventosDueno(), mascotas: mascotasAlerta(), marcas: marcasDePlanes() }}
      />
    </Suspense>
  )
}
