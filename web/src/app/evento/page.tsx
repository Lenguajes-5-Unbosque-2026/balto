import type { Metadata } from "next"
import { Suspense } from "react"

import { DetalleEvento } from "@/components/consulta/detalle-evento"
import { obtenerDueno, obtenerEventosDueno } from "@/lib/datos"

export const metadata: Metadata = { title: "Detalle · Balto" }

/**
 * D4 · Detalle de evento (/evento?id=e14). El id va en la consulta y no en la ruta
 * porque los eventos registrados en el navegador no existen en el servidor.
 */
export default function EventoPage() {
  return (
    <Suspense>
      <DetalleEvento eventos={obtenerEventosDueno()} dueno={obtenerDueno().nombre.split(" ")[0]} />
    </Suspense>
  )
}
