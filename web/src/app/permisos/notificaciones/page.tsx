import type { Metadata } from "next"
import { Suspense } from "react"

import { PermisoNotificaciones } from "@/components/estados/estados"

export const metadata: Metadata = { title: "Notificaciones · Balto" }

/** O5 · Permiso de notificaciones (?siguiente=/). */
export default function Pagina() {
  return (
    <Suspense>
      <PermisoNotificaciones />
    </Suspense>
  )
}
