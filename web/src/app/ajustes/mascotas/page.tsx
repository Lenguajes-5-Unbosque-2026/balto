import type { Metadata } from "next"

import { MisMascotas } from "@/components/cuenta/mis-mascotas"
import { cargarDatos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Mis mascotas · Balto" }

/** M5 · Administrar mascotas. */
export default async function Pagina() {
  await cargarDatos()
  return <MisMascotas mascotas={obtenerMascotas()} />
}
