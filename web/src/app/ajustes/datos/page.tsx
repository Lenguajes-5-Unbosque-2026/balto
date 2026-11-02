import type { Metadata } from "next"

import { DatosDueno } from "@/components/cuenta/datos-dueno"
import { obtenerDueno } from "@/lib/datos"

export const metadata: Metadata = { title: "Mis datos · Balto" }

/** M2 · Editar datos del dueño. */
export default function Pagina() {
  return <DatosDueno dueno={obtenerDueno()} />
}
