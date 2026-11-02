"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"

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
    <section className="relative isolate flex flex-col gap-4 overflow-hidden rounded-lg bg-primario p-4 movil-m:p-5">
      {/* Círculo claro que asoma por la esquina; recorta el retrato por abajo, como en Figma. */}
      <span
        aria-hidden
        className="absolute -top-19 -right-16 -z-10 size-50 overflow-hidden rounded-completo bg-acento-suave movil-m:-top-23 movil-m:size-60"
      >
        {mascota.imagen ? (
          <Image
            // Una foto nueva de M18 (data URL) se muestra tal cual; las de data/mock/ tienen su retrato recortado.
            src={mascota.imagen.startsWith("data:") ? mascota.imagen : `/mascotas/retrato/${mascota.imagen}`}
            unoptimized={mascota.imagen.startsWith("data:")}
            alt=""
            width={360}
            height={480}
            loading="eager"
            className="absolute top-19 right-18 size-31 object-contain object-top movil-m:top-23 movil-m:size-37.5"
          />
        ) : (
          <Icono nombre="pets" className="absolute top-28 right-24 icono-estado text-primario movil-m:top-34 movil-m:right-28" />
        )}
      </span>
      {/* Cuarto de círculo gris de la esquina: no debe tocar el círculo del retrato; la flecha va adentro, sin tocar su borde. */}
      <span aria-hidden className="absolute -right-18 -bottom-18 -z-10 size-36 rounded-completo bg-acento-suave movil-m:-right-19 movil-m:-bottom-19 movil-m:size-38" />

      <div className="flex w-3/5 flex-col items-start">
        <span className="rounded-completo bg-sobre-oscuro-halo px-2.5 py-1 texto-micro text-superficie">{especieYRaza(mascota)}</span>
        <h2 className="mt-3 line-clamp-2 texto-titulo-pantalla break-words text-superficie movil-m:texto-display">{mascota.nombre}</h2>
        <span className="texto-cuerpo text-acento">
          {[mascota.edad, mascota.sexo === "hembra" ? "Hembra" : "Macho"].filter(Boolean).join(" · ")}
        </span>
      </div>

      <div className="flex gap-1.5 pr-13 movil-m:gap-2 movil-m:pr-16">
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
        className="absolute right-2 bottom-2 grid size-10 place-items-center rounded-completo bg-primario-relleno text-superficie movil-m:size-11"
      >
        <Icono nombre="north_east" className="icono-m" />
      </Link>
    </section>
  )
}
