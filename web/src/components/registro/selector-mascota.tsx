"use client"

import { useState } from "react"

import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import type { MascotaBasica } from "@/components/registro/tipos"
import { cn } from "@/lib/utils"

type SelectorMascotaProps = {
  mascotas: MascotaBasica[]
  activa: MascotaBasica
  onCambio: (id: string) => void
}

/** Píldora con foto y nombre para cambiar de mascota desde el encabezado (componente Selector de mascota). */
export function SelectorMascota({ mascotas, activa, onCambio }: SelectorMascotaProps) {
  const [abierto, setAbierto] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label={`Mascota: ${activa.nombre}. Cambiar`}
        className="flex h-10.5 items-center gap-2 rounded-completo bg-superficie py-1 pr-2.5 pl-1 shadow-tarjeta"
      >
        <FotoMascota nombre={activa.nombre} imagen={activa.imagen} className="size-8.5" />
        <span className="max-w-20 truncate texto-etiqueta-fuerte text-texto">{activa.nombre}</span>
        <Icono nombre="expand_more" className="icono-s text-texto-secundario" />
      </button>

      <Drawer open={abierto} onOpenChange={setAbierto}>
        <DrawerContent className="mx-auto max-w-lienzo rounded-t-xl border-0 bg-superficie px-6 pt-3 pb-9">
          <span aria-hidden className="mx-auto mb-4 h-1.5 w-11 rounded-completo bg-acento" />
          <DrawerTitle className="mb-4 texto-titulo-tarjeta text-texto">¿Para qué mascota?</DrawerTitle>
          <ul className="flex flex-col gap-2.5">
            {mascotas.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => {
                    onCambio(m.id)
                    setAbierto(false)
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border bg-superficie p-3 text-left",
                    m.id === activa.id ? "border-primario" : "border-borde",
                  )}
                >
                  <FotoMascota nombre={m.nombre} imagen={m.imagen} className="size-10" />
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate texto-cuerpo-fuerte text-texto">{m.nombre}</span>
                    <span className="truncate texto-etiqueta text-texto-secundario">{m.detalle}</span>
                  </span>
                  {m.id === activa.id && <Icono nombre="check_circle" className="icono-m text-primario" />}
                </button>
              </li>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    </>
  )
}
