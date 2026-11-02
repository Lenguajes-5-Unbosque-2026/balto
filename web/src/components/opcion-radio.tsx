import type { ReactNode } from "react"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

type OpcionRadioProps = {
  icono?: string
  titulo: string
  detalle?: ReactNode
  activa: boolean
  onElegir: () => void
}

/** Opción de una sola elección con ícono y círculo de radio (J3, G8, L1…). */
export function OpcionRadio({ icono, titulo, detalle, activa, onElegir }: OpcionRadioProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activa}
      onClick={onElegir}
      className={cn(
        "flex w-full min-h-16 items-center gap-3 rounded-md border bg-superficie px-3.5 py-3 text-left transition-colors movil-m:gap-3.5",
        activa ? "border-primario" : "border-borde-fuerte",
      )}
    >
      {icono && (
        <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
          <Icono nombre={icono} className="icono-m" />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="texto-cuerpo-fuerte text-texto">{titulo}</span>
        {detalle && <span className="texto-etiqueta text-texto-secundario">{detalle}</span>}
      </span>
      <span
        aria-hidden
        className={cn(
          "grid size-5 shrink-0 place-items-center rounded-completo border-2",
          activa ? "border-primario" : "border-texto-secundario",
        )}
      >
        {activa && <span className="size-2.5 rounded-completo bg-primario" />}
      </span>
    </button>
  )
}
