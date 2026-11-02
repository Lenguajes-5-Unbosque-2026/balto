import type { Metadata } from "next"

import { EliminarCuenta } from "@/components/cuenta/eliminar-cuenta"

export const metadata: Metadata = { title: "Eliminar cuenta · Balto" }

/** M15 · Confirmar identidad. */
export default function Pagina() {
  return <EliminarCuenta />
}
