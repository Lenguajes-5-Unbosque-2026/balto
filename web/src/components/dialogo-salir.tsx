"use client"

import { Boton } from "@/components/boton"
import { Icono } from "@/components/icono"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type DialogoSalirProps = {
  abierto: boolean
  onSeguir: () => void
  onSalir: () => void
  /** "de este evento", "de esta mascota"… */
  objeto: string
}

/** Diálogo "¿Salir sin guardar?" de B8, reutilizado en E. */
export function DialogoSalir({ abierto, onSeguir, onSalir, objeto }: DialogoSalirProps) {
  return (
    <AlertDialog open={abierto} onOpenChange={(o) => !o && onSeguir()}>
      <AlertDialogContent className="flex max-w-contenido flex-col items-center gap-3 rounded-dialogo bg-superficie p-7 text-center ring-0">
        <span className="mb-1 grid size-16 place-items-center rounded-completo bg-acento-suave text-error">
          <Icono nombre="warning" className="icono-l" />
        </span>
        <AlertDialogTitle className="texto-titulo-tarjeta text-texto">¿Salir sin guardar?</AlertDialogTitle>
        <AlertDialogDescription className="texto-cuerpo text-texto-secundario">
          Perderás los datos que escribiste {objeto}.
        </AlertDialogDescription>
        <div className="mt-3 flex w-full flex-col gap-3">
          <Boton onClick={onSeguir}>Seguir editando</Boton>
          <Boton variante="destructivo-contorno" onClick={onSalir}>
            Salir y descartar
          </Boton>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
