"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

import { Icono } from "@/components/icono"

/** Mensaje breve del kit («Cambios guardados», «Evento eliminado»). Balto no tiene modo oscuro. */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      position="top-center"
      className="toaster group"
      icons={{
        success: <Icono nombre="check_circle" className="icono-m text-exito" />,
        info: <Icono nombre="info" className="icono-m text-primario" />,
        warning: <Icono nombre="warning" className="icono-m text-error" />,
        error: <Icono nombre="error" className="icono-m text-error" />,
      }}
      toastOptions={{
        classNames: {
          toast: "rounded-md! border-0! bg-oscuro! px-4! py-3.5! shadow-flotante! gap-2.5!",
          title: "texto-etiqueta-fuerte! text-superficie!",
          description: "texto-etiqueta! text-acento!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
