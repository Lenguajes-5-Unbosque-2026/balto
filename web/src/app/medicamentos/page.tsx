import type { Metadata } from "next"

import { ListadoMedicamentos } from "@/components/medicamentos/listado-medicamentos"
import { cargarDatos } from "@/lib/datos"
import { datosMedicamentos, mascotasMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Medicamentos · Balto" }

/** G1 · Listado de medicamentos. */
export default async function MedicamentosPage() {
  await cargarDatos()
  return <ListadoMedicamentos mascotas={mascotasMedicamentos()} {...datosMedicamentos()} />
}
