"use client"

import { useMemo, useSyncExternalStore } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import { edad } from "@/lib/fecha"
import { guardarMascotaActiva, leerMascotaActiva } from "@/lib/registro-local"

const EVENTO = "balto:mascota-activa"
const CLAVE_MASCOTAS = "balto:mascotas"

/** Lo que el dueño cambió de una mascota en M18, o si la archivó en M13. */
export type CambiosMascota = {
  nombre?: string
  especie?: "perro" | "gato"
  raza?: string
  sexo?: string
  fecha_nacimiento?: string
  esterilizada?: string
  microchip?: string
  /** Foto nueva (data URL reducida) o nombre del archivo de data/mock/imagenes. */
  imagen?: string
  archivada?: boolean
}

export function guardarCambiosMascota(id: string, cambios: CambiosMascota) {
  guardarEnMapa<CambiosMascota>(CLAVE_MASCOTAS, id, cambios)
}

export function useCambiosMascotas() {
  return useMapaLocal<CambiosMascota>(CLAVE_MASCOTAS)
}

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** Aplica los cambios a cualquier forma de mascota (perfil, básica…) y recalcula la edad y el detalle. */
export function aplicarCambios<T extends { id: string }>(m: T, c?: CambiosMascota): T {
  if (!c) return m
  const r: Record<string, unknown> = { ...m }
  for (const [k, v] of Object.entries(c)) if (k !== "archivada" && k in r && v !== undefined) r[k] = v
  if (c.fecha_nacimiento && "edad" in r) r.edad = edad(c.fecha_nacimiento)
  if ("detalle" in r) {
    const [especie, raza, sexo, anios] = String(r.detalle).split(" · ")
    r.detalle = [c.especie ? mayuscula(c.especie) : especie, c.raza ?? raza, c.sexo ? mayuscula(c.sexo) : sexo, c.fecha_nacimiento ? edad(c.fecha_nacimiento) : anios]
      .filter(Boolean)
      .join(" · ")
  }
  return r as T
}

const CLAVE_NUEVAS = "balto:mascotas-nuevas"

/** Mascota registrada en B desde este navegador. */
export type MascotaNueva = {
  id: string
  dueno_id: string
  nombre: string
  especie: "perro" | "gato"
  raza: string
  sexo: string
  fecha_nacimiento: string
  esterilizada: string
  microchip: string
  cedula: string
  fecha_emision_cedula: string
  imagen: string
  alergias: string[]
}

export function guardarMascotaNueva(m: MascotaNueva) {
  guardarEnMapa<MascotaNueva>(CLAVE_NUEVAS, m.id, m)
}

export function useMascotasNuevas() {
  return useMapaLocal<MascotaNueva>(CLAVE_NUEVAS)
}

/** La mascota nueva con todas las formas que usan las pantallas (perfil, básica, fila del CSV). */
export function completarNueva(m: MascotaNueva) {
  return {
    ...m,
    estado: "activa",
    edad: m.fecha_nacimiento ? edad(m.fecha_nacimiento) : "",
    detalle: [mayuscula(m.especie), m.raza, mayuscula(m.sexo), m.fecha_nacimiento && edad(m.fecha_nacimiento)].filter(Boolean).join(" · "),
  }
}

/** Mascotas activas con los cambios de M18, las nuevas de B y sin las archivadas en M13. */
export function useMascotas<T extends { id: string }>(base: T[]) {
  const cambios = useCambiosMascotas()
  const nuevas = useMascotasNuevas()
  return useMemo(() => {
    const todas = [...base, ...Object.values(nuevas).map((m) => completarNueva(m) as unknown as T)]
    const activas = todas.filter((m) => !cambios[m.id]?.archivada).map((m) => aplicarCambios(m, cambios[m.id]))
    // Sin mascotas activas la app mostraría O1; mientras tanto se sigue usando la primera.
    return activas.length ? activas : base.slice(0, 1)
  }, [base, cambios, nuevas])
}

function suscribir(aviso: () => void) {
  window.addEventListener(EVENTO, aviso)
  window.addEventListener("storage", aviso)
  return () => {
    window.removeEventListener(EVENTO, aviso)
    window.removeEventListener("storage", aviso)
  }
}

/** Mascota activa del selector de Inicio, compartida por todas las pantallas. */
export function useMascotaActiva<T extends { id: string }>(base: T[]) {
  const mascotas = useMascotas(base)
  const guardada = useSyncExternalStore(suscribir, leerMascotaActiva, () => null)
  const activa = mascotas.find((m) => m.id === guardada) ?? mascotas[0]

  function cambiar(id: string) {
    guardarMascotaActiva(id)
    window.dispatchEvent(new Event(EVENTO))
  }

  return [activa, cambiar] as const
}
