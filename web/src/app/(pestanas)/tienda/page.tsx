import type { Metadata } from "next"

import { InicioTienda } from "@/components/tienda/inicio-tienda"
import { cargarDatos } from "@/lib/datos"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Tienda · Balto" }

/** N1 · Tienda. */
export default async function TiendaPage() {
  await cargarDatos()
  return <InicioTienda {...datosTienda()} />
}
