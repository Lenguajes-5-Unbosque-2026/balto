"use client"

import { alertaDeEvento, proximaFechaEvento } from "@/lib/alertas"
import type { Evento } from "@/lib/eventos"
import { HOY } from "@/lib/fecha"
import { enSupabase, type Operacion } from "@/lib/sincronizar"

/**
 * Cambios hechos en este navegador mientras no hay Supabase: eventos nuevos o
 * editados (E, D6) y eventos eliminados (D7). Si el almacenamiento no está
 * disponible (modo privado), se guardan en memoria hasta recargar.
 */
const CLAVE_EVENTOS = "balto:eventos-registrados"
const CLAVE_ELIMINADOS = "balto:eventos-eliminados"
const CLAVE_MASCOTA = "balto:mascota-activa"
const AVISO = "balto:eventos"

const enMemoria: Record<string, string> = {}
// Última lectura de cada clave: devuelve el mismo arreglo mientras el almacenamiento no cambie.
const cache: Record<string, { crudo: string | null; valor: unknown[] }> = {}
const VACIO: never[] = []

function leerLista<T>(clave: string): T[] {
  let crudo: string | null
  try {
    crudo = window.localStorage.getItem(clave)
  } catch {
    crudo = enMemoria[clave] ?? null
  }
  if (!crudo) return VACIO
  if (cache[clave]?.crudo !== crudo) cache[clave] = { crudo, valor: JSON.parse(crudo) as T[] }
  return cache[clave].valor as T[]
}

function escribirLista(clave: string, lista: unknown[]) {
  const crudo = JSON.stringify(lista)
  enMemoria[clave] = crudo
  try {
    window.localStorage.setItem(clave, crudo)
  } catch {
    // Sin almacenamiento: queda en memoria.
  }
  window.dispatchEvent(new Event(AVISO))
}

/** Guarda un evento nuevo o reemplaza uno existente (también los del CSV, al editarlos). */
export function guardarEvento(evento: Evento) {
  escribirLista(CLAVE_EVENTOS, [evento, ...eventosRegistrados().filter((e) => e.id !== evento.id)])
  enSupabase(...operacionesEvento(evento))
}

/** El evento, sus soportes y la alerta que genera (refuerzo, próxima dosis, control). */
function operacionesEvento(evento: Evento): Operacion[] {
  const ops: Operacion[] = [{ tipo: "guardar", tabla: "eventos", donde: { id: evento.id }, fila: evento, alCrear: { fecha_creacion: HOY } }]
  if (evento.soportes) {
    ops.push({
      tipo: "reemplazar",
      tabla: "soportes",
      donde: { evento_id: evento.id },
      filas: evento.soportes.map((s, i) => ({ id: `${evento.id}-s${i + 1}`, archivo: s.nombre, tipo: s.tipo, tamano_kb: s.tamanoKb, fecha_subida: HOY })),
    })
  }
  const alerta = alertaDeEvento(evento)
  if (alerta) {
    // Si la alerta ya existe (y quizá está resuelta), solo cambia su fecha.
    const { estado, ...datos } = alerta
    ops.push({ tipo: "guardar", tabla: "alertas", donde: { id: alerta.id }, fila: datos, alCrear: { estado } })
  } else {
    ops.push({ tipo: "borrar", tabla: "alertas", donde: { id: `l-${evento.id}` } })
  }
  // Las alertas del evento que siguen pendientes toman la fecha editada en D6.
  const fecha = proximaFechaEvento(evento)
  if (fecha) {
    for (const estado of ["proxima", "vencida"])
      ops.push({ tipo: "actualizar", tabla: "alertas", donde: { evento_id: evento.id, estado }, fila: { fecha_vencimiento: fecha } })
  }
  return ops
}

/** Borrado de D7: deja de verse en toda la app. */
export function eliminarEvento(id: string) {
  escribirLista(
    CLAVE_EVENTOS,
    eventosRegistrados().filter((e) => e.id !== id),
  )
  escribirLista(CLAVE_ELIMINADOS, [...new Set([...eventosEliminados(), id])])
  enSupabase({ tipo: "actualizar", tabla: "eventos", donde: { id }, fila: { eliminado_en: HOY } })
}

export function buscarEvento(id: string) {
  return eventosRegistrados().find((e) => e.id === id)
}

export function eventosRegistrados() {
  return leerLista<Evento>(CLAVE_EVENTOS)
}

export function eventosEliminados() {
  return leerLista<string>(CLAVE_ELIMINADOS)
}

/** Para useSyncExternalStore: avisa cuando cambian los eventos en esta pestaña o en otra. */
export function suscribirEventos(aviso: () => void) {
  window.addEventListener(AVISO, aviso)
  window.addEventListener("storage", aviso)
  return () => {
    window.removeEventListener(AVISO, aviso)
    window.removeEventListener("storage", aviso)
  }
}

export function leerMascotaActiva() {
  try {
    return window.localStorage.getItem(CLAVE_MASCOTA)
  } catch {
    return null
  }
}

export function guardarMascotaActiva(id: string) {
  try {
    window.localStorage.setItem(CLAVE_MASCOTA, id)
  } catch {
    // Sin almacenamiento: la selección dura hasta salir de la pantalla.
  }
}
