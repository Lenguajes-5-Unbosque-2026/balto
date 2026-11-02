import type { Metadata } from "next"
import { Suspense } from "react"

import { AlertaResuelta } from "@/components/alertas/alerta-resuelta"
import { marcasDePlanes, mascotasAlerta } from "@/lib/alertas-servidor"
import { anticipacionAvisos, obtenerEventosDueno, obtenerTodasAlertas } from "@/lib/datos"

export const metadata: Metadata = { title: "Alerta resuelta · Balto" }

/** J5 · Alerta resuelta (/alertas/resuelta?id=a08&evento=…). */
export default function AlertaResueltaPage() {
  return (
    <Suspense>
      <AlertaResuelta
        alertas={obtenerTodasAlertas()}
        eventos={obtenerEventosDueno()}
        mascotas={mascotasAlerta()}
        marcas={marcasDePlanes()}
        anticipacion={anticipacionAvisos()}
      />
    </Suspense>
  )
}
