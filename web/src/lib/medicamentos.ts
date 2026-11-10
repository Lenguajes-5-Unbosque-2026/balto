import type { Toma, Tratamiento } from "@/lib/datos"
import { AHORA, diaSemana, diasEntre, hoy, sumarDias } from "@/lib/fecha"

/** Tratamiento con sus horas de toma y el estado ya calculado (se finaliza solo al pasar la fecha de fin). */
export type TratamientoVista = Tratamiento & { horas: string[] }

export type EstadoToma = "pendiente" | "tomada" | "pospuesta" | "omitida" | "sin_registrar"

export type TomaVista = {
  /** "t04|2026-10-27 08:00" */
  clave: string
  tratamiento: TratamientoVista
  fecha: string
  hora: string
  estado: EstadoToma
  hora_real?: string
  aviso_reprogramado?: string
}

/** Lo que se cambia de una toma desde este navegador. */
export type RegistroToma = Pick<TomaVista, "estado" | "hora_real" | "aviso_reprogramado">

export const FRECUENCIAS = [
  { valor: "cada_8h", etiqueta: "Cada 8 h", horas: 8 },
  { valor: "cada_12h", etiqueta: "Cada 12 h", horas: 12 },
  { valor: "cada_24h", etiqueta: "Cada 24 h", horas: 24 },
  { valor: "por_dias", etiqueta: "Por días", horas: 0 },
] as const

export const DIAS_SEMANA = [
  { valor: "lunes", corto: "L", indice: 1 },
  { valor: "martes", corto: "M", indice: 2 },
  { valor: "miercoles", corto: "X", indice: 3 },
  { valor: "jueves", corto: "J", indice: 4 },
  { valor: "viernes", corto: "V", indice: 5 },
  { valor: "sabado", corto: "S", indice: 6 },
  { valor: "domingo", corto: "D", indice: 0 },
] as const

export const claveToma = (tratamientoId: string, fecha: string, hora: string) => `${tratamientoId}|${fecha} ${hora}`

/** Horas de las tomas desde la primera, según la frecuencia: 08:00 cada 12 h → 08:00 y 20:00. */
export function horasDesde(primera: string, frecuencia: string) {
  const cada = FRECUENCIAS.find((f) => f.valor === frecuencia)?.horas ?? 0
  if (!cada) return [primera]
  const inicio = Number(primera.slice(0, 2))
  return Array.from({ length: 24 / cada }, (_, i) => `${String((inicio + i * cada) % 24).padStart(2, "0")}:00`).sort()
}

const CONCENTRACION = /\d[\d.,]*\s*(mg\/ml|mg|ml|g|%)/i

/** "Amoxicilina" + "Cápsula 250 mg" → "Amoxicilina 250 mg". */
export function nombreTratamiento(t: Pick<Tratamiento, "medicamento" | "presentacion">) {
  const dosis = CONCENTRACION.exec(t.presentacion)?.[0]
  return dosis && !t.medicamento.includes(dosis) ? `${t.medicamento} ${dosis.replace(".", ",")}` : t.medicamento
}

/** "250 mg · Cápsula oral" (G2). */
export function presentacionTratamiento(t: Pick<Tratamiento, "presentacion" | "via">) {
  const dosis = CONCENTRACION.exec(t.presentacion)?.[0]
  const forma = t.presentacion.replace(CONCENTRACION, "").trim()
  const via = t.via === "topica" ? "tópica" : t.via
  return [dosis?.replace(".", ","), [forma, via].filter(Boolean).join(" ")].filter(Boolean).join(" · ")
}

/** "Cada 12 h" o "2 veces por semana". */
export function frecuenciaTratamiento(t: Pick<Tratamiento, "frecuencia" | "dias_semana">) {
  if (t.frecuencia === "por_dias") {
    const n = t.dias_semana.split(";").filter(Boolean).length
    return n === 1 ? "1 vez por semana" : `${n} veces por semana`
  }
  return FRECUENCIAS.find((f) => f.valor === t.frecuencia)?.etiqueta ?? t.frecuencia
}

export function duracion(t: Pick<Tratamiento, "duracion_dias">) {
  return Number.parseInt(t.duracion_dias, 10) || 0
}

/** Día del tratamiento (1 a la duración): "Día 3 de 7". */
export function diaTratamiento(t: TratamientoVista) {
  const dur = duracion(t)
  return Math.min(Math.max(diasEntre(t.fecha_inicio, hoy()) + 1, 1), dur || 1)
}

/** El estado sin esperar a nadie: al pasar la fecha de fin, el tratamiento se finaliza solo (spec de G). */
export function estadoTratamiento(t: Tratamiento): Tratamiento["estado"] {
  if (t.estado === "finalizado") return "finalizado"
  return t.fecha_fin && t.fecha_fin <= hoy() ? "finalizado" : "vigente"
}

/** ¿Hay toma ese día? Todos los días entre inicio y fin, o solo los días elegidos en "Por días". */
function hayTomaEl(t: TratamientoVista, fecha: string) {
  if (fecha < t.fecha_inicio || (t.fecha_fin && fecha >= t.fecha_fin)) return false
  if (t.frecuencia !== "por_dias") return true
  return t.dias_semana.split(";").some((d) => DIAS_SEMANA.find((x) => x.valor === d)?.indice === diaSemana(fecha))
}

/** Sin respuesta 2 horas después de la hora de la toma: "Sin registrar". */
function vencida(fecha: string, hora: string) {
  if (fecha < hoy()) return true
  if (fecha > hoy()) return false
  const [h, m] = hora.split(":").map(Number)
  const [ah, am] = AHORA.split(":").map(Number)
  return ah * 60 + am - (h * 60 + m) > 120
}

/** Tomas de un día, con lo registrado (CSV o este navegador) o el estado que les toca. */
export function tomasDelDia(t: TratamientoVista, fecha: string, registros: Record<string, RegistroToma>): TomaVista[] {
  if (!hayTomaEl(t, fecha)) return []
  return t.horas.map((hora) => {
    const clave = claveToma(t.id, fecha, hora)
    const r = registros[clave]
    return {
      clave,
      tratamiento: t,
      fecha,
      hora,
      estado: r?.estado ?? (vencida(fecha, hora) ? "sin_registrar" : "pendiente"),
      hora_real: r?.hora_real,
      aviso_reprogramado: r?.aviso_reprogramado,
    }
  })
}

/** Tomas registradas del CSV indexadas por su clave. */
export function registrosDelCsv(tomas: Toma[]): Record<string, RegistroToma> {
  return Object.fromEntries(
    tomas.map((x) => {
      const [fecha, hora] = x.fecha_hora_programada.split(" ")
      return [
        claveToma(x.tratamiento_id, fecha, hora),
        {
          estado: x.estado as EstadoToma,
          hora_real: x.hora_real.split(" ")[1] || undefined,
          aviso_reprogramado: x.aviso_reprogramado.split(" ")[1] || undefined,
        },
      ]
    }),
  )
}

/** Resumen de G9: días cumplidos y tomas registradas u omitidas hasta hoy. */
export function resumenTratamiento(t: TratamientoVista, registros: Record<string, RegistroToma>) {
  const hasta = t.fecha_fin && t.fecha_fin < hoy() ? t.fecha_fin : sumarDias(hoy(), 1)
  const tomas: TomaVista[] = []
  for (let f = t.fecha_inicio; f < hasta; f = sumarDias(f, 1)) tomas.push(...tomasDelDia(t, f, registros))
  return {
    dias: Math.min(diasEntre(t.fecha_inicio, hasta), duracion(t) || 1),
    total: tomas.length,
    tomadas: tomas.filter((x) => x.estado === "tomada").length,
    omitidas: tomas.filter((x) => x.estado === "omitida" || x.estado === "sin_registrar").length,
  }
}

/** "Mañana", "Tarde" o "Noche" según la hora. */
export function momentoDelDia(hora: string) {
  const h = Number(hora.slice(0, 2))
  if (h < 12) return "Mañana"
  return h < 18 ? "Tarde" : "Noche"
}

/** "08:05" → "8:05 a. m."; "19:52" → "7:52 p. m.". */
export function hora12(hora: string) {
  const [h, m] = hora.split(":").map(Number)
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "a. m." : "p. m."}`
}

/** Hora menos `minutos` (aviso 10 min antes): "20:00" → "19:50". */
export function restarMinutos(hora: string, minutos: number) {
  const [h, m] = hora.split(":").map(Number)
  const total = (h * 60 + m - minutos + 1440) % 1440
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`
}
