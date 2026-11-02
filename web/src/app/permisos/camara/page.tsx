import type { Metadata } from "next"

import { PermisoCamara } from "@/components/estados/estados"

export const metadata: Metadata = { title: "Cámara · Balto" }

/** O6 · Permiso de cámara. */
export default function Pagina() {
  return <PermisoCamara />
}
