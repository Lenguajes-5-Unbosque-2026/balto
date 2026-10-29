"use client"

import { useSearchParams } from "next/navigation"
import { useSyncExternalStore } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { Estado } from "@/components/estado"
import { Nota } from "@/components/nota"
import type { MascotaBasica } from "@/components/registro/tipos"
import { TarjetaEvento } from "@/components/tarjeta-evento"
import { tituloEvento } from "@/lib/eventos"
import { fechaCorta, sumarDias } from "@/lib/fecha"
import { buscarEvento } from "@/lib/registro-local"

const sinSuscripcion = () => () => {}

/** E9 · Evento guardado. */
export function EventoGuardado({ mascotas, anticipacion }: { mascotas: MascotaBasica[]; anticipacion: number }) {
  const id = useSearchParams().get("id") ?? ""
  // Lee el evento recién guardado en este navegador (no existe en el servidor).
  const evento = useSyncExternalStore(sinSuscripcion, () => buscarEvento(id) ?? null, () => null)

  if (!evento) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-6">
        <Estado icono="search_off" titulo="No encontramos el evento" mensaje="Puede que se haya registrado en otro navegador." />
        <BarraAccion>
          <BotonEnlace href="/registrar">Registrar otro</BotonEnlace>
          <BotonEnlace href="/" variante="secundario">
            Listo
          </BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  const mascota = mascotas.find((m) => m.id === evento.mascota_id)
  const proxima = evento.proximo_refuerzo || evento.proxima_dosis
  const conAviso = evento.recordatorio === "true" && proxima && anticipacion > 0
  const que = evento.tipo === "desparasitacion" ? "de la próxima dosis" : "del refuerzo"

  return (
    <main className="flex flex-1 flex-col gap-5 px-6 pt-18">
      <Estado
        tono="exito"
        icono="check_circle"
        titulo="Evento guardado"
        mensaje={`${tituloEvento(evento)} quedó en la línea de tiempo de ${mascota?.nombre ?? "tu mascota"}.`}
      />
      {conAviso && (
        <Nota icono="notifications_active">
          Te avisaremos {anticipacion} días antes {que} ({fechaCorta(sumarDias(proxima, -anticipacion))}).
        </Nota>
      )}
      <TarjetaEvento evento={evento} href="/linea-de-tiempo" />
      <BarraAccion>
        <BotonEnlace href="/registrar">Registrar otro</BotonEnlace>
        <BotonEnlace href="/" variante="secundario">
          Listo
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}
