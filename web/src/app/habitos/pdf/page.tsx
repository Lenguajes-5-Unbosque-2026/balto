import type { Metadata } from "next"
import { Suspense } from "react"

import { PdfBitacora } from "@/components/habitos/pdf-bitacora"
import { cargarDatos, obtenerEventosDueno, obtenerHabitos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Bitácora · Balto" }

const mascotas = () => obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))

/** Bitácora para imprimir o guardar como PDF (I4). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <PdfBitacora mascotas={mascotas()} habitos={obtenerHabitos()} eventos={obtenerEventosDueno()} />
    </Suspense>
  )
}
