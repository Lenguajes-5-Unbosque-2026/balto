import type { Metadata } from "next"

import { SinConexion } from "@/components/estados/estados"

export const metadata: Metadata = { title: "Sin conexión · Balto" }

/** O2 · Sin conexión. */
export default function Pagina() {
  return <SinConexion />
}
