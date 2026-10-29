import type { ComponentProps } from "react"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

type ChipProps = ComponentProps<"button"> & {
  texto: string
  icono?: string
  activo?: boolean
}

/** Píldora de 38 px para filtros y tipos (componente Chip del kit). */
export function Chip({ texto, icono, activo, className, ...props }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={activo}
      className={cn(
        "flex h-9.5 shrink-0 items-center gap-1.5 rounded-completo border px-4 texto-etiqueta-fuerte whitespace-nowrap transition-colors",
        activo ? "border-primario-relleno bg-primario-relleno text-superficie" : "border-borde-fuerte bg-superficie text-texto",
        className,
      )}
      {...props}
    >
      {icono && <Icono nombre={icono} className="icono-s" />}
      {texto}
    </button>
  )
}
