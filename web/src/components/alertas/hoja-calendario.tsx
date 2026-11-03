"use client"

import { toast } from "sonner"

import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { tituloAlertaVista, type AlertaVista } from "@/lib/alertas"
import { descargarIcs, urlGoogleCalendar } from "@/lib/calendario"
import { fechaCorta } from "@/lib/fecha"
import { agregarAlertaAlCalendario } from "@/lib/usar-alertas"

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/**
 * Ícono de calendario de J1: agrega la alerta a K6 · Calendario de Balto, avisa arriba
 * y abre la hoja para llevarla también a Google Calendar o al calendario del celular.
 */
export function agregarAlCalendarioDeBalto(a: AlertaVista) {
  if (a.en_calendario) {
    toast.success("Ya está en el calendario de Balto", { description: `${tituloAlertaVista(a)} · ${sinAnio(a.fecha_vencimiento)}` })
    return
  }
  agregarAlertaAlCalendario(a.id)
  toast.success("Agregada al calendario de Balto", { description: `${tituloAlertaVista(a)} · ${sinAnio(a.fecha_vencimiento)}` })
}

/** Hoja después de agregarla a Balto: ver el calendario de Balto o llevarla a Google Calendar o al celular. */
export function HojaCalendario({ alerta, onCerrar }: { alerta: AlertaVista | null; onCerrar: () => void }) {
  return (
    <Hoja abierta={!!alerta} onCerrar={onCerrar} titulo="Agregar al calendario">
      <Contenido alerta={alerta!} onCerrar={onCerrar} />
    </Hoja>
  )
}

function Contenido({ alerta: a, onCerrar }: { alerta: AlertaVista; onCerrar: () => void }) {
  function google() {
    window.open(urlGoogleCalendar(a), "_blank", "noopener")
    onCerrar()
  }

  function celular() {
    descargarIcs(a)
    toast.success(`Abre el archivo para guardarlo el ${sinAnio(a.fecha_vencimiento)}`)
    onCerrar()
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="-mt-2 texto-cuerpo text-texto-secundario">
        {tituloAlertaVista(a)} de {a.mascota.nombre}, el {fechaCorta(a.fecha_vencimiento)}.
      </p>
      <FilaOpcion
        borde
        tono="exito"
        icono="event_available"
        titulo="En el calendario de Balto"
        detalle="Ver el calendario"
        href={`/calendario?fecha=${a.fecha_vencimiento}`}
        onClick={onCerrar}
      />
      <h3 className="mt-2 texto-micro text-texto-secundario">También en otro calendario</h3>
      <FilaOpcion
        borde
        icono="event"
        titulo="Google Calendar"
        detalle="Se abre en una pestaña nueva"
        derecha={<Icono nombre="open_in_new" className="shrink-0 icono-m text-texto-secundario" />}
        onClick={google}
      />
      <FilaOpcion
        borde
        icono="calendar_month"
        titulo="Calendario del celular"
        detalle="Apple, Outlook u otro"
        derecha={<Icono nombre="download" className="shrink-0 icono-m text-texto-secundario" />}
        onClick={celular}
      />
    </div>
  )
}
