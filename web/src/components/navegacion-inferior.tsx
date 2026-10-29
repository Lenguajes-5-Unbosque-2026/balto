"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

const secciones = [
  { href: "/", nombre: "Inicio", icono: "home" },
  { href: "/linea-de-tiempo", nombre: "Línea de tiempo", icono: "view_timeline" },
  { href: "/registrar", nombre: "Registrar", icono: "add", principal: true },
  { href: "/tienda", nombre: "Tienda", icono: "storefront" },
  { href: "/alertas", nombre: "Alertas", icono: "notifications" },
]

/** Barra flotante oscura de la parte inferior (componente Navegación inferior del kit). */
export function NavegacionInferior() {
  const ruta = usePathname()

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-4 bottom-4 z-10 mx-auto flex h-18 max-w-navegacion items-center justify-between rounded-completo bg-oscuro px-3 shadow-flotante"
    >
      {secciones.map((s) => {
        const activa = s.href === "/" ? ruta === "/" : ruta.startsWith(s.href)
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-label={s.nombre}
            aria-current={activa ? "page" : undefined}
            className={cn(
              "grid place-items-center rounded-completo text-superficie transition-colors",
              s.principal ? "size-13 bg-superficie text-primario" : "size-12",
              activa && !s.principal && "bg-primario-relleno",
            )}
          >
            <Icono nombre={s.icono} className={s.principal ? "icono-xl" : "icono-l"} />
          </Link>
        )
      })}
    </nav>
  )
}
