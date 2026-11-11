import type { Metadata } from "next"

import { EmpezarDeCero } from "@/components/empezar-de-cero"
import { SelectorTipo } from "@/components/registro/selector-tipo"
import { cargarDatos, obtenerMascotasBasicas } from "@/lib/datos"

export const metadata: Metadata = { title: "Registrar evento · Balto" }

/** E1 · Selector de tipo de evento. Pantalla completa, sin barra inferior. */
export default async function RegistrarPage() {
  await cargarDatos()
  return (
    <EmpezarDeCero>
      <SelectorTipo mascotas={obtenerMascotasBasicas()} />
    </EmpezarDeCero>
  )
}
