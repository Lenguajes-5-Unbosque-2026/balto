"use client"

import { Icono } from "@/components/icono"
import { SelectorMascota } from "@/components/registro/selector-mascota"
import type { MascotaBasica } from "@/components/registro/tipos"

type EncabezadoRegistroProps = {
  onCerrar: () => void
  mascotas?: MascotaBasica[]
  activa?: MascotaBasica
  onCambioMascota?: (id: string) => void
}

/** Encabezado de los formularios de E: cerrar, título y selector de mascota. */
export function EncabezadoRegistro({ onCerrar, mascotas, activa, onCambioMascota }: EncabezadoRegistroProps) {
  return (
    <header className="flex h-11 items-center gap-3">
      <button
        type="button"
        onClick={onCerrar}
        aria-label="Cerrar"
        className="grid size-11 shrink-0 place-items-center rounded-completo border border-borde bg-superficie text-texto"
      >
        <Icono nombre="close" className="icono-m" />
      </button>
      <h1 className="flex-1 texto-titulo-seccion text-texto">Registrar evento</h1>
      {mascotas && activa && onCambioMascota && (
        <SelectorMascota mascotas={mascotas} activa={activa} onCambio={onCambioMascota} />
      )}
    </header>
  )
}
