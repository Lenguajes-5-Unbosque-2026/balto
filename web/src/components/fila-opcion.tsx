import Link from "next/link"
import type { ReactNode } from "react"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

const tonos = {
  neutro: "bg-acento-suave text-primario",
  exito: "bg-exito-suave text-exito",
  error: "bg-error-suave text-error",
}

type FilaOpcionProps = {
  icono: string
  titulo: string
  detalle?: ReactNode
  tono?: keyof typeof tonos
  /** Con borde (J2) o sin borde sobre fondo blanco (J4, J7). */
  borde?: boolean
  /** Lo que va a la derecha; por defecto, la flecha. */
  derecha?: ReactNode
  href?: string
  onClick?: () => void
  className?: string
}

/** Fila tocable con ícono en cuadro, título, detalle y flecha (componente Fila de opción). */
export function FilaOpcion({ icono, titulo, detalle, tono = "neutro", borde, derecha, href, onClick, className }: FilaOpcionProps) {
  const clases = cn(
    "flex w-full min-w-0 items-center gap-3 rounded-md bg-superficie p-3.5 text-left movil-m:gap-3.5",
    borde && "border border-borde-fuerte",
    className,
  )
  const contenido = (
    <>
      <span className={cn("grid size-10 shrink-0 place-items-center rounded-sm", tonos[tono])}>
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate texto-cuerpo-fuerte text-texto">{titulo}</span>
        {detalle && <span className="truncate texto-etiqueta text-texto-secundario">{detalle}</span>}
      </span>
      {derecha ?? <Icono nombre="chevron_right" className="shrink-0 icono-m text-texto-secundario" />}
    </>
  )
  if (href) {
    return (
      <Link href={href} onClick={onClick} className={clases}>
        {contenido}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} className={clases}>
      {contenido}
    </button>
  )
}
