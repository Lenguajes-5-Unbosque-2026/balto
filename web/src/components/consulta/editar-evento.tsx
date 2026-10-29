"use client"

import { useSearchParams } from "next/navigation"
import { useSyncExternalStore } from "react"

import { BotonEnlace } from "@/components/boton"
import { Estado } from "@/components/estado"
import { FormularioEvento } from "@/components/registro/formulario-evento"
import type { MascotaBasica, Medicion } from "@/components/registro/tipos"
import type { Evento } from "@/lib/eventos"
import { useEventos } from "@/lib/usar-eventos"

const sinSuscripcion = () => () => {}

type EditarEventoProps = {
  eventos: Evento[]
  mascotas: MascotaBasica[]
  mediciones: Medicion[]
  veterinarias: string[]
  anticipacion: number
}

/** D6 · Editar evento: el formulario de E del tipo, lleno con los datos guardados. */
export function EditarEvento({ eventos, ...props }: EditarEventoProps) {
  const id = useSearchParams().get("id") ?? ""
  const evento = useEventos(eventos).find((e) => e.id === id)
  // El formulario toma los valores una sola vez: espera a leer los cambios guardados en este navegador.
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false)

  if (!listo) return null
  if (!evento) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-pantalla">
        <Estado icono="search_off" titulo="No encontramos el evento" mensaje="Puede que se haya eliminado." />
        <BotonEnlace href="/linea-de-tiempo" variante="secundario">
          Ir a la línea de tiempo
        </BotonEnlace>
      </main>
    )
  }
  return <FormularioEvento key={evento.id} tipoInicial={evento.tipo} evento={evento} {...props} />
}
