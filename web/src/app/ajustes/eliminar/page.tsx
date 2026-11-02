import type { Metadata } from "next"

import { EliminarCuenta } from "@/components/cuenta/eliminar-cuenta"
import { EmpezarDeCero } from "@/components/empezar-de-cero"

export const metadata: Metadata = { title: "Eliminar cuenta · Balto" }

/** M15 · Confirmar identidad. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <EliminarCuenta />
    </EmpezarDeCero>
  )
}
