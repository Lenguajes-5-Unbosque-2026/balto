"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"

/**
 * Pila de pantallas visitadas dentro de Balto en esta pestaña. Sirve para saber
 * si "volver" tiene a dónde ir: al abrir un enlace directo (por ejemplo, el de
 * Vercel o una notificación) no hay pantalla anterior en la app, y router.back()
 * no hace nada o se sale de Balto.
 */
const CLAVE = "balto:pila"
let iniciada = false

function leerPila(): string[] {
  try {
    return JSON.parse(window.sessionStorage.getItem(CLAVE) ?? "[]")
  } catch {
    return []
  }
}

function escribirPila(pila: string[]) {
  try {
    window.sessionStorage.setItem(CLAVE, JSON.stringify(pila.slice(-50)))
  } catch {
    // Sin almacenamiento: volver usará la pantalla de respaldo.
  }
}

/** Registra cada cambio de pantalla (va en el layout, una sola vez). */
export function useRegistrarNavegacion() {
  const ruta = usePathname()
  const consulta = useSearchParams().toString()
  useEffect(() => {
    const actual = consulta ? `${ruta}?${consulta}` : ruta
    // Una pestaña nueva (window.open) copia el sessionStorage de la que la abrió: sin historial propio, se empieza de cero.
    const pila = !iniciada && window.history.length <= 1 ? [] : leerPila()
    iniciada = true
    if (pila.at(-1) === actual) return
    // Si la pantalla nueva es la anterior, se volvió atrás: se saca la última.
    if (pila.at(-2) === actual) pila.pop()
    else pila.push(actual)
    escribirPila(pila)
  }, [ruta, consulta])
}

export function puedeVolver() {
  return leerPila().length > 1
}
