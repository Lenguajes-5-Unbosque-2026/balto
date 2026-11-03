import { detalleAlerta, textoUltimaVez, tituloAlertaVista, type AlertaVista } from "@/lib/alertas"
import { sumarDias } from "@/lib/fecha"

/** "2026-10-30" → "20261030" (fechas de día completo en .ics y Google Calendar). */
const compacta = (iso: string) => iso.slice(0, 10).replaceAll("-", "")

/** Lo que se guarda en el calendario: un evento de día completo el día en que vence la alerta. */
function eventoDeAlerta(a: AlertaVista) {
  const titulo = `${tituloAlertaVista(a)} · ${a.mascota.nombre}`
  const ultima = textoUltimaVez(a)
  const descripcion = `${a.mascota.nombre}: ${detalleAlerta(a)}.${ultima ? ` ${ultima}` : ""} Recordatorio de Balto.`
  return { titulo, descripcion, inicio: compacta(a.fecha_vencimiento), fin: compacta(sumarDias(a.fecha_vencimiento, 1)) }
}

/** Enlace que abre Google Calendar con el evento listo para guardar. */
export function urlGoogleCalendar(a: AlertaVista) {
  const e = eventoDeAlerta(a)
  const datos = new URLSearchParams({ action: "TEMPLATE", text: e.titulo, dates: `${e.inicio}/${e.fin}`, details: e.descripcion })
  return `https://calendar.google.com/calendar/render?${datos}`
}

/** Escapa comas, punto y coma y saltos de línea, como pide el formato iCalendar. */
const textoIcs = (t: string) => t.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, "\\n")

/** Archivo .ics con el evento y un aviso el día anterior (Calendario de Apple, Outlook y los de Android lo abren). */
export function archivoIcs(a: AlertaVista) {
  const e = eventoDeAlerta(a)
  const sello = `${new Date().toISOString().replace(/[-:]/g, "").slice(0, 15)}Z`
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Balto//Alertas//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${a.id}-${e.inicio}@balto`,
    `DTSTAMP:${sello}`,
    `DTSTART;VALUE=DATE:${e.inicio}`,
    `DTEND;VALUE=DATE:${e.fin}`,
    `SUMMARY:${textoIcs(e.titulo)}`,
    `DESCRIPTION:${textoIcs(e.descripcion)}`,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${textoIcs(e.titulo)}`,
    "TRIGGER:-P1D",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

/** Descarga el .ics; en el celular, abrirlo ofrece agregarlo al calendario. */
export function descargarIcs(a: AlertaVista) {
  const enlace = document.createElement("a")
  enlace.href = URL.createObjectURL(new Blob([archivoIcs(a)], { type: "text/calendar;charset=utf-8" }))
  enlace.download = `balto-${a.mascota.nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${a.fecha_vencimiento}.ics`
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}
