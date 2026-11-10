"use client"

import { BotonVolver } from "@/components/boton-volver"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import { BotonEnlace } from "@/components/boton"
import { Icono } from "@/components/icono"
import { estadoComida } from "@/lib/alimentacion"
import { HOY, fechaLarga } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { servirComida, usePlanes, type DatosAlimentacion } from "@/lib/usar-alimentacion"

type AvisoComidaProps = DatosAlimentacion & { mascotas: { id: string; nombre: string }[] }

/** H5 · Recordatorio de comida: la notificación "Hora de la cena de Luna". */
export function AvisoComida({ mascotas, ...datos }: AvisoComidaProps) {
  const router = useRouter()
  const [mascota] = useMascotaActiva(mascotas)
  const { planes, servida } = usePlanes(datos)
  const plan = planes[mascota.id]
  const comida = plan?.comidas.find((c) => estadoComida(c.hora, !!servida(mascota.id, c.hora)) === "pendiente") ?? plan?.comidas.at(-1)

  return (
    <main className="-mb-px flex flex-1 flex-col gap-6 bg-primario px-pantalla pt-14">
      <BotonVolver respaldo="/alimentacion" />
      <div className="flex flex-col items-center gap-1 pb-6 text-superficie">
        <span className="texto-reloj">9:41</span>
        <span className="texto-cuerpo text-sobre-oscuro-secundario">{fechaLarga(HOY)}</span>
      </div>
      {plan && comida ? (
        <article className="flex flex-col gap-3 rounded-lg bg-superficie p-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-xs bg-primario text-superficie">
              <Icono nombre="pets" className="icono-s" />
            </span>
            <span className="flex-1 texto-micro text-texto-secundario">Balto</span>
            <span className="texto-etiqueta text-texto-secundario">ahora</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="texto-cuerpo-fuerte text-texto">
              Hora {comida.nombre === "Cena" ? "de la cena" : comida.nombre === "Desayuno" ? "del desayuno" : `de la comida`} de {mascota.nombre}
            </h1>
            <p className="texto-etiqueta text-texto">
              {comida.gramos} g de {plan.tipo === "concentrado" ? "concentrado" : plan.marca.toLowerCase()} · {comida.hora}
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                toast.success("Te recordamos en 30 min")
                router.push("/alimentacion")
              }}
              className="h-11 flex-1 rounded-completo bg-acento texto-boton text-primario"
            >
              Más tarde
            </button>
            <button
              type="button"
              onClick={() => {
                servirComida(mascota.id, comida.hora)
                toast.success(`${comida.nombre} servida`)
                router.push("/alimentacion")
              }}
              className="h-11 flex-1 rounded-completo bg-primario texto-boton text-superficie"
            >
              Servida
            </button>
          </div>
        </article>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg bg-superficie p-5">
          <p className="texto-cuerpo text-texto">{mascota.nombre} no tiene un plan de alimentación.</p>
          <BotonEnlace href="/alimentacion/registrar">Crear plan</BotonEnlace>
        </div>
      )}
    </main>
  )
}
