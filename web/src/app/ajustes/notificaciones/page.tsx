import type { Metadata } from "next"

import { ConfigurarNotificaciones } from "@/components/cuenta/configurar-notificaciones"
import { obtenerPreferencias } from "@/lib/datos"

export const metadata: Metadata = { title: "Notificaciones · Balto" }

/** M3 · Configurar notificaciones. */
export default function Pagina() {
  return <ConfigurarNotificaciones preferencias={obtenerPreferencias()} />
}
