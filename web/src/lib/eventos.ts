import { mesesEntre } from "@/lib/fecha"

/** Los 9 tipos de evento de E1, en el orden de la cuadrícula. */
export const TIPOS_EVENTO = [
  { slug: "vacuna", nombre: "Vacuna", icono: "vaccines" },
  { slug: "desparasitacion", nombre: "Desparasitación", icono: "pest_control" },
  { slug: "consulta", nombre: "Consulta", icono: "stethoscope" },
  { slug: "examen", nombre: "Examen", icono: "labs" },
  { slug: "tratamiento", nombre: "Tratamiento", icono: "medication" },
  { slug: "peso", nombre: "Peso", icono: "monitor_weight" },
  { slug: "alimentacion", nombre: "Alimentación", icono: "restaurant" },
  { slug: "comportamiento", nombre: "Comportamiento", icono: "psychology" },
  { slug: "otro", nombre: "Otro", icono: "more_horiz" },
] as const

export type TipoEvento = (typeof TIPOS_EVENTO)[number]["slug"]

export function tipoEvento(slug: string) {
  return TIPOS_EVENTO.find((t) => t.slug === slug)
}

export type Soporte = { nombre: string; tipo: "jpg" | "png" | "pdf"; tamanoKb: number }

/** Un evento con las mismas columnas de data/mock/eventos.csv. */
export type Evento = {
  id: string
  mascota_id: string
  tipo: TipoEvento
  fecha: string
  veterinaria?: string
  vacuna?: string
  lote?: string
  proximo_refuerzo?: string
  producto?: string
  via?: string
  proxima_dosis?: string
  motivo?: string
  diagnostico?: string
  recomendaciones?: string
  tipo_examen?: string
  laboratorio?: string
  resultado_principal?: string
  resultado?: string
  solicitado_por?: string
  proximo_control?: string
  medicamento?: string
  dosis?: string
  frecuencia?: string
  duracion_dias?: string
  peso_kg?: string
  que_cambio?: string
  titulo?: string
  lugar?: string
  detalle?: string
  recordatorio?: string
  fecha_creacion?: string
  eliminado_en?: string
  soportes?: Soporte[]
}

function primeraParte(texto?: string) {
  return (texto ?? "").split("·")[0].trim()
}

/** Título que muestran la tarjeta de evento y la confirmación (E9, D2). */
export function tituloEvento(e: Evento): string {
  switch (e.tipo) {
    case "vacuna":
      return `Vacuna ${primeraParte(e.vacuna).toLowerCase()}`
    case "desparasitacion":
      return "Desparasitación"
    case "consulta":
      return e.motivo || "Consulta veterinaria"
    case "examen":
      return e.tipo_examen || "Examen"
    case "tratamiento":
      return primeraParte(e.medicamento) || "Tratamiento"
    case "peso":
      return "Peso registrado"
    case "alimentacion":
      return "Cambio de alimentación"
    case "comportamiento":
      return "Comportamiento"
    case "otro":
      return e.titulo || "Otro evento"
  }
}

/** Frecuencia del refuerzo a partir de las fechas ("Refuerzo anual"). */
function refuerzo(e: Evento) {
  if (!e.proximo_refuerzo) return ""
  const meses = mesesEntre(e.fecha, e.proximo_refuerzo)
  if (meses === 12) return "Refuerzo anual"
  if (meses === 6) return "Refuerzo semestral"
  return `Refuerzo en ${meses} meses`
}

/** Línea de detalle de la tarjeta de evento. */
export function detalleEvento(e: Evento): string {
  const unir = (...p: (string | undefined)[]) => p.filter(Boolean).join(" · ")
  switch (e.tipo) {
    case "vacuna":
      return unir(refuerzo(e), e.veterinaria)
    case "desparasitacion":
      return unir(e.producto, e.via && `Vía ${e.via}`)
    case "consulta":
      return unir(e.diagnostico, e.veterinaria)
    case "examen":
      return unir(e.resultado_principal, e.laboratorio)
    case "tratamiento":
      return unir("Tratamiento", e.duracion_dias && `${e.duracion_dias} días`)
    case "peso":
      return `${(e.peso_kg ?? "").replace(".", ",")} kg`
    case "alimentacion":
    case "comportamiento":
      return e.que_cambio ?? ""
    case "otro":
      return unir(e.lugar, e.detalle)
  }
}

export function iconoEvento(e: Pick<Evento, "tipo">) {
  return tipoEvento(e.tipo)?.icono ?? "event"
}

/** "1 soporte", "2 soportes" o "Sin soporte". */
export function textoSoportes(n: number) {
  if (n === 0) return "Sin soporte"
  return n === 1 ? "1 soporte" : `${n} soportes`
}
