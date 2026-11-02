import type { Metadata } from "next"

import { Ajustes } from "@/components/cuenta/ajustes"
import { obtenerDueno, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Ajustes · Balto" }

/** M1 · Ajustes. Se abre con el avatar de Inicio. */
export default function Pagina() {
  return <Ajustes dueno={obtenerDueno()} mascotas={obtenerMascotas()} />
}
