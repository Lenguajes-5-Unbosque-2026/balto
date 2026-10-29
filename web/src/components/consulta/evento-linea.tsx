import type { ReactNode } from "react"

import { TarjetaEvento } from "@/components/tarjeta-evento"
import type { Evento } from "@/lib/eventos"
import { cn } from "@/lib/utils"

/** Lista de un mes con la línea vertical que une los puntos (componente Evento de línea de tiempo). */
export function LineaMes({ children, cantidad }: { children: ReactNode; cantidad: number }) {
  return (
    <ul className="relative flex flex-col gap-3">
      {/* La línea va de la mitad de la primera tarjeta a la mitad de la última; los puntos la tapan en los extremos. */}
      {cantidad > 1 && <span aria-hidden className="absolute top-10 bottom-10 left-1.75 w-0.5 bg-acento" />}
      {children}
    </ul>
  )
}

/** Punto de la línea con la tarjeta del evento. El más reciente lleva el punto relleno. */
export function EventoLinea({ evento, anterior, reciente }: { evento: Evento; anterior?: Evento; reciente?: boolean }) {
  return (
    <li className="relative flex items-center gap-2.5">
      <span
        aria-hidden
        className={cn(
          "size-4 shrink-0 rounded-completo border-2 border-primario",
          reciente ? "bg-primario ring-4 ring-acento-suave" : "bg-fondo",
        )}
      />
      <TarjetaEvento evento={evento} anterior={anterior} href={`/evento?id=${evento.id}`} variante="borde" className="flex-1" />
    </li>
  )
}
