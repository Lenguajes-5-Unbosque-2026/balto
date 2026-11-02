import type { Evento } from "@/lib/eventos"
import { fechaCorta, sumarDias } from "@/lib/fecha"

/** Una fila de data/mock/habitos.csv (o un hábito registrado en I2). */
export type Habito = {
  id: string
  mascota_id: string
  tipo: "paseo" | "actividad" | "sueno" | "deposiciones"
  fecha: string
  duracion_min: string
  consistencia: string
  observacion: string
  imagen: string
}

export const TIPOS_HABITO = [
  { slug: "paseo", nombre: "Paseo", icono: "directions_walk" },
  { slug: "actividad", nombre: "Actividad", icono: "sports_baseball" },
  { slug: "sueno", nombre: "Sueño", icono: "bedtime" },
  { slug: "deposiciones", nombre: "Deposiciones", icono: "water_drop" },
  { slug: "alimentacion", nombre: "Alimentación", icono: "restaurant" },
  { slug: "atipico", nombre: "Atípico", icono: "psychology" },
] as const

export type TipoHabito = (typeof TIPOS_HABITO)[number]["slug"]

/** Chips de I1 y casillas de I3, con los tipos que agrupa cada uno. */
export const GRUPOS_HABITO = [
  { slug: "paseos", nombre: "Paseos", largo: "Paseos y actividad", icono: "directions_walk", tipos: ["paseo", "actividad"] },
  { slug: "sueno", nombre: "Sueño", largo: "Sueño", icono: "bedtime", tipos: ["sueno"] },
  { slug: "atipico", nombre: "Comportamiento", largo: "Comportamiento atípico", icono: "psychology", tipos: ["atipico"] },
  { slug: "deposiciones", nombre: "Deposiciones", largo: "Deposiciones", icono: "water_drop", tipos: ["deposiciones"] },
  { slug: "alimentacion", nombre: "Alimentación", largo: "Alimentación", icono: "restaurant", tipos: ["alimentacion"] },
] as const satisfies readonly { slug: string; nombre: string; largo: string; icono: string; tipos: readonly TipoHabito[] }[]

export type GrupoHabito = (typeof GRUPOS_HABITO)[number]["slug"]

export const CONSISTENCIAS = [
  { valor: "normal", etiqueta: "Normal" },
  { valor: "blanda", etiqueta: "Blanda" },
  { valor: "liquida", etiqueta: "Líquida" },
  { valor: "con_sangre", etiqueta: "Con sangre" },
] as const

/** Un registro de la bitácora: un hábito o un evento de alimentación o comportamiento (E7). */
export type Registro = {
  id: string
  tipo: TipoHabito
  fecha: string
  minutos: number
  consistencia: string
  observacion: string
  fotos: number
  /** Los eventos abren su detalle (D4); los hábitos, su hoja. */
  eventoId?: string
}

export function registrosDe(habitos: Habito[], eventos: Evento[]): Registro[] {
  return [
    ...habitos.map((h) => ({
      id: h.id,
      tipo: h.tipo,
      fecha: h.fecha,
      minutos: Number(h.duracion_min) || 0,
      consistencia: h.consistencia,
      observacion: h.observacion,
      fotos: h.imagen ? 1 : 0,
    })),
    ...eventos
      .filter((e) => e.tipo === "comportamiento" || e.tipo === "alimentacion")
      .map((e) => ({
        id: e.id,
        tipo: (e.tipo === "comportamiento" ? "atipico" : "alimentacion") as TipoHabito,
        fecha: e.fecha,
        minutos: 0,
        consistencia: "",
        observacion: e.que_cambio ?? "",
        fotos: e.soportes?.length ?? 0,
        eventoId: e.id,
      })),
  ].sort((a, b) => b.fecha.localeCompare(a.fecha))
}

export const iconoHabito = (tipo: TipoHabito) => TIPOS_HABITO.find((t) => t.slug === tipo)!.icono

/** "45 min" o "6 h". */
function duracion(min: number) {
  if (!min) return ""
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} h ${m} min` : `${h} h`
}

/** Primera frase de la observación, corta: "Ladra de noche". */
function frase(texto: string, largo = 32) {
  const primera = texto.split(/[.;:]/)[0].trim()
  return primera.length > largo ? `${primera.slice(0, largo - 1).trim()}…` : primera
}

/** "Paseo largo", "Durmió poco", "Deposiciones blandas", o la primera frase del atípico. */
export function tituloRegistro(r: Registro) {
  switch (r.tipo) {
    case "paseo":
      return r.minutos >= 40 ? "Paseo largo" : "Paseo"
    case "actividad":
      return "Actividad"
    case "sueno":
      return r.minutos && r.minutos < 420 ? "Durmió poco" : "Sueño"
    case "deposiciones":
      return r.consistencia === "con_sangre" ? "Deposiciones con sangre" : r.consistencia && r.consistencia !== "normal" ? `Deposiciones ${CONSISTENCIAS.find((c) => c.valor === r.consistencia)?.etiqueta.toLowerCase()}s` : "Deposiciones"
    case "alimentacion":
      return frase(r.observacion) || "Alimentación"
    case "atipico":
      return frase(r.observacion) || "Comportamiento atípico"
  }
}

/** "45 min · paseo por el parque", "Sueño · 6 h", "Comportamiento atípico". */
export function detalleRegistro(r: Registro) {
  switch (r.tipo) {
    case "paseo":
    case "actividad":
      return [duracion(r.minutos), r.observacion && frase(r.observacion, 24).toLowerCase()].filter(Boolean).join(" · ")
    case "sueno":
      return ["Sueño", duracion(r.minutos)].filter(Boolean).join(" · ")
    case "deposiciones":
      return r.observacion ? frase(r.observacion, 40) : "Deposiciones"
    case "alimentacion":
      return "Alimentación"
    case "atipico":
      return "Comportamiento atípico"
  }
}

export function fotosTexto(n: number) {
  if (!n) return "Sin soporte"
  return n === 1 ? "1 foto" : `${n} fotos`
}

/** Datos de la gráfica de I1 según el filtro: paseos o atípicos por semana, u horas de sueño por noche. */
export function grafica(registros: Registro[], grupo: GrupoHabito | "todos") {
  if (grupo === "sueno") {
    const noches = registros.filter((r) => r.tipo === "sueno" && r.minutos).slice(0, 7).reverse()
    return { titulo: "Horas de sueño por noche", rango: `${noches.length} noches`, valores: noches.map((r) => r.minutos / 60) }
  }
  const tipos: readonly TipoHabito[] = grupo === "todos" ? ["paseo", "actividad"] : (GRUPOS_HABITO.find((g) => g.slug === grupo)?.tipos ?? [])
  const propios = registros.filter((r) => tipos.includes(r.tipo))
  const ultima = propios[0]?.fecha
  if (!ultima) return null
  // Cuatro semanas que terminan en el último registro.
  const valores = [3, 2, 1, 0].map((s) => {
    const hasta = sumarDias(ultima, -7 * s)
    const desde = sumarDias(hasta, -6)
    return propios.filter((r) => r.fecha >= desde && r.fecha <= hasta).length
  })
  const nombre = grupo === "atipico" ? "Atípicos" : grupo === "deposiciones" ? "Deposiciones" : grupo === "alimentacion" ? "Cambios de alimentación" : "Paseos"
  return { titulo: `${nombre} por semana`, rango: "4 semanas", valores }
}

/** "1 al 23 sep 2026" o "1 ago al 23 sep 2026". */
export function textoRango(desde: string, hasta: string) {
  const [d1, m1, a1] = fechaCorta(desde).split(" ")
  const [d2, m2, a2] = fechaCorta(hasta).split(" ")
  if (a1 !== a2) return `${fechaCorta(desde)} al ${fechaCorta(hasta)}`
  return m1 === m2 ? `${d1} al ${d2} ${m2} ${a2}` : `${d1} ${m1} al ${d2} ${m2} ${a2}`
}

/** Páginas del PDF: un resumen más una página por cada 10 registros. */
export function paginasBitacora(n: number) {
  return 1 + Math.max(1, Math.ceil(n / 10))
}
