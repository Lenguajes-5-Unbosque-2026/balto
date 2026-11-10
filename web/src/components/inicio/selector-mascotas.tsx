"use client"

import Link from "next/link"
import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import type { PerfilMascota } from "@/lib/perfil"
import { cn } from "@/lib/utils"

type SelectorMascotasProps = {
  mascotas: PerfilMascota[]
  activa: PerfilMascota
  onCambio: (id: string) => void
}

/** Chips con foto para elegir la mascota activa, y el + para agregar otra (B1). */
export function SelectorMascotas({ mascotas, activa, onCambio }: SelectorMascotasProps) {
  return (
    <nav aria-label="Mascotas" className="sin-barra-desplazamiento -mx-pantalla overflow-x-auto px-pantalla">
      <ul className="flex w-max items-center gap-3">
        {mascotas.map((m) => {
          const elegida = m.id === activa.id
          return (
            <li key={m.id}>
              <button
                type="button"
                aria-pressed={elegida}
                onClick={() => onCambio(m.id)}
                className={cn(
                  "flex h-12 items-center gap-2 rounded-completo py-1 pr-3.5 pl-1 texto-cuerpo-fuerte transition-colors",
                  elegida ? "bg-primario-relleno text-superficie" : "bg-superficie text-texto",
                )}
              >
                {/* Fondo gris: la píldora elegida es verde, como el fondo de las fotos. */}
                <FotoMascota nombre={m.nombre} imagen={m.imagen} prioritaria className="size-10 bg-acento" />
                {m.nombre}
              </button>
            </li>
          )
        })}
        <li>
          <Link
            href="/mascotas/nueva"
            aria-label="Agregar mascota"
            className="grid size-12 place-items-center rounded-completo border border-dashed border-primario text-primario"
          >
            <Icono nombre="add" className="icono-m" />
          </Link>
        </li>
      </ul>
    </nav>
  )
}
