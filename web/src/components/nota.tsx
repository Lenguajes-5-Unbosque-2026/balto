import type { ReactNode } from "react"

import { Icono } from "@/components/icono"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

const tonos = {
  info: "border-transparent bg-acento-suave text-primario",
  exito: "border-exito-borde bg-exito-suave text-exito",
  error: "border-error-borde bg-error-suave text-error",
}

/** Nota corta con ícono sobre fondo suave (componente Nota). */
export function Nota({ icono = "info", tono = "info", children }: { icono?: string; tono?: keyof typeof tonos; children: ReactNode }) {
  return (
    <Alert className={cn("flex items-start gap-2.5 rounded-md px-4 py-3.5", tonos[tono])}>
      <Icono nombre={icono} className="icono-s" />
      <AlertDescription className="texto-etiqueta text-texto">{children}</AlertDescription>
    </Alert>
  )
}
