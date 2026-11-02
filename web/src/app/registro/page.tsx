import type { Metadata } from "next"
import { Suspense } from "react"

import { Registro } from "@/components/acceso/registro"
import { EmpezarDeCero } from "@/components/empezar-de-cero"

export const metadata: Metadata = { title: "Crear cuenta · Balto" }

/** A3 · Crear cuenta, A4 · Verificar correo (A12, A13, A13.2) y A5 · Datos del dueño. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <Registro />
      </Suspense>
    </EmpezarDeCero>
  )
}
