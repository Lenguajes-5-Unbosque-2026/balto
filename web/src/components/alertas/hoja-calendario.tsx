"use client"

import { toast } from "sonner"

import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { tituloAlertaVista, type AlertaVista } from "@/lib/alertas"
import { descargarIcs, urlGoogleCalendar } from "@/lib/calendario"
import { fechaCorta } from "@/lib/fecha"

/** Agrega la alerta al calendario del dueño: Google Calendar o un archivo .ics para el calendario del celular. */
export function HojaCalendario({ alerta, onCerrar }: { alerta: AlertaVista | null; onCerrar: () => void }) {
  return (
    <Hoja abierta={!!alerta} onCerrar={onCerrar} titulo="Agregar al calendario">
      <Contenido alerta={alerta!} onCerrar={onCerrar} />
    </Hoja>
  )
}

function Contenido({ alerta: a, onCerrar }: { alerta: AlertaVista; onCerrar: () => void }) {
  const dia = fechaCorta(a.fecha_vencimiento)

  function google() {
    window.open(urlGoogleCalendar(a), "_blank", "noopener")
    onCerrar()
  }

  function celular() {
    descargarIcs(a)
    toast.success(`Abre el archivo para guardarlo el ${dia.replace(/ \d{4}$/, "")}`)
    onCerrar()
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="-mt-2 mb-1 texto-cuerpo text-texto-secundario">
        {tituloAlertaVista(a)} de {a.mascota.nombre}, el {dia}. Te avisa un día antes.
      </p>
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
        detalle="Apple, Outlook u otro · archivo .ics"
        derecha={<Icono nombre="download" className="shrink-0 icono-m text-texto-secundario" />}
        onClick={celular}
      />
    </div>
  )
}
