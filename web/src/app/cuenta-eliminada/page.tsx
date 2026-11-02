import type { Metadata } from "next"

import { CuentaEliminada } from "@/components/cuenta/eliminar-cuenta"

export const metadata: Metadata = { title: "Cuenta · Balto" }

/** M16 · Cuenta eliminada. */
export default function Pagina() {
  return <CuentaEliminada />
}
