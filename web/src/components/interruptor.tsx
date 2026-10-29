"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { cn } from "@/lib/utils"

type InterruptorProps = {
  activo: boolean
  onCambio: (activo: boolean) => void
  deshabilitado?: boolean
  etiqueta: string
}

/** Interruptor de 52 × 32 del kit (Encendido · Apagado). */
export function Interruptor({ activo, onCambio, deshabilitado, etiqueta }: InterruptorProps) {
  return (
    <SwitchPrimitive.Root
      aria-label={etiqueta}
      checked={activo}
      onCheckedChange={onCambio}
      disabled={deshabilitado}
      className={cn(
        "inline-flex h-8 w-13 shrink-0 items-center rounded-completo p-1 transition-colors outline-none",
        "focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-primario-relleno data-unchecked:bg-acento",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
      )}
    >
      <SwitchPrimitive.Thumb className="block size-6 rounded-completo bg-superficie transition-transform data-checked:translate-x-5" />
    </SwitchPrimitive.Root>
  )
}
