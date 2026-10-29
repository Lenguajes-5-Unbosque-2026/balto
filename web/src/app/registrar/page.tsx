import type { Metadata } from "next"
import Link from "next/link"

import { Icono } from "@/components/icono"

export const metadata: Metadata = { title: "Registrar evento · Balto" }

/** Pantalla completa sin barra inferior, como E1 en Figma. */
export default function RegistrarPage() {
  return (
    <main className="flex-1 px-6 pt-14">
      <header className="relative flex h-11 items-center justify-center">
        <Link
          href="/"
          aria-label="Cerrar"
          className="absolute left-0 grid size-11 place-items-center rounded-completo border border-borde bg-superficie text-texto"
        >
          <Icono nombre="close" className="icono-m" />
        </Link>
        <h1 className="texto-titulo-seccion text-texto">Registrar evento</h1>
      </header>
    </main>
  )
}
