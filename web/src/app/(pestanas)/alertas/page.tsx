import type { Metadata } from "next"

import { TituloSeccion } from "@/components/titulo-seccion"

export const metadata: Metadata = { title: "Alertas · Balto" }

export default function AlertasPage() {
  return <TituloSeccion titulo="Alertas" />
}
