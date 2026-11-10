import type { Metadata } from "next"

import { Ingresar } from "@/components/acceso/ingresar"
import { EmpezarDeCero } from "@/components/empezar-de-cero"

export const metadata: Metadata = { title: "Iniciar sesión · Balto" }

/** A6 · Inicio de sesión y A7 · Error de credenciales. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <Ingresar />
    </EmpezarDeCero>
  )
}
