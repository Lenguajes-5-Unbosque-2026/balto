import type { Metadata } from "next"

import { MisMascotas } from "@/components/cuenta/mis-mascotas"
import { obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Mis mascotas · Balto" }

/** M5 · Administrar mascotas. */
export default function Pagina() {
  return <MisMascotas mascotas={obtenerMascotas()} />
}
