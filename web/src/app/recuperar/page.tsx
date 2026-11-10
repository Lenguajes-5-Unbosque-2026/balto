import type { Metadata } from "next"
import { Suspense } from "react"

import { Recuperar } from "@/components/acceso/recuperar"
import { EmpezarDeCero } from "@/components/empezar-de-cero"

export const metadata: Metadata = { title: "Recuperar contraseña · Balto" }

/** A8, A14, A9, A15 y A16 (?enlace=vencido). */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <Recuperar />
      </Suspense>
    </EmpezarDeCero>
  )
}
