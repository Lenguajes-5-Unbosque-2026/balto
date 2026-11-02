import type { Metadata } from "next"

import { Bienvenida } from "@/components/acceso/bienvenida"
import { EmpezarDeCero } from "@/components/empezar-de-cero"

export const metadata: Metadata = { title: "Bienvenida · Balto" }

/** A1 · Splash y A2 · Bienvenida. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Bienvenida />
    </EmpezarDeCero>
  )
}
