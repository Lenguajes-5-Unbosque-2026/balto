import type { Metadata } from "next"

import { Bienvenida } from "@/components/acceso/bienvenida"

export const metadata: Metadata = { title: "Bienvenida · Balto" }

/** A1 · Splash y A2 · Bienvenida. */
export default function Pagina() {
  return <Bienvenida />
}
