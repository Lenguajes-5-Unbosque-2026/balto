import Link from "next/link"
import type { ComponentProps } from "react"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

const base = "relative grid size-11 shrink-0 place-items-center rounded-completo border border-borde bg-superficie text-texto"

type Comunes = { icono: string; etiqueta: string; /** Punto de "hay algo nuevo" (campana de Inicio). */ punto?: boolean }

function Contenido({ icono, punto }: Pick<Comunes, "icono" | "punto">) {
  return (
    <>
      <Icono nombre={icono} className="icono-m" />
      {punto && <span aria-hidden className="absolute top-2 right-2 size-2.5 rounded-completo border-2 border-superficie bg-primario" />}
    </>
  )
}

/** Botón redondo de 44 px con borde, para encabezados (componente Botón ícono, variante Claro). */
export function BotonIcono({ icono, etiqueta, punto, className, ...props }: Comunes & ComponentProps<"button">) {
  return (
    <button type="button" aria-label={etiqueta} className={cn(base, className)} {...props}>
      <Contenido icono={icono} punto={punto} />
    </button>
  )
}

export function BotonIconoEnlace({ icono, etiqueta, punto, className, ...props }: Comunes & ComponentProps<typeof Link>) {
  return (
    <Link aria-label={etiqueta} className={cn(base, className)} {...props}>
      <Contenido icono={icono} punto={punto} />
    </Link>
  )
}
