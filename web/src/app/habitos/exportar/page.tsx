import type { Metadata } from "next"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { ExportarBitacora } from "@/components/habitos/exportar-bitacora"
import { obtenerEventosDueno, obtenerHabitos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Exportar bitácora · Balto" }

const mascotas = () => obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))

/** I3 · Exportar bitácora, I4 · Vista previa e I5 · Bitácora enviada. */
export default function Pagina() {
  return (
    <EmpezarDeCero>
      <ExportarBitacora mascotas={mascotas()} habitos={obtenerHabitos()} eventos={obtenerEventosDueno()} />
    </EmpezarDeCero>
  )
}
