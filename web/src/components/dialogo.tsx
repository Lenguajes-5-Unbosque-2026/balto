"use client"

import type { ReactNode } from "react"

import { Icono } from "@/components/icono"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { cn } from "@/lib/utils"

const tonos = {
  aviso: "bg-acento-suave text-error",
  destructivo: "bg-error text-superficie",
}

type DialogoProps = {
  abierto: boolean
  onCerrar: () => void
  icono: string
  tono?: keyof typeof tonos
  titulo: string
  mensaje: ReactNode
  /** Los botones, apilados. */
  children: ReactNode
}

/** Diálogo centrado con ícono, título, mensaje y botones apilados (componente Diálogo: B8, D7). */
export function Dialogo({ abierto, onCerrar, icono, tono = "aviso", titulo, mensaje, children }: DialogoProps) {
  return (
    <AlertDialog open={abierto} onOpenChange={(o) => !o && onCerrar()}>
      <AlertDialogContent className="flex max-w-contenido flex-col items-center gap-3 rounded-dialogo bg-superficie p-7 text-center ring-0">
        <span className={cn("mb-1 grid size-16 place-items-center rounded-completo", tonos[tono])}>
          <Icono nombre={icono} className="icono-l" />
        </span>
        <AlertDialogTitle className="texto-titulo-tarjeta text-texto">{titulo}</AlertDialogTitle>
        <AlertDialogDescription className="texto-cuerpo text-texto-secundario">{mensaje}</AlertDialogDescription>
        <div className="mt-3 flex w-full flex-col gap-3">{children}</div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
