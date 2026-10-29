"use client"

import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"

type FilaInterruptorProps = {
  icono: string
  titulo: string
  detalle?: string
  activo: boolean
  onCambio: (activo: boolean) => void
  deshabilitado?: boolean
}

/** Fila de ajuste con interruptor, como "Recordarme el refuerzo" (componente Fila con interruptor). */
export function FilaInterruptor({ icono, titulo, detalle, activo, onCambio, deshabilitado }: FilaInterruptorProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid size-10 shrink-0 place-items-center rounded-completo bg-acento-suave text-primario">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="texto-cuerpo-fuerte text-texto">{titulo}</span>
        {detalle && <span className="texto-etiqueta text-texto-secundario">{detalle}</span>}
      </span>
      <Interruptor etiqueta={titulo} activo={activo} onCambio={onCambio} deshabilitado={deshabilitado} />
    </div>
  )
}
