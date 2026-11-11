import type { Metadata } from "next"

import { ConfigurarNotificaciones } from "@/components/cuenta/configurar-notificaciones"
import { cargarDatos, obtenerPreferencias } from "@/lib/datos"

export const metadata: Metadata = { title: "Notificaciones · Balto" }

/** M3 · Configurar notificaciones. */
export default async function Pagina() {
  await cargarDatos()
  return <ConfigurarNotificaciones preferencias={obtenerPreferencias()} />
}
