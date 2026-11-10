import type { Metadata } from "next"
import { Suspense } from "react"

import { BuscadorProveedores } from "@/components/proveedores/buscador-proveedores"
import { cargarDatos, obtenerProveedores } from "@/lib/datos"

export const metadata: Metadata = { title: "Veterinarias · Balto" }

/** K3 · Listado de proveedores, con K1, K2, K7 y K8 (?servicio=vacunacion, ?urgencias=1&abierto=1). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <BuscadorProveedores proveedores={obtenerProveedores()} />
    </Suspense>
  )
}
