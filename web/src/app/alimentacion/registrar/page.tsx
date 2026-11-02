import type { Metadata } from "next"
import { Suspense } from "react"

import { RegistrarAlimento } from "@/components/alimentacion/registrar-alimento"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { datosAlimentacion } from "@/lib/alimentacion-servidor"
import { obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Registrar alimento · Balto" }

/** H2 · Registrar alimento, H3 · Alimento tóxico y H4 · Porción y horarios (?editar=1 cambia el plan actual). */
export default function RegistrarAlimentoPage() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <RegistrarAlimento mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} {...datosAlimentacion()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
