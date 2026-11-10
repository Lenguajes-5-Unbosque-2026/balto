import { veterinariaCorta, type Evento } from "@/lib/eventos"
import { HOY, diasEntre, fechaCorta, mesesEntre, sumarDias } from "@/lib/fecha"
import { nombreVacuna, tituloAlerta, type Alerta } from "@/lib/perfil"

/** Alerta lista para mostrar: con su evento de origen, la mascota y el grupo de J1. */
export type AlertaVista = Alerta & {
  evento?: Evento
  /** Marca del alimento, para "Se acaba el alimento". */
  marca?: string
  mascota: { id: string; nombre: string; imagen: string }
  grupo: "vencida" | "semana" | "adelante" | "resuelta"
  /** Fecha a la que se movió el aviso (J3). */
  pospuesta?: string
  /** Se agregó a K6 · Calendario de Balto desde J1. */
  en_calendario?: boolean
}

export const ICONOS_ALERTA: Record<Alerta["tipo"], string> = {
  refuerzo_vacuna: "vaccines",
  proxima_desparasitacion: "pest_control",
  control_examen: "labs",
  control_peso: "monitor_weight",
  alimento_por_acabarse: "restaurant",
}

/** Chips de tipo de J8, con los tipos de alerta que agrupa cada uno. */
export const CATEGORIAS_ALERTA = [
  { slug: "vacunas", nombre: "Vacunas", icono: "vaccines", tipos: ["refuerzo_vacuna"] },
  { slug: "desparasitacion", nombre: "Desparasitación", icono: "pest_control", tipos: ["proxima_desparasitacion"] },
  { slug: "controles", nombre: "Controles", icono: "stethoscope", tipos: ["control_examen", "control_peso"] },
  { slug: "alimento", nombre: "Alimento", icono: "restaurant", tipos: ["alimento_por_acabarse"] },
  { slug: "salud", nombre: "Salud", icono: "monitor_heart", tipos: [] },
] as const satisfies readonly { slug: string; nombre: string; icono: string; tipos: readonly Alerta["tipo"][] }[]

export type CategoriaAlerta = (typeof CATEGORIAS_ALERTA)[number]["slug"]

export function enCategoriaAlerta(tipo: Alerta["tipo"], categorias: CategoriaAlerta[]) {
  if (categorias.length === 0) return true
  return CATEGORIAS_ALERTA.some((c) => categorias.includes(c.slug) && (c.tipos as readonly string[]).includes(tipo))
}

/** Grupo de J1 según los días que faltan (spec de J: 7 días o menos = esta semana). */
export function grupoAlerta(fecha: string): AlertaVista["grupo"] {
  const dias = diasEntre(HOY, fecha)
  if (dias < 0) return "vencida"
  return dias <= 7 ? "semana" : "adelante"
}

export function tituloAlertaVista(a: AlertaVista) {
  return tituloAlerta(a, a.evento)
}

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/** "VENCE EN 2 DÍAS · 25 SEP" o "VENCIÓ HACE 3 DÍAS · 25 SEP" (tarjetas grandes de J1). */
export function rotuloVence(a: AlertaVista) {
  const dias = diasEntre(HOY, a.fecha_vencimiento)
  const dia = sinAnio(a.fecha_vencimiento)
  if (dias < 0) return `Venció hace ${-dias} ${dias === -1 ? "día" : "días"} · ${dia}`
  if (dias === 0) return `Vence hoy · ${dia}`
  if (dias === 1) return `Vence mañana · ${dia}`
  return `Vence en ${dias} días · ${dia}`
}

/** "EN 12 DÍAS · 5 OCT" o "EN 10 MESES · 12 SEP 2027" (tarjetas de "Más adelante"). */
export function rotuloAdelante(a: AlertaVista) {
  const dias = diasEntre(HOY, a.fecha_vencimiento)
  if (dias <= 60) return `En ${dias} días · ${sinAnio(a.fecha_vencimiento)}`
  const meses = mesesEntre(HOY, a.fecha_vencimiento)
  return `En ${meses} ${meses === 1 ? "mes" : "meses"} · ${fechaCorta(a.fecha_vencimiento)}`
}

/** "Anual", "Cada 3 meses", "Mensual": cada cuánto se repite lo que avisa la alerta. */
export function frecuenciaAlerta(a: AlertaVista) {
  if (a.tipo === "control_peso") return "Mensual"
  if (a.tipo === "alimento_por_acabarse") return "Por bolsa"
  const e = a.evento
  if (!e) return ""
  const meses = mesesEntre(e.fecha, a.fecha_vencimiento)
  if (meses === 12) return "Anual"
  if (meses === 6) return "Semestral"
  if (meses === 1) return "Mensual"
  return meses > 0 ? `Cada ${meses} meses` : ""
}

/** Segunda línea de la tarjeta: "última dosis 25 sep 2025", "cada 3 meses", "mensual". */
export function detalleAlerta(a: AlertaVista) {
  const e = a.evento
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return e ? `última dosis ${fechaCorta(e.fecha)}` : "refuerzo de vacuna"
    case "proxima_desparasitacion":
      return frecuenciaAlerta(a).toLowerCase() || "próxima dosis"
    case "control_examen":
      return e ? `último el ${fechaCorta(e.fecha)}` : "control"
    case "control_peso":
      return "mensual"
    case "alimento_por_acabarse":
      return a.marca ? `quedan pocos días de ${a.marca}` : "quedan pocos días"
  }
}

/** "La última dosis fue el 25 sep 2025 en Clínica Veterinaria Norte." (J2). */
export function textoUltimaVez(a: AlertaVista) {
  const e = a.evento
  const lugar = e?.veterinaria ? ` en ${e.veterinaria}` : e?.laboratorio ? ` en ${e.laboratorio}` : ""
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return e ? `La última dosis fue el ${fechaCorta(e.fecha)}${lugar}.` : ""
    case "proxima_desparasitacion":
      return e ? `La última fue el ${fechaCorta(e.fecha)} con ${e.producto}.` : ""
    case "control_examen":
      return e ? `El último ${(e.tipo_examen ?? "examen").toLowerCase()} fue el ${fechaCorta(e.fecha)}${lugar}.` : ""
    case "control_peso":
      return `No hay una medición de peso de ${a.mascota.nombre} en los últimos 30 días.`
    case "alimento_por_acabarse":
      return `La bolsa de ${a.marca ?? "alimento"} de ${a.mascota.nombre} se acaba pronto.`
  }
}

/** Nombre corto de lo que se registra al resolver: "la antirrábica", "el hemograma". */
export function queSeRegistra(a: AlertaVista) {
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return a.evento ? `La ${nombreVacuna(a.evento).toLowerCase()}` : "La vacuna"
    case "proxima_desparasitacion":
      return "La desparasitación"
    case "control_examen":
      return `El ${(a.evento?.tipo_examen ?? "examen").toLowerCase()}`
    case "control_peso":
      return "El peso"
    case "alimento_por_acabarse":
      return "La compra"
  }
}

/**
 * "Marcar resuelta": el formulario de E del tipo con los datos llenos (spec de J).
 * El alimento no abre formulario: se marca como comprado ahí mismo.
 */
export function rutaResolver(a: AlertaVista) {
  const e = a.evento
  // "resuelve" es el título de la alerta, para la nota del formulario.
  const datos = new URLSearchParams({ alerta: a.id, resuelve: tituloAlertaVista(a) })
  const con = (campo: string, valor?: string) => valor && datos.set(campo, valor)
  // La próxima fecha se propone con el mismo intervalo de la vez anterior, contado desde hoy.
  const siguiente = e && e.fecha < a.fecha_vencimiento ? sumarDias(HOY, diasEntre(e.fecha, a.fecha_vencimiento)) : ""
  switch (a.tipo) {
    case "refuerzo_vacuna":
      con("vacuna", e && nombreVacuna(e))
      con("veterinaria", e?.veterinaria)
      con("proximo_refuerzo", siguiente)
      return `/registrar/vacuna?${datos}`
    case "proxima_desparasitacion":
      con("producto", e?.producto)
      con("via", e?.via)
      con("proxima_dosis", siguiente)
      return `/registrar/desparasitacion?${datos}`
    case "control_examen":
      con("tipo_examen", e?.tipo_examen)
      con("laboratorio", e?.laboratorio)
      con("proximo_control", siguiente)
      return `/registrar/examen?${datos}`
    case "control_peso":
      return `/registrar/peso?${datos}`
    case "alimento_por_acabarse":
      return null
  }
}

/** Subtítulo de "Marcar resuelta" en J2 y J4. */
export function detalleResolver(a: AlertaVista) {
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return "Registrar la vacuna aplicada"
    case "proxima_desparasitacion":
      return "Registrar la desparasitación"
    case "control_examen":
      return "Registrar el examen"
    case "control_peso":
      return "Registrar el peso de hoy"
    case "alimento_por_acabarse":
      return "Ya compré una bolsa nueva"
  }
}

/** Alertas que crea un evento registrado en este navegador con próxima fecha (E2, E10, E4). */
export function alertaDeEvento(e: Evento): Alerta | null {
  const base = { id: `l-${e.id}`, mascota_id: e.mascota_id, evento_id: e.id, estado: "proxima" as const }
  if (e.tipo === "vacuna" && e.proximo_refuerzo && e.recordatorio === "true")
    return { ...base, tipo: "refuerzo_vacuna", fecha_vencimiento: e.proximo_refuerzo }
  if (e.tipo === "desparasitacion" && e.proxima_dosis && e.recordatorio === "true")
    return { ...base, tipo: "proxima_desparasitacion", fecha_vencimiento: e.proxima_dosis }
  if (e.tipo === "examen" && e.proximo_control) return { ...base, tipo: "control_examen", fecha_vencimiento: e.proximo_control }
  return null
}

/** Próxima fecha que guarda el evento de origen (para seguir sus ediciones en D6). */
export function proximaFechaEvento(e: Evento) {
  return e.proximo_refuerzo || e.proxima_dosis || e.proximo_control || ""
}

export function veterinariaAlerta(a: AlertaVista) {
  return a.evento?.veterinaria ? veterinariaCorta(a.evento.veterinaria) : ""
}
