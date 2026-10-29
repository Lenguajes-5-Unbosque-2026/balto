"use client"

import Link from "next/link"

import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import type { MascotaBasica } from "@/components/registro/tipos"
import { TIPOS_EVENTO } from "@/lib/eventos"
import { useMascotaActiva } from "@/lib/mascota-activa"

/**
 * Guiones opcionales (­) para que, en teléfonos angostos, los nombres largos
 * se partan por sílabas en vez de salirse del recuadro. A 390 px no se parten.
 */
const CORTES: Record<string, string> = {
  desparasitacion: "Despara­sitación",
  tratamiento: "Trata­miento",
  alimentacion: "Alimen­tación",
  comportamiento: "Compor­tamiento",
}

/** E1 · Selector de tipo de evento: la mascota activa y la cuadrícula de 9 tipos. */
export function SelectorTipo({ mascotas }: { mascotas: MascotaBasica[] }) {
  const [mascota] = useMascotaActiva(mascotas)
  return (
    <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
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

      <div className="flex items-center gap-3.5">
        <FotoMascota nombre={mascota.nombre} imagen={mascota.imagen} className="size-16 rounded-md" prioritaria />
        <div className="flex min-w-0 flex-col">
          <span className="truncate texto-titulo-tarjeta text-texto">{mascota.nombre}</span>
          <span className="texto-cuerpo text-texto-secundario">¿Qué quieres registrar hoy?</span>
        </div>
      </div>

      <ul className="grid grid-cols-3 gap-2.5">
        {TIPOS_EVENTO.map((t) => (
          <li key={t.slug}>
            <Link
              href={`/registrar/${t.slug}`}
              className="flex h-full min-h-17.5 flex-col items-center justify-center gap-1.5 rounded-md border border-borde bg-superficie px-1 py-2 text-center"
            >
              <span className="grid size-8 shrink-0 place-items-center rounded-completo bg-acento-suave text-primario">
                <Icono nombre={t.icono} className="icono-s" />
              </span>
              <span className="w-full wrap-break-word texto-etiqueta text-texto">{CORTES[t.slug] ?? t.nombre}</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
