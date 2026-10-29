import type { Metadata } from "next"

import { TituloSeccion } from "@/components/titulo-seccion"

export const metadata: Metadata = { title: "Tienda · Balto" }

export default function TiendaPage() {
  return <TituloSeccion titulo="Tienda" />
}
