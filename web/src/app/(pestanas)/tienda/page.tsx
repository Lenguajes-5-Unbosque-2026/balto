import type { Metadata } from "next"

import { InicioTienda } from "@/components/tienda/inicio-tienda"
import { datosTienda } from "@/lib/tienda-servidor"

export const metadata: Metadata = { title: "Tienda · Balto" }

/** N1 · Tienda. */
export default function TiendaPage() {
  return <InicioTienda {...datosTienda()} />
}
