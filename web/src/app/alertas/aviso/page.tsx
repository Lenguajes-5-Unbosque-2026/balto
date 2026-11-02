import type { Metadata } from "next"
import { Suspense } from "react"

import { AvisoAlerta } from "@/components/alertas/aviso-alerta"
import { marcasDePlanes, mascotasAlerta } from "@/lib/alertas-servidor"
import { obtenerEventosDueno, obtenerTodasAlertas } from "@/lib/datos"

export const metadata: Metadata = { title: "Aviso · Balto" }

/** J6 · Aviso de vacuna: la notificación de una alerta (/alertas/aviso?id=a08). */
export default function AvisoPage() {
  return (
    <Suspense>
      <AvisoAlerta alertas={obtenerTodasAlertas()} eventos={obtenerEventosDueno()} mascotas={mascotasAlerta()} marcas={marcasDePlanes()} />
    </Suspense>
  )
}
