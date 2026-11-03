import type { Metadata } from "next"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { SelectorTipo } from "@/components/registro/selector-tipo"
import { obtenerMascotasBasicas } from "@/lib/datos"

export const metadata: Metadata = { title: "Registrar evento · Balto" }

/** E1 · Selector de tipo de evento. Pantalla completa, sin barra inferior. */
export default function RegistrarPage() {
  return (
    <EmpezarDeCero>
      <SelectorTipo mascotas={obtenerMascotasBasicas()} />
    </EmpezarDeCero>
  )
}
