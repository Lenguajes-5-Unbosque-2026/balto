import type { Metadata } from "next"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { RegistrarHabito } from "@/components/habitos/registrar-habito"
import { obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Registrar hábito · Balto" }

const mascotas = () => obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))

/** I2 · Registrar hábito. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <RegistrarHabito mascotas={mascotas()} />
    </EmpezarDeCero>
  )
}
