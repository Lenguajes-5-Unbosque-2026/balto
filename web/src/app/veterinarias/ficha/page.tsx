import type { Metadata } from "next"
import { Suspense } from "react"

import { FichaProveedor } from "@/components/proveedores/ficha-proveedor"
import { cargarDatos, obtenerProveedores } from "@/lib/datos"

export const metadata: Metadata = { title: "Proveedor · Balto" }

/** K4 · Ficha del proveedor (/veterinarias/ficha?id=v01). */
export default async function Pagina() {
  await cargarDatos()
  return (
    <Suspense>
      <FichaProveedor proveedores={obtenerProveedores()} />
    </Suspense>
  )
}
