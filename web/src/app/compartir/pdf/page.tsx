import type { Metadata } from "next"
import { Suspense } from "react"

import { PdfPerfil } from "@/components/compartir/pdf-perfil"
import { cargarDatos, obtenerDueno, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Perfil de salud · Balto" }

/** Reporte para imprimir o guardar como PDF (Imprimir, Guardar y "Generar y compartir PDF" de L2). */
export default async function PdfPage() {
  await cargarDatos()
  return (
    <Suspense>
      <PdfPerfil mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} dueno={obtenerDueno()} />
    </Suspense>
  )
}
