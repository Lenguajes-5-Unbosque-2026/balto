import type { Metadata } from "next"

import { AgregarMedicamento } from "@/components/medicamentos/agregar-medicamento"
import { mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Agregar medicamento · Balto" }

/** G3 · Agregar medicamento, G7 · Revisar fórmula y G4 · Horarios de toma. */
export default function AgregarMedicamentoPage() {
  return <AgregarMedicamento mascotas={mascotasMedicamentos()} />
}
