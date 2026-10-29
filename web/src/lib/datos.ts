import fs from "node:fs"
import path from "node:path"

import { parsearCsv } from "@/lib/csv"
import type { Evento, Soporte } from "@/lib/eventos"
import { edad } from "@/lib/fecha"
import type { Alerta, PerfilMascota } from "@/lib/perfil"

/**
 * Datos de prueba de data/mock/ (fuera de web/). Se leen en el servidor al
 * prerenderizar; la lectura sincrónica deja las páginas estáticas.
 * Cuando llegue Supabase, este archivo es el único que cambia.
 */
const CARPETA_MOCK = path.join(process.cwd(), "..", "data", "mock")

function leer(archivo: string) {
  return parsearCsv(fs.readFileSync(path.join(CARPETA_MOCK, `${archivo}.csv`), "utf8"))
}

/** El dueño de las pantallas de Figma (Samuel). */
export const DUENO_ACTUAL = "d01"

export type Mascota = {
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
  estado: string
  imagen: string
}

export type Veterinaria = { id: string; nombre: string; tipo: string; barrio: string }

export function obtenerMascotas(duenoId = DUENO_ACTUAL): Mascota[] {
  return (leer("mascotas") as Mascota[]).filter((m) => m.dueno_id === duenoId && m.estado === "activa")
}

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** Mascotas con la línea de detalle que muestran los selectores ("Perro · Golden Retriever · Hembra · 3 años"). */
export function obtenerMascotasBasicas(duenoId = DUENO_ACTUAL) {
  return obtenerMascotas(duenoId).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    imagen: m.imagen,
    detalle: [mayuscula(m.especie), m.raza, mayuscula(m.sexo), edad(m.fecha_nacimiento)].filter(Boolean).join(" · "),
  }))
}

/** Pesos registrados de las mascotas del dueño, para la gráfica de E6. */
export function obtenerMediciones(duenoId = DUENO_ACTUAL) {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return obtenerEventos()
    .filter((e) => e.tipo === "peso" && ids.has(e.mascota_id) && e.peso_kg)
    .map((e) => ({ mascotaId: e.mascota_id, fecha: e.fecha, kg: Number(e.peso_kg) }))
}

export function obtenerEventos(mascotaId?: string): Evento[] {
  const soportes = leer("soportes")
  return (leer("eventos") as unknown as Evento[])
    .filter((e) => !e.eliminado_en && (!mascotaId || e.mascota_id === mascotaId))
    .map((e) => ({
      ...e,
      soportes: soportes
        .filter((s) => s.evento_id === e.id)
        .map((s): Soporte => ({
          nombre: s.archivo,
          tipo: s.tipo as Soporte["tipo"],
          tamanoKb: Number(s.tamano_kb),
          url: `/soportes/${s.archivo}`,
        })),
    }))
}

export function obtenerVeterinarias(): Veterinaria[] {
  return (leer("veterinarias") as Veterinaria[]).filter((v) => v.tipo === "veterinaria")
}

/** Días de anticipación del aviso de vacunas y desparasitaciones (M3). */
export function anticipacionAvisos(duenoId = DUENO_ACTUAL): number {
  const pref = leer("preferencias_notificacion").find(
    (p) => p.dueno_id === duenoId && p.tipo === "vacunas_desparasitaciones",
  )
  if (!pref || pref.activo !== "true") return 0
  return Number.parseInt(pref.anticipacion, 10) || 0
}

export type Dueno = { id: string; nombre: string; telefono: string }

export function obtenerDueno(duenoId = DUENO_ACTUAL): Dueno {
  const d = leer("duenos").find((x) => x.id === duenoId)!
  return { id: d.id, nombre: d.nombre, telefono: d.telefono }
}

/** Mascotas activas con lo que muestran Inicio y D1, y sus alergias (B4, F5). */
export function obtenerPerfiles(duenoId = DUENO_ACTUAL): PerfilMascota[] {
  const alergias = leer("alergias")
  return obtenerMascotas(duenoId).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    imagen: m.imagen,
    especie: m.especie,
    raza: m.raza,
    sexo: m.sexo,
    edad: edad(m.fecha_nacimiento),
    microchip: m.microchip,
    alergias: alergias.filter((a) => a.mascota_id === m.id).map((a) => a.alergia),
  }))
}

/** Alertas pendientes (próximas o vencidas) de las mascotas del dueño (J). */
export function obtenerAlertas(duenoId = DUENO_ACTUAL): Alerta[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("alertas") as unknown as Alerta[]).filter(
    (a) => ids.has(a.mascota_id) && (a.estado === "proxima" || a.estado === "vencida"),
  )
}

/** Eventos de todas las mascotas activas del dueño. */
export function obtenerEventosDueno(duenoId = DUENO_ACTUAL) {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return obtenerEventos().filter((e) => ids.has(e.mascota_id))
}
