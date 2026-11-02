import type { Metadata } from "next"

import { ListadoMedicamentos } from "@/components/medicamentos/listado-medicamentos"
import { datosMedicamentos, mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Medicamentos · Balto" }

/** G1 · Listado de medicamentos. */
export default function MedicamentosPage() {
  return <ListadoMedicamentos mascotas={mascotasMedicamentos()} {...datosMedicamentos()} />
}
