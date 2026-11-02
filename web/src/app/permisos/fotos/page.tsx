import type { Metadata } from "next"

import { PermisoFotos } from "@/components/estados/estados"

export const metadata: Metadata = { title: "Fotos · Balto" }

/** O7 · Permiso de fotos. */
export default function Pagina() {
  return <PermisoFotos />
}
