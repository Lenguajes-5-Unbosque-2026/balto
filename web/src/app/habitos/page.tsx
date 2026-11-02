import type { Metadata } from "next"

import { BitacoraHabitos } from "@/components/habitos/bitacora-habitos"
import { obtenerEventosDueno, obtenerHabitos, obtenerMascotas } from "@/lib/datos"

export const metadata: Metadata = { title: "Hábitos · Balto" }

const mascotas = () => obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))

/** I1 · Bitácora de hábitos e I6 · Bitácora vacía. */
export default function Pagina() {
  return <BitacoraHabitos mascotas={mascotas()} habitos={obtenerHabitos()} eventos={obtenerEventosDueno()} />
}
