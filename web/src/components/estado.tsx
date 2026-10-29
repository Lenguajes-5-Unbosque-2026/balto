import type { ReactNode } from "react"

import { Icono } from "@/components/icono"
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

const tonos = {
  neutro: "bg-acento-suave text-primario",
  exito: "bg-exito-suave text-exito",
  error: "bg-error-suave text-error",
}

type EstadoProps = {
  icono: string
  titulo: string
  mensaje?: ReactNode
  tono?: keyof typeof tonos
}

/** Bloque de estado centrado: ícono en círculo, título y mensaje (componente Estado). */
export function Estado({ icono, titulo, mensaje, tono = "neutro" }: EstadoProps) {
  return (
    <Empty className="flex-none gap-3.5 border-0 p-0">
      <EmptyHeader className="max-w-none gap-3.5">
        <EmptyMedia className={cn("mb-2 size-26 rounded-completo", tonos[tono])}>
          <Icono nombre={icono} className="icono-estado" />
        </EmptyMedia>
        <EmptyTitle className="texto-titulo-pantalla text-texto">{titulo}</EmptyTitle>
        {mensaje && <EmptyDescription className="texto-cuerpo text-texto-secundario">{mensaje}</EmptyDescription>}
      </EmptyHeader>
    </Empty>
  )
}
