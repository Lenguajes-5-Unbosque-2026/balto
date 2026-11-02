import type { Metadata } from "next"
import { Suspense } from "react"

import { Recuperar } from "@/components/acceso/recuperar"

export const metadata: Metadata = { title: "Recuperar contraseña · Balto" }

/** A8, A14, A9, A15 y A16 (?enlace=vencido). */
export default function Pagina() {
  return (
    <Suspense>
      <Recuperar />
    </Suspense>
  )
}
