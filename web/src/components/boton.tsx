import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Botón en píldora de 56 px del kit, sobre el Button de shadcn/ui. */
export const botonVariants = cva(
  "h-14 w-full min-w-0 shrink gap-2.5 rounded-completo px-4 texto-boton transition-colors disabled:opacity-50",
  {
    variants: {
      variante: {
        primario: "bg-primario-relleno text-superficie hover:bg-primario",
        secundario: "border border-primario bg-transparent text-primario hover:bg-acento-suave",
        suave: "bg-acento text-primario hover:bg-acento-suave",
        destructivo: "bg-error text-superficie hover:bg-error",
        "destructivo-contorno": "border border-error bg-transparent text-error hover:bg-error-suave",
      },
    },
    defaultVariants: { variante: "primario" },
  },
)

type BotonProps = ComponentProps<typeof Button> & VariantProps<typeof botonVariants>

export function Boton({ variante, className, ...props }: BotonProps) {
  return <Button className={cn(botonVariants({ variante }), className)} {...props} />
}

type BotonEnlaceProps = ComponentProps<typeof Link> & VariantProps<typeof botonVariants>

/** Mismo botón, pero como enlace de navegación. */
export function BotonEnlace({ variante, className, ...props }: BotonEnlaceProps) {
  return (
    <Link
      className={cn("inline-flex items-center justify-center", botonVariants({ variante }), className)}
      {...props}
    />
  )
}
