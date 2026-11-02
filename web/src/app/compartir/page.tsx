import type { Metadata } from "next"
import { Suspense } from "react"

import { CompartirPerfil } from "@/components/compartir/compartir-perfil"
import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { obtenerEnvios, obtenerEventosDueno, obtenerPerfiles } from "@/lib/datos"

export const metadata: Metadata = { title: "Compartir perfil · Balto" }

/** L1–L4, L3 y L7 (/compartir?contenido=vacunas marca el carnet; ?contenido=examen, el examen). */
export default function CompartirPage() {
  return (
    <EmpezarDeCero>
      <Suspense>
        <CompartirPerfil mascotas={obtenerPerfiles()} eventos={obtenerEventosDueno()} envios={obtenerEnvios()} />
      </Suspense>
    </EmpezarDeCero>
  )
}
