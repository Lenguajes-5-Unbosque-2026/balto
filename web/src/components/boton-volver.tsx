"use client"

import { BotonIcono } from "@/components/boton-icono"
import { useVolver } from "@/lib/usar-salud"

/** Flecha (o X) que vuelve a la pantalla anterior de la app o, si se abrió el enlace directo, a `respaldo`. */
export function BotonVolver({ respaldo, cerrar, className }: { respaldo: string; cerrar?: boolean; className?: string }) {
  const volver = useVolver(respaldo)
  return <BotonIcono icono={cerrar ? "close" : "arrow_back"} etiqueta={cerrar ? "Cerrar" : "Volver"} onClick={volver} className={className} />
}
