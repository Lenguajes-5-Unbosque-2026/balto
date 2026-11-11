import type { Metadata } from "next"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { NuevaMascota } from "@/components/mascota/nueva-mascota"
import { cargarDatos, siguienteCedula } from "@/lib/datos"

export const metadata: Metadata = { title: "Nueva mascota · Balto" }

/** B1 · Datos básicos, B2 · Foto, B4 · Salud inicial y B8 · Salir sin guardar. */
export default async function NuevaMascotaPage() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <NuevaMascota siguienteCedula={siguienteCedula()} />
    </EmpezarDeCero>
  )
}
