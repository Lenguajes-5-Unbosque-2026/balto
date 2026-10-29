import type { Metadata } from "next"
import { Suspense } from "react"

import { EventoGuardado } from "@/components/registro/evento-guardado"
import { anticipacionAvisos, obtenerMascotasBasicas } from "@/lib/datos"

export const metadata: Metadata = { title: "Evento guardado · Balto" }

/** E9 · Evento guardado. El evento se lee del navegador, por eso va dentro de Suspense. */
export default function GuardadoPage() {
  return (
    <Suspense>
      <EventoGuardado mascotas={obtenerMascotasBasicas()} anticipacion={anticipacionAvisos()} />
    </Suspense>
  )
}
