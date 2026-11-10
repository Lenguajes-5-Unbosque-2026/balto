"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

import { BotonEnlace } from "@/components/boton"
import { Logo } from "@/components/acceso/comunes"
import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

const DIAPOSITIVAS = [
  { titulo: "Su historia, sin papeles", texto: "Guarda su carnet, exámenes y consultas en un historial digital que crece con tu mascota." },
  { titulo: "Cada dosis a tiempo", texto: "Recibe avisos de vacunas y medicamentos para no olvidar ninguna dosis." },
  { titulo: "Su veterinario, al tanto", texto: "Comparte su perfil en segundos con quien lo necesite, sin que tenga que instalar nada." },
]

/** A1 · Splash y A2 · Bienvenida (carrusel de tres). */
export function Bienvenida() {
  const [splash, setSplash] = useState(true)
  const [actual, setActual] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setSplash(false), 1400)
    return () => clearTimeout(t)
  }, [])

  if (splash) {
    return (
      <main className="flex flex-1 items-center justify-center bg-primario">
        <Logo className="w-48 animate-in fade-in zoom-in-95 duration-700" />
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col px-pantalla pt-14 pb-9">
      <div
        className="sin-barra-desplazamiento -mx-pantalla flex snap-x snap-mandatory overflow-x-auto"
        onScroll={(e) => setActual(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {DIAPOSITIVAS.map((d, i) => (
          <section key={d.titulo} className="flex w-full shrink-0 snap-center flex-col gap-4 px-pantalla">
            <div className="relative aspect-[342/320] overflow-hidden rounded-lg bg-primario">
              <Image src={`/bienvenida/${i + 1}.jpg`} alt="" fill sizes="(max-width: 480px) 100vw, 432px" priority={i === 0} className="object-cover" />
            </div>
            <div className="flex gap-1.5" aria-hidden>
              {DIAPOSITIVAS.map((_, j) => (
                <span key={j} className={cn("h-2 rounded-completo transition-all", j === actual ? "w-6 bg-primario" : "w-2 bg-acento")} />
              ))}
            </div>
            <h1 className="texto-titulo-pantalla text-texto">{d.titulo}</h1>
            <p className="texto-cuerpo text-texto-secundario">{d.texto}</p>
          </section>
        ))}
      </div>
      <div className="mt-auto flex flex-col gap-3 pt-8">
        <BotonEnlace href="/ingresar" variante="suave">
          Ya tengo cuenta
        </BotonEnlace>
        <BotonEnlace href="/registro">
          Crear cuenta gratis
          <Icono nombre="arrow_forward" className="icono-m" />
        </BotonEnlace>
      </div>
    </main>
  )
}
