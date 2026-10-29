import type { Metadata } from "next"

import { TituloSeccion } from "@/components/titulo-seccion"

export const metadata: Metadata = { title: "Línea de tiempo · Balto" }

export default function LineaDeTiempoPage() {
  return <TituloSeccion titulo="Línea de tiempo" />
}
