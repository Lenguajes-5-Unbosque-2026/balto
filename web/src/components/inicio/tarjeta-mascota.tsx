"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import { Rasgo } from "@/components/rasgo"
import { textoKg, type Categoria, type Evento } from "@/lib/eventos"
import { SIN_FILTROS, useFiltrosLinea } from "@/lib/filtros-linea"
import { especieYRaza, estadoVacunas, ultimoPeso, type PerfilMascota } from "@/lib/perfil"

/** Los rasgos se encogen juntos en teléfonos angostos para no chocar con la flecha. */
const rasgoTocable = "aspect-square max-w-19 min-w-0 flex-1"

/** Tarjeta verde de la mascota activa con sus rasgos y la flecha a D1 (componente Ficha de mascota, variante Inicio). */
export function TarjetaMascota({ mascota, eventos }: { mascota: PerfilMascota; eventos: Evento[] }) {
  const router = useRouter()
  const [, cambiarFiltros] = useFiltrosLinea()
  const vacunas = estadoVacunas(eventos)
  const peso = ultimoPeso(eventos)

  /** Mientras no existen F2 (carnet) y F4 (peso), los rasgos abren la línea de tiempo filtrada. */
  function verEnLinea(categoria: Categoria) {
    cambiarFiltros({ ...SIN_FILTROS, categorias: [categoria] })
    router.push("/linea-de-tiempo")
  }

  return (
    <section className="relative isolate flex flex-col gap-4 overflow-hidden rounded-lg bg-primario p-5">
      <FotoMascota
        nombre={mascota.nombre}
        imagen={mascota.imagen}
        prioritaria
        className="absolute -top-12 -right-10 -z-10 size-55 bg-acento-suave text-primario"
      />
      <span aria-hidden className="absolute -right-20 -bottom-20 -z-10 size-40 rounded-completo bg-acento-suave" />

      <div className="flex w-3/5 flex-col items-start">
        <span className="rounded-completo bg-sobre-oscuro-halo px-2.5 py-1 texto-micro text-superficie">{especieYRaza(mascota)}</span>
        <h2 className="mt-3 line-clamp-2 texto-display break-words text-superficie">{mascota.nombre}</h2>
        <span className="texto-cuerpo text-acento">
          {[mascota.edad, mascota.sexo === "hembra" ? "Hembra" : "Macho"].filter(Boolean).join(" · ")}
        </span>
      </div>

      <div className="flex gap-2 pr-16">
        {vacunas !== "sin-vacunas" && (
          <button type="button" onClick={() => verEnLinea("vacunas")} className={rasgoTocable} aria-label="Ver vacunas">
            <Rasgo icono="vaccines" texto={vacunas === "al-dia" ? "Al día" : "Vencida"} alerta={vacunas === "vencida"} className="size-full" />
          </button>
        )}
        {mascota.microchip && (
          <Link href="/vista-rapida" className={rasgoTocable} aria-label="Ver microchip">
            <Rasgo icono="memory" texto="Microchip" className="size-full" />
          </Link>
        )}
        {peso ? (
          <button type="button" onClick={() => verEnLinea("peso")} className={rasgoTocable} aria-label="Ver pesos">
            <Rasgo icono="monitor_weight" texto={textoKg(peso.peso_kg!)} className="size-full" />
          </button>
        ) : (
          <Link href="/registrar/peso" className={rasgoTocable}>
            <Rasgo icono="monitor_weight" texto="Registrar peso" className="size-full" />
          </Link>
        )}
      </div>

      <Link
        href="/vista-rapida"
        aria-label={`Vista rápida de ${mascota.nombre}`}
        className="absolute right-4 bottom-4 grid size-12 place-items-center rounded-completo bg-primario-relleno text-superficie"
      >
        <Icono nombre="north_east" className="icono-m" />
      </Link>
    </section>
  )
}
