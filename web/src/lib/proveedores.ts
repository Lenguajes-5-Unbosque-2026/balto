import type { Veterinaria } from "@/lib/datos"
import { AHORA, diaSemana, hoy, sumarDias } from "@/lib/fecha"

export type Punto = { lat: number; lng: number }

/** Zonas de Bogotá para buscar sin ubicación (K7). Chapinero es la zona de la casa de Samuel (dir01). */
export const ZONAS: Record<string, Punto> = {
  Chapinero: { lat: 4.6486, lng: -74.0628 },
  Usaquén: { lat: 4.6949, lng: -74.0307 },
  Chicó: { lat: 4.6772, lng: -74.0487 },
  Cedritos: { lat: 4.7224, lng: -74.0421 },
  Teusaquillo: { lat: 4.6339, lng: -74.0731 },
  Suba: { lat: 4.7418, lng: -74.0834 },
  Kennedy: { lat: 4.6271, lng: -74.1462 },
  Fontibón: { lat: 4.6741, lng: -74.1413 },
  Engativá: { lat: 4.7081, lng: -74.1072 },
}

/** Distancia en km entre dos puntos (fórmula del haversine). */
export function distanciaKm(a: Punto, b: Punto) {
  const rad = (g: number) => (g * Math.PI) / 180
  const dLat = rad(b.lat - a.lat)
  const dLng = rad(b.lng - a.lng)
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 6371 * 2 * Math.asin(Math.sqrt(h))
}

export const puntoDe = (v: Veterinaria): Punto => ({ lat: Number(v.latitud), lng: Number(v.longitud) })

/** "0,8 km". */
export const textoKm = (km: number) => `${km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)} km`

const DIAS = ["dom", "lun", "mar", "mie", "jue", "vie", "sab"]
const sinTilde = (t: string) => t.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase()

/** Días y horas de "Lun–sáb 8:00–20:00"; null si es 24 horas. */
function horario(v: Veterinaria) {
  if (/24 horas/i.test(v.horario)) return null
  const m = /(\w+)[–-](\w+)\s+(\d{1,2}):(\d{2})[–-](\d{1,2}):(\d{2})/.exec(sinTilde(v.horario))
  if (!m) return undefined
  const desde = DIAS.indexOf(m[1].slice(0, 3))
  const hasta = DIAS.indexOf(m[2].slice(0, 3))
  const dias = new Set<number>()
  for (let d = desde; ; d = (d + 1) % 7) {
    dias.add(d)
    if (d === hasta) break
  }
  return { dias, abre: Number(m[3]) * 60 + Number(m[4]), cierra: Number(m[5]) * 60 + Number(m[6]) }
}

const minutos = (hora: string) => Number(hora.slice(0, 2)) * 60 + Number(hora.slice(3, 5))
const hora12 = (min: number) => `${Math.floor(min / 60) % 12 || 12}${min % 60 ? `:${String(min % 60).padStart(2, "0")}` : ""} ${min < 720 ? "a. m." : "p. m."}`

/** ¿Abre ese día de la semana? (0 = domingo). */
export function abreEl(v: Veterinaria, dia: number) {
  const h = horario(v)
  return h === null || !h || h.dias.has(dia)
}

/** "Abierto 24 h", "Cierra 8 p. m.", "Abre 8 a. m." o "Cerrado hoy", con la hora de ahora. */
export function estadoHorario(v: Veterinaria) {
  const h = horario(v)
  if (h === null) return { abierto: true, texto: "Abierto 24 h" }
  if (!h) return { abierto: false, texto: v.horario }
  const ahora = minutos(AHORA)
  if (!h.dias.has(diaSemana(hoy()))) return { abierto: false, texto: "Cerrado hoy" }
  if (ahora < h.abre) return { abierto: false, texto: `Abre ${hora12(h.abre)}` }
  if (ahora >= h.cierra) return { abierto: false, texto: "Cerrado" }
  return { abierto: true, texto: `Cierra ${hora12(h.cierra)}` }
}

/** Filtros de K2 (y los atajos de K3), con los servicios de data/mock/veterinarias.csv que acepta cada uno. */
export const SERVICIOS = [
  { slug: "urgencias", nombre: "Urgencias 24 h", icono: "emergency", servicios: ["urgencias"] },
  { slug: "consulta", nombre: "Consulta general", icono: "stethoscope", servicios: ["consulta"] },
  { slug: "vacunacion", nombre: "Vacunación", icono: "vaccines", servicios: ["vacunacion"] },
  { slug: "especialista", nombre: "Especialista", icono: "medical_services", servicios: ["especialista"] },
  { slug: "estetica", nombre: "Estética", icono: "content_cut", servicios: ["bano", "corte", "spa"] },
  { slug: "paseo", nombre: "Paseo", icono: "directions_walk", servicios: ["paseo"] },
  { slug: "guarderia", nombre: "Guardería", icono: "house", servicios: ["guarderia", "hotel"] },
] as const

export type Servicio = (typeof SERVICIOS)[number]["slug"]

export function ofrece(v: Veterinaria, s: Servicio) {
  const lista = v.servicios.split(";")
  const def = SERVICIOS.find((x) => x.slug === s)!
  return def.servicios.some((x) => lista.includes(x)) && (s !== "urgencias" || v.urgencias_24h === "true" || lista.includes("urgencias"))
}

const NOMBRES_SERVICIO: Record<string, string> = {
  urgencias: "Urgencias",
  consulta: "Consulta",
  vacunacion: "Vacunación",
  cirugia: "Cirugía",
  laboratorio: "Laboratorio",
  especialista: "Especialista",
  imagenes: "Imágenes",
  hospitalizacion: "Hospitalización",
  bano: "Baño",
  corte: "Corte",
  spa: "Spa",
  guarderia: "Guardería",
  hotel: "Hotel",
  paseo: "Paseo",
}

export const serviciosDe = (v: Veterinaria) => v.servicios.split(";").map((s) => NOMBRES_SERVICIO[s] ?? s)

export function iconoProveedor(v: Pick<Veterinaria, "tipo" | "servicios">) {
  if (v.tipo === "estetica") return "content_cut"
  if (v.tipo === "guarderia") return "house"
  if (v.tipo === "paseo") return "directions_walk"
  return "local_hospital"
}

/** Servicio con que se abre K5 según el filtro con que se llegó: "Vacunación", "Consulta general"… */
export function servicioParaCita(v: Veterinaria, filtro?: string | null) {
  if (filtro === "vacunacion") return "Vacunación"
  if (filtro === "urgencias") return "Urgencias"
  if (v.tipo === "estetica") return "Baño y corte"
  if (v.tipo === "guarderia") return "Guardería"
  if (v.tipo === "paseo") return "Paseo"
  return "Consulta general"
}

export function iconoServicio(servicio: string) {
  const s = sinTilde(servicio)
  if (s.includes("vacun")) return "vaccines"
  if (s.includes("bano") || s.includes("corte")) return "content_cut"
  if (s.includes("urgenc")) return "emergency"
  if (s.includes("guarder")) return "house"
  if (s.includes("paseo")) return "directions_walk"
  return "stethoscope"
}

const HORAS_CITA = ["08:30", "10:00", "11:30", "15:00", "16:30"]

/** Número estable a partir de un texto, para que la agenda de prueba no cambie entre visitas. */
function semilla(texto: string) {
  let h = 0
  for (const c of texto) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return h
}

/**
 * Cupos de prueba de la agenda en línea (no hay servicio real todavía): las horas
 * habituales menos algunas ocupadas, y algunos días llenos. Nada en el pasado.
 */
export function cuposDel(v: Veterinaria, fecha: string, ocupadas: string[] = []) {
  if (fecha <= hoy() || !abreEl(v, diaSemana(fecha))) return []
  const s = semilla(`${v.id}${fecha}`)
  if (s % 6 === 0) return []
  return HORAS_CITA.filter((h, i) => (s >> i) % 3 !== 0 && !ocupadas.includes(h))
}

/** Los próximos días con cupo después de `fecha` (chips de K10). */
export function proximosConCupo(v: Veterinaria, fecha: string, n = 3) {
  const dias: string[] = []
  for (let f = sumarDias(fecha, 1); dias.length < n && f < sumarDias(fecha, 30); f = sumarDias(f, 1)) {
    if (cuposDel(v, f).length) dias.push(f)
  }
  return dias
}

/** Archivo .ics de la cita para el calendario del teléfono (K9). */
export function archivoIcs(c: { id: string; fecha_hora: string; duracion_min: string; servicio: string }, v: Veterinaria, mascota: string) {
  const [f, h] = c.fecha_hora.split(" ")
  const inicio = `${f.replace(/-/g, "")}T${h.replace(":", "")}00`
  const finMin = minutos(h) + (Number(c.duracion_min) || 30)
  const fin = `${f.replace(/-/g, "")}T${String(Math.floor(finMin / 60)).padStart(2, "0")}${String(finMin % 60).padStart(2, "0")}00`
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Balto//Citas//ES",
    "BEGIN:VEVENT",
    `UID:${c.id}@balto.app`,
    `DTSTART;TZID=America/Bogota:${inicio}`,
    `DTEND;TZID=America/Bogota:${fin}`,
    `SUMMARY:${c.servicio} · ${mascota}`,
    `LOCATION:${v.nombre}, ${v.direccion}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    `DESCRIPTION:Mañana: ${c.servicio} de ${mascota}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n")
}

export const rutaMapa = (v: Veterinaria) => `https://www.google.com/maps/dir/?api=1&destination=${v.latitud},${v.longitud}`
