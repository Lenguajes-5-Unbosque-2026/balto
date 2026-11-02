"use client"

import Link from "next/link"

import { BotonIconoEnlace } from "@/components/boton-icono"
import { iniciales } from "@/lib/perfil"

/** Avatar del dueño, saludo y botones de compartir y notificaciones (componente Encabezado de inicio). */
export function EncabezadoInicio({ nombre }: { nombre: string }) {
  const primerNombre = nombre.split(" ")[0]
  return (
    <header className="flex h-12.5 items-center gap-2.5 movil-m:gap-3">
      <Link
        href="/ajustes"
        aria-label="Ajustes"
        className="grid size-11 shrink-0 place-items-center rounded-completo bg-acento-suave texto-cuerpo-fuerte text-texto-secundario movil-m:size-12"
      >
        {iniciales(nombre)}
      </Link>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate texto-titulo-seccion text-texto movil-m:texto-titulo-tarjeta">Hola, {primerNombre}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">Todo en un solo lugar</span>
      </span>
      <BotonIconoEnlace href="/compartir" icono="ios_share" etiqueta="Compartir perfil" />
      <BotonIconoEnlace href="/notificaciones" icono="notifications" etiqueta="Notificaciones" punto />
    </header>
  )
}
