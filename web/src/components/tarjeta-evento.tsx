import Link from "next/link"

import { Icono } from "@/components/icono"
import { detalleEvento, iconoEvento, textoSoportes, tituloEvento, type Evento } from "@/lib/eventos"
import { fechaTarjeta } from "@/lib/fecha"
import { cn } from "@/lib/utils"

type TarjetaEventoProps = {
  evento: Evento
  href: string
  /** Peso anterior de la misma mascota, para "+0,3 kg vs. agosto". */
  anterior?: Evento
  /** "borde" en la línea de tiempo (D2); "sombra" en E9 y en los resultados de búsqueda (D9). */
  variante?: "sombra" | "borde"
  className?: string
}

/** Evento con ícono, título, detalle, fecha y soportes (componente Tarjeta de evento). */
export function TarjetaEvento({ evento, href, anterior, variante = "sombra", className }: TarjetaEventoProps) {
  const soportes = evento.soportes?.length ?? 0
  return (
    <Link
      href={href}
      className={cn(
        "flex min-w-0 items-center gap-3.5 rounded-md bg-superficie p-3.5",
        variante === "borde" ? "border border-borde-fuerte" : "shadow-tarjeta",
        className,
      )}
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={iconoEvento(evento)} className="icono-l" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate texto-cuerpo-fuerte text-texto">{tituloEvento(evento)}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">{detalleEvento(evento, anterior)}</span>
        <span className="flex items-center gap-2 texto-micro normal-case">
          <span className="text-primario uppercase">{fechaTarjeta(evento.fecha)}</span>
          <span className="flex items-center gap-0.5 text-texto-secundario">
            <Icono nombre="attach_file" className="icono-xs" />
            {textoSoportes(soportes)}
          </span>
        </span>
      </span>
      <Icono nombre="chevron_right" className="icono-m text-texto-secundario" />
    </Link>
  )
}
