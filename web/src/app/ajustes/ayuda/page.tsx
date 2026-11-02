import type { Metadata } from "next"

import { Ayuda } from "@/components/cuenta/ayuda"

export const metadata: Metadata = { title: "Ayuda · Balto" }

/** M8 · Ayuda. */
export default function Pagina() {
  return <Ayuda />
}
