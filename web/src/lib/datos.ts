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
    cedula: m.cedula,
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

/** Todas las alertas del dueño, también las resueltas (J1 · pestaña Resueltas). */
export function obtenerTodasAlertas(duenoId = DUENO_ACTUAL): Alerta[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("alertas") as unknown as Alerta[]).filter((a) => ids.has(a.mascota_id))
}

export type Condicion = {
  id: string
  mascota_id: string
  nombre: string
  fecha_diagnostico: string
  diagnosticada_por: string
}

/** Condiciones diagnosticadas de las mascotas del dueño (F5). */
export function obtenerCondiciones(duenoId = DUENO_ACTUAL): Condicion[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("condiciones") as Condicion[]).filter((c) => ids.has(c.mascota_id))
}

/** Una fila de data/mock/tratamientos.csv (G). */
export type Tratamiento = {
  id: string
  mascota_id: string
  evento_id: string
  medicamento: string
  presentacion: string
  via: string
  dosis: string
  frecuencia: string
  /** "martes;viernes" cuando la frecuencia es por días. */
  dias_semana: string
  fecha_inicio: string
  duracion_dias: string
  fecha_fin: string
  prescrito_por: string
  estado: "vigente" | "finalizado"
  finalizado_antes: string
  recordatorio: string
}

export type HorarioToma = { id: string; tratamiento_id: string; hora: string }

export type Toma = {
  id: string
  tratamiento_id: string
  fecha_hora_programada: string
  estado: "tomada" | "omitida" | "pendiente"
  hora_real: string
  aviso_reprogramado: string
}

export function obtenerTratamientos(duenoId = DUENO_ACTUAL): Tratamiento[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("tratamientos") as Tratamiento[]).filter((t) => ids.has(t.mascota_id))
}

export function obtenerHorarios(): HorarioToma[] {
  return leer("horarios_toma") as HorarioToma[]
}

export function obtenerTomas(): Toma[] {
  return leer("tomas") as Toma[]
}

/** Un PDF enviado o un enlace compartido (L). */
export type Envio = {
  id: string
  mascota_id: string
  formato: "pdf" | "enlace"
  /** "identificacion;vacunas;medicacion" o "completo". */
  secciones: string
  desde: string
  hasta: string
  canal: "whatsapp" | "correo" | "imprimir" | "guardar" | "enlace" | "compartir"
  destinatario: string
  token: string
  vencimiento: "" | "24_horas" | "7_dias" | "sin_vencimiento"
  expira_en: string
  activo: string
  visitas: string
  fecha: string
}

export function obtenerEnvios(duenoId = DUENO_ACTUAL): Envio[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("envios") as Envio[]).filter((e) => ids.has(e.mascota_id))
}

export type PlanAlimentacion = {
  id: string
  mascota_id: string
  tipo: "concentrado" | "casero"
  marca: string
  tipo_alimento: string
  presentacion_kg: string
  gramos_dia: string
  actividad: string
  fecha_bolsa_abierta: string
  activo: string
}

export function obtenerPlanes(duenoId = DUENO_ACTUAL): PlanAlimentacion[] {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return (leer("planes_alimentacion") as PlanAlimentacion[]).filter((p) => ids.has(p.mascota_id))
}

/** Eventos de todas las mascotas activas del dueño. */
export function obtenerEventosDueno(duenoId = DUENO_ACTUAL) {
  const ids = new Set(obtenerMascotas(duenoId).map((m) => m.id))
  return obtenerEventos().filter((e) => ids.has(e.mascota_id))
}
