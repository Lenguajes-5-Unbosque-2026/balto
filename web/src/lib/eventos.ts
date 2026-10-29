import { fechaCorta, fechaNumerica, mesesEntre, nombreMes } from "@/lib/fecha"

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

/** Archivo adjunto. `url` solo existe si el archivo está publicado (los de data/mock/soportes/). */
export type Soporte = { nombre: string; tipo: "jpg" | "png" | "pdf"; tamanoKb: number; url?: string }

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
  /** Fecha de la última edición en D6. */
  fecha_edicion?: string
  eliminado_en?: string
  soportes?: Soporte[]
}

function primeraParte(texto?: string) {
  return (texto ?? "").split("·")[0].trim()
}

function segundaParte(texto?: string) {
  const [, resto] = (texto ?? "").split("·")
  return resto?.trim() ?? ""
}

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** Solo la primera letra, para no dañar siglas: "Múltiple DHPPi+L" → "múltiple DHPPi+L". */
export const enMinuscula = (t: string) => t.charAt(0).toLowerCase() + t.slice(1)
const unir = (...p: (string | false | undefined)[]) => p.filter(Boolean).join(" · ")

/** "Clínica Veterinaria Norte" → "Vet. Norte", como en las tarjetas de D2. */
export function veterinariaCorta(nombre?: string) {
  return (nombre ?? "").replace(/^(Clínica Veterinaria|Veterinaria|Clínica)\s+/i, "Vet. ")
}

/** "28.4" → "28,4 kg". */
export function textoKg(kg: string | number) {
  return `${String(kg).replace(".", ",")} kg`
}

/** "oral" → "Oral", "topica" → "Tópica"; lo escrito a mano queda igual. */
function textoVia(via?: string) {
  if (!via) return ""
  return via === "topica" ? "Tópica" : mayuscula(via)
}

/** "cada_12h" → "Cada 12 h"; lo escrito a mano en E5 queda igual. */
export function textoFrecuencia(frecuencia?: string) {
  if (!frecuencia) return ""
  const horas = /^cada_(\d+)h$/.exec(frecuencia)
  if (horas) return `Cada ${horas[1]} h`
  if (frecuencia === "por_dias") return "Algunos días"
  return mayuscula(frecuencia)
}

/** Título que muestran la tarjeta de evento y la confirmación (E9, D2). */
export function tituloEvento(e: Evento): string {
  switch (e.tipo) {
    case "vacuna":
      return `Vacuna ${enMinuscula(primeraParte(e.vacuna))}`
    case "desparasitacion":
      if (e.via?.toLowerCase() === "oral") return "Desparasitación interna"
      if (e.via?.toLowerCase().startsWith("t")) return "Desparasitación externa"
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

/** "+0,3 kg vs. agosto" frente al peso anterior de la misma mascota. */
function cambioPeso(e: Evento, anterior?: Evento) {
  if (!anterior?.peso_kg || !e.peso_kg) return ""
  const dif = Math.round((Number(e.peso_kg) - Number(anterior.peso_kg)) * 10) / 10
  const signo = dif > 0 ? "+" : dif < 0 ? "−" : "±"
  return `${signo}${textoKg(Math.abs(dif))} vs. ${nombreMes(anterior.fecha)}`
}

/** Línea de detalle de la tarjeta de evento. En peso, `anterior` es la medición previa. */
export function detalleEvento(e: Evento, anterior?: Evento): string {
  switch (e.tipo) {
    case "vacuna":
      return unir(refuerzo(e), veterinariaCorta(e.veterinaria))
    case "desparasitacion":
      return unir(e.producto, e.via && `Vía ${textoVia(e.via).toLowerCase()}`)
    case "consulta":
      return unir(e.diagnostico, veterinariaCorta(e.veterinaria))
    case "examen":
      return unir(e.resultado_principal, e.laboratorio)
    case "tratamiento":
      return unir("Tratamiento", e.duracion_dias && `${e.duracion_dias} días`)
    case "peso":
      return unir(textoKg(e.peso_kg ?? ""), cambioPeso(e, anterior))
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

/** Del más reciente al más antiguo; el mismo día, primero el último registrado. */
export function ordenarEventos(eventos: Evento[]) {
  return [...eventos].sort(
    (a, b) => b.fecha.localeCompare(a.fecha) || (b.fecha_creacion ?? "").localeCompare(a.fecha_creacion ?? ""),
  )
}

/** Medición de peso anterior a `e` de la misma mascota (para "+0,3 kg vs. agosto"). */
export function pesoAnterior(e: Evento, eventos: Evento[]) {
  if (e.tipo !== "peso") return undefined
  return ordenarEventos(eventos).find(
    (x) => x.tipo === "peso" && x.mascota_id === e.mascota_id && x.fecha < e.fecha && x.id !== e.id,
  )
}

/** Chips de D2 y D3, con los tipos de E que agrupa cada uno (spec de D). */
export const CATEGORIAS = [
  { slug: "vacunas", nombre: "Vacunas", icono: "vaccines", tipos: ["vacuna", "desparasitacion"] },
  { slug: "consultas", nombre: "Consultas", icono: "stethoscope", tipos: ["consulta"] },
  { slug: "examenes", nombre: "Exámenes", icono: "labs", tipos: ["examen"] },
  { slug: "medicacion", nombre: "Medicación", icono: "medication", tipos: ["tratamiento"] },
  { slug: "peso", nombre: "Peso", icono: "monitor_weight", tipos: ["peso"] },
  { slug: "habitos", nombre: "Hábitos", icono: "pets", tipos: ["alimentacion", "comportamiento"] },
  { slug: "otros", nombre: "Otros", icono: "more_horiz", tipos: ["otro"] },
] as const satisfies readonly { slug: string; nombre: string; icono: string; tipos: readonly TipoEvento[] }[]

export type Categoria = (typeof CATEGORIAS)[number]["slug"]

export function enCategoria(tipo: TipoEvento, categoria: Categoria) {
  const c = CATEGORIAS.find((x) => x.slug === categoria)
  return (c?.tipos as readonly TipoEvento[] | undefined)?.includes(tipo) ?? false
}

/** Sin tildes y en minúsculas, para buscar "antirrabica" y encontrar "Antirrábica". */
export function normalizar(texto: string) {
  return texto.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim()
}

const CAMPOS_BUSQUEDA = [
  "vacuna", "producto", "veterinaria", "motivo", "diagnostico", "recomendaciones", "tipo_examen", "laboratorio",
  "resultado_principal", "medicamento", "que_cambio", "titulo", "lugar", "detalle", "lote",
] as const

/** Búsqueda de D2: título, detalle y campos de texto del evento; no busca dentro de los archivos. */
export function coincide(e: Evento, busqueda: string) {
  const q = normalizar(busqueda)
  if (!q) return true
  const texto = normalizar([tituloEvento(e), detalleEvento(e), ...CAMPOS_BUSQUEDA.map((c) => e[c] ?? "")].join(" "))
  return q.split(/\s+/).every((palabra) => texto.includes(palabra))
}

export type Rasgo = { icono: string; texto: string }

/** Rasgos de la tarjeta destacada de D4 (por ejemplo, Refuerzo · 1 dosis · 1 soporte). */
export function rasgosEvento(e: Evento): Rasgo[] {
  const soportes = e.soportes?.length ?? 0
  const adjuntos = soportes ? [{ icono: "attach_file", texto: textoSoportes(soportes) }] : []
  switch (e.tipo) {
    case "vacuna":
      return [
        { icono: "event_repeat", texto: e.proximo_refuerzo ? "Refuerzo" : "Sin refuerzo" },
        { icono: "vaccines", texto: "1 dosis" },
        ...adjuntos,
      ]
    case "desparasitacion": {
      const meses = e.proxima_dosis ? mesesEntre(e.fecha, e.proxima_dosis) : 0
      return [
        ...(e.via ? [{ icono: "route", texto: textoVia(e.via) }] : []),
        ...(meses > 0 ? [{ icono: "event_repeat", texto: meses === 1 ? "Cada mes" : `Cada ${meses} meses` }] : []),
        ...adjuntos,
      ]
    }
    case "consulta":
      return [{ icono: "stethoscope", texto: "Consulta" }, ...adjuntos]
    case "examen":
      return [
        e.resultado === "alterado" ? { icono: "error", texto: "Alterado" } : { icono: "check_circle", texto: "Normal" },
        ...(e.proximo_control ? [{ icono: "event_repeat", texto: "Control" }] : []),
        ...adjuntos,
      ]
    case "tratamiento":
      return [
        ...(e.frecuencia ? [{ icono: "schedule", texto: textoFrecuencia(e.frecuencia) }] : []),
        ...(e.duracion_dias ? [{ icono: "date_range", texto: `${e.duracion_dias} días` }] : []),
        ...adjuntos,
      ]
    case "peso":
      return [{ icono: "monitor_weight", texto: textoKg(e.peso_kg ?? "") }]
    case "alimentacion":
      return [{ icono: "restaurant", texto: "Alimentación" }, ...adjuntos]
    case "comportamiento":
      return [{ icono: "psychology", texto: "Conducta" }, ...adjuntos]
    case "otro":
      return [...(e.lugar ? [{ icono: "place", texto: e.lugar }] : []), ...adjuntos]
  }
}

/** Lugar o veterinaria que acompaña la fecha en D4 ("12 sep 2026 · Clínica Veterinaria Norte"). */
export function lugarEvento(e: Evento) {
  return e.veterinaria || e.laboratorio || e.lugar || ""
}

export type FilaDato = { etiqueta: string; valor: string; largo?: boolean }

/** Filas de datos de D4 según el tipo; las vacías no se muestran. */
export function filasEvento(e: Evento, registradoPor: string): FilaDato[] {
  const fecha = (iso?: string) => (iso ? fechaNumerica(iso) : "")
  const propias = (): FilaDato[] => {
    switch (e.tipo) {
      case "vacuna":
        return [
          { etiqueta: "Producto", valor: segundaParte(e.vacuna) || primeraParte(e.vacuna) },
          { etiqueta: "Lote", valor: e.lote ?? "" },
          { etiqueta: "Próximo refuerzo", valor: fecha(e.proximo_refuerzo) },
        ]
      case "desparasitacion":
        return [
          { etiqueta: "Producto", valor: e.producto ?? "" },
          { etiqueta: "Vía", valor: textoVia(e.via) },
          { etiqueta: "Próxima dosis", valor: fecha(e.proxima_dosis) },
        ]
      case "consulta":
        return [
          { etiqueta: "Motivo", valor: e.motivo ?? "" },
          { etiqueta: "Diagnóstico", valor: e.diagnostico ?? "" },
          { etiqueta: "Recomendaciones", valor: e.recomendaciones ?? "", largo: true },
        ]
      case "examen":
        return [
          { etiqueta: "Resultado", valor: e.resultado === "alterado" ? "Alterado" : "Normal" },
          { etiqueta: "Resultado principal", valor: e.resultado_principal ?? "", largo: true },
          { etiqueta: "Solicitado por", valor: e.solicitado_por ?? "" },
          { etiqueta: "Próximo control", valor: fecha(e.proximo_control) },
        ]
      case "tratamiento":
        return [
          { etiqueta: "Medicamento", valor: e.medicamento ?? "" },
          { etiqueta: "Dosis", valor: e.dosis ?? "" },
          { etiqueta: "Vía", valor: textoVia(e.via) },
          { etiqueta: "Frecuencia", valor: textoFrecuencia(e.frecuencia) },
          { etiqueta: "Duración", valor: e.duracion_dias ? `${e.duracion_dias} días` : "" },
        ]
      case "peso":
        return [{ etiqueta: "Peso", valor: textoKg(e.peso_kg ?? "") }]
      case "alimentacion":
      case "comportamiento":
        return [{ etiqueta: "¿Qué cambió?", valor: e.que_cambio ?? "", largo: true }]
      case "otro":
        return [
          { etiqueta: "Lugar", valor: e.lugar ?? "" },
          { etiqueta: "Detalle", valor: e.detalle ?? "", largo: true },
        ]
    }
  }
  return [
    ...propias(),
    { etiqueta: "Registrado por", valor: registradoPor },
    ...(e.fecha_edicion ? [{ etiqueta: "Última edición", valor: fechaCorta(e.fecha_edicion) }] : []),
  ].filter((f) => f.valor)
}
