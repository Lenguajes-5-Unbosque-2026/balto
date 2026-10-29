"use client"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type SelectorProps = {
  opciones: { valor: string; etiqueta: string }[]
  valor: string
  onCambio: (valor: string) => void
  etiqueta: string
}

/** Control segmentado de 2 o 3 opciones (componentes Selector y Selector triple del kit). */
export function Selector({ opciones, valor, onCambio, etiqueta }: SelectorProps) {
  return (
    <ToggleGroup
      aria-label={etiqueta}
      value={[valor]}
      onValueChange={(v) => v[0] && onCambio(v[0])}
      className="flex h-11 w-full gap-0 rounded-completo bg-acento-suave p-1"
    >
      {opciones.map((o) => (
        <ToggleGroupItem
          key={o.valor}
          value={o.valor}
          className="h-full flex-1 rounded-completo texto-etiqueta-fuerte text-texto-secundario hover:bg-transparent aria-pressed:bg-superficie aria-pressed:text-texto aria-pressed:shadow-tarjeta"
        >
          {o.etiqueta}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
