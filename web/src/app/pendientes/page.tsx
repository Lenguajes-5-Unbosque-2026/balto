import type { Metadata } from "next"

import { GuardadoPendiente } from "@/components/estados/estados"

export const metadata: Metadata = { title: "Pendientes · Balto" }

/** O3 · Guardado pendiente. */
export default function Pagina() {
  return <GuardadoPendiente />
}
