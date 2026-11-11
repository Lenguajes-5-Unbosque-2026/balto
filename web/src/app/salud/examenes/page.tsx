import type { Metadata } from "next"

import { ExamenesTratamientos } from "@/components/salud/examenes-tratamientos"
import { cargarDatos, obtenerEventosDueno, obtenerPerfiles, obtenerTratamientos } from "@/lib/datos"

export const metadata: Metadata = { title: "Exámenes y tratamientos · Balto" }

/** F3 · Exámenes y tratamientos. */
export default async function ExamenesPage() {
  await cargarDatos()
  // Evento de E5 → tratamiento de G, para abrir G2 desde la tarjeta.
  const tratamientos = Object.fromEntries(obtenerTratamientos().map((t) => [t.evento_id, t.id]))
  return <ExamenesTratamientos mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} tratamientos={tratamientos} />
}
