"use client"

import type { Evento } from "@/lib/eventos"

/**
 * Eventos registrados en este navegador mientras no hay Supabase.
 * Si el almacenamiento no está disponible (modo privado), se guarda en memoria.
 */
const CLAVE_EVENTOS = "balto:eventos-registrados"
const CLAVE_MASCOTA = "balto:mascota-activa"

let enMemoria: Evento[] = []
// Última lectura: devuelve el mismo arreglo mientras el almacenamiento no cambie.
let cache: { crudo: string | null; eventos: Evento[] } = { crudo: null, eventos: [] }

function leer(): Evento[] {
  try {
    const crudo = window.localStorage.getItem(CLAVE_EVENTOS)
    if (!crudo) return enMemoria
    if (crudo !== cache.crudo) cache = { crudo, eventos: JSON.parse(crudo) as Evento[] }
    return cache.eventos
  } catch {
    return enMemoria
  }
}

export function guardarEvento(evento: Evento) {
  const lista = [evento, ...leer().filter((e) => e.id !== evento.id)]
  enMemoria = lista
  try {
    window.localStorage.setItem(CLAVE_EVENTOS, JSON.stringify(lista))
  } catch {
    // Sin almacenamiento: queda en memoria hasta recargar.
  }
}

export function buscarEvento(id: string) {
  return leer().find((e) => e.id === id)
}

export function eventosRegistrados() {
  return leer()
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
