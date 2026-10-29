import { enMinuscula, ordenarEventos, textoFrecuencia, tituloEvento, type Evento } from "@/lib/eventos"
import { HOY, diasEntre, fechaCorta, sumarDias } from "@/lib/fecha"

/** Lo que muestran Inicio y D1 de cada mascota (data/mock/mascotas.csv y alergias.csv). */
export type PerfilMascota = {
  id: string
  nombre: string
  imagen: string
  especie: "perro" | "gato"
  raza: string
  sexo: string
  /** "3 años" */
  edad: string
  microchip: string
  alergias: string[]
}

/** Una fila de data/mock/alertas.csv. */
export type Alerta = {
  id: string
  mascota_id: string
  tipo: "refuerzo_vacuna" | "proxima_desparasitacion" | "control_examen" | "control_peso" | "alimento_por_acabarse"
  evento_id: string
  fecha_vencimiento: string
  estado: "proxima" | "vencida"
}

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

/** "Golden Retriever" → "Golden", como en la tarjeta de Inicio y en D1. */
export function razaCorta(raza: string) {
  return raza.split(/[\s/]+/)[0] ?? ""
}

/** "PERRO · GOLDEN" (se muestra en mayúsculas con texto-micro). */
export function especieYRaza(m: PerfilMascota) {
  return [mayuscula(m.especie), razaCorta(m.raza)].filter(Boolean).join(" · ")
}

/** "Perro · Golden · Hembra · 3 años" (D1). */
export function detalleMascota(m: PerfilMascota) {
  return [mayuscula(m.especie), razaCorta(m.raza), mayuscula(m.sexo), m.edad].filter(Boolean).join(" · ")
}

/** "SP" para Samuel Parada. */
export function iniciales(nombre: string) {
  return nombre
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("")
}

/** "985112000123456" → "985 112 000 123 456". */
export function microchipLegible(numero: string) {
  return numero.replace(/(\d{3})(?=\d)/g, "$1 ")
}

/** "+57 300 000 0000" → "300 000 0000" (Colombia). */
export function telefonoLocal(telefono: string) {
  return telefono.replace(/^\+57\s*/, "")
}

const nombreVacuna = (e: Evento) => (e.vacuna ?? "").split("·")[0].trim()

/** La aplicación más reciente de cada vacuna, de la más nueva a la más antigua. */
export function ultimasVacunas(eventos: Evento[]) {
  const vistas = new Set<string>()
  return ordenarEventos(eventos).filter((e) => {
    if (e.tipo !== "vacuna") return false
    const clave = nombreVacuna(e).toLowerCase()
    if (vistas.has(clave)) return false
    vistas.add(clave)
    return true
  })
}

export { nombreVacuna }

/** Rasgo de vacunas de Inicio: al día si ningún refuerzo pendiente ya pasó. */
export function estadoVacunas(eventos: Evento[]): "al-dia" | "vencida" | "sin-vacunas" {
  const vacunas = ultimasVacunas(eventos)
  if (vacunas.length === 0) return "sin-vacunas"
  return vacunas.some((v) => v.proximo_refuerzo && v.proximo_refuerzo < HOY) ? "vencida" : "al-dia"
}

export function ultimoPeso(eventos: Evento[]) {
  return ordenarEventos(eventos).find((e) => e.tipo === "peso" && e.peso_kg)
}

/** Tratamientos que siguen corriendo hoy: "Cada 12 h · hasta 28 sep" (D1). */
export function medicacionVigente(eventos: Evento[]) {
  return ordenarEventos(eventos)
    .filter((e) => e.tipo === "tratamiento")
    .map((e) => {
      const dias = Number.parseInt(e.duracion_dias ?? "", 10)
      const fin = dias > 0 ? sumarDias(e.fecha, dias) : ""
      return { evento: e, fin }
    })
    .filter(({ fin }) => fin && fin >= HOY)
    .map(({ evento, fin }) => ({
      evento,
      nombre: evento.medicamento || tituloEvento(evento),
      detalle: [textoFrecuencia(evento.frecuencia), `hasta ${fechaCorta(fin).replace(/ \d{4}$/, "")}`]
        .filter(Boolean)
        .join(" · "),
    }))
}

/** Título de la alerta para la tarjeta "Próximo a vencer" de Inicio. */
export function tituloAlerta(a: Alerta, evento?: Evento) {
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return `Refuerzo ${evento ? enMinuscula(nombreVacuna(evento)) : "de vacuna"}`
    case "proxima_desparasitacion":
      return "Próxima desparasitación"
    case "control_examen":
      return `Control de ${enMinuscula(evento?.tipo_examen ?? "examen")}`
    case "control_peso":
      return "Control de peso"
    case "alimento_por_acabarse":
      return "Se acaba el alimento"
  }
}

/** "en 5 días (28 sep)", "mañana (28 oct)", "venció hace 26 días". */
export function cuandoVence(fecha: string) {
  const dias = diasEntre(HOY, fecha)
  const dia = `(${fechaCorta(fecha).replace(/ \d{4}$/, "")})`
  if (dias < 0) return `venció hace ${-dias} ${-dias === 1 ? "día" : "días"}`
  if (dias === 0) return `hoy ${dia}`
  if (dias === 1) return `mañana ${dia}`
  return `en ${dias} días ${dia}`
}

/** La alerta pendiente más cercana de la mascota (las vencidas primero). */
export function proximaAlerta(alertas: Alerta[], mascotaId: string) {
  return alertas
    .filter((a) => a.mascota_id === mascotaId)
    .sort((a, b) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento))[0]
}
