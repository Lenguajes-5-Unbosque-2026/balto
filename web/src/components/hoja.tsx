"use client"

import type { ReactNode } from "react"

import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"

type HojaProps = {
  abierta: boolean
  onCerrar: () => void
  titulo: string
  /** Se monta al abrir, para que cada apertura empiece con los valores actuales. */
  children: ReactNode
}

/** Hoja inferior con agarradera y título (componente Hoja inferior: J3, J8, G8…). */
export function Hoja({ abierta, onCerrar, titulo, children }: HojaProps) {
  return (
    <Drawer open={abierta} onOpenChange={(o) => !o && onCerrar()}>
      <DrawerContent className="mx-auto max-h-[92dvh] max-w-app overflow-y-auto rounded-t-xl border-0 bg-superficie px-pantalla pt-3 pb-9">
        <span aria-hidden className="mx-auto mb-4 h-1.5 w-11 shrink-0 rounded-completo bg-acento" />
        <DrawerTitle className="mb-4 texto-titulo-tarjeta text-texto">{titulo}</DrawerTitle>
        {abierta && children}
      </DrawerContent>
    </Drawer>
  )
}
