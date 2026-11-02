import { normalizar } from "@/lib/eventos"
import { AHORA, HOY, diasEntre } from "@/lib/fecha"

export type Comida = { nombre: string; hora: string; gramos: number }

/** Plan de alimentación de una mascota, con sus comidas (H1, H4). */
export type Plan = {
  mascota_id: string
  tipo: "concentrado" | "casero"
  marca: string
  tipo_alimento: string
  presentacion_kg: number
  gramos_dia: number
  actividad: "baja" | "media" | "alta"
  fecha_bolsa_abierta: string
  comidas: Comida[]
  recordatorio: boolean
}

export const ACTIVIDADES = [
  { valor: "baja", etiqueta: "Baja", factor: 1.3 },
  { valor: "media", etiqueta: "Media", factor: 1.6 },
  { valor: "alta", etiqueta: "Alta", factor: 2 },
] as const

/**
 * Porción diaria sugerida: energía en reposo (70 × kg^0,75) por el factor de
 * actividad, con un concentrado de 3,6 kcal/g. Es una guía general (H4).
 */
export function porcionSugerida(kg: number, actividad: Plan["actividad"], especie: "perro" | "gato") {
  if (!kg) return 0
  const factor = ACTIVIDADES.find((a) => a.valor === actividad)!.factor * (especie === "gato" ? 0.75 : 1)
  return Math.round((70 * kg ** 0.75 * factor) / 3.6 / 10) * 10
}

/** "adulta", "cachorra", "senior" según la edad y el sexo. */
export function etapa(anios: number, sexo: string) {
  const a = sexo === "hembra" ? "a" : "o"
  if (anios < 1) return `cachorr${a}`
  if (anios >= 8) return "senior"
  return `adult${a}`
}

const NOMBRES: Record<number, string[]> = {
  1: ["Comida"],
  2: ["Desayuno", "Cena"],
  3: ["Desayuno", "Almuerzo", "Cena"],
  4: ["Desayuno", "Almuerzo", "Merienda", "Cena"],
}
const HORAS: Record<number, string[]> = { 1: ["08:00"], 2: ["07:00", "18:00"], 3: ["07:00", "12:30", "18:00"], 4: ["07:00", "12:30", "15:30", "18:00"] }

/** Reparte la porción del día en `n` comidas con sus horas habituales. */
export function repartir(gramosDia: number, n: number): Comida[] {
  return NOMBRES[n].map((nombre, i) => ({ nombre, hora: HORAS[n][i], gramos: Math.round(gramosDia / n) }))
}

/** Días de alimento que quedan en la bolsa abierta (15 kg ÷ 380 g al día, menos los días ya servidos). */
export function diasRestantes(p: Plan) {
  if (p.tipo !== "concentrado" || !p.presentacion_kg || !p.gramos_dia || !p.fecha_bolsa_abierta) return null
  return Math.max(Math.floor((p.presentacion_kg * 1000) / p.gramos_dia) - diasEntre(p.fecha_bolsa_abierta, HOY), 0)
}

/** "Concentrado adulto · salmón" o lo que le dan en casa. */
export function nombrePlan(p: Plan) {
  if (p.tipo === "casero") return p.marca
  return p.tipo_alimento ? `Concentrado ${p.tipo_alimento.charAt(0).toLowerCase()}${p.tipo_alimento.slice(1)}` : p.marca
}

export type EstadoComida = "servida" | "pendiente" | "sin_registrar"

/** Sin marcarla 2 horas después de la hora: "Sin registrar" (spec de H). */
export function estadoComida(hora: string, servida: boolean): EstadoComida {
  if (servida) return "servida"
  const [h, m] = hora.split(":").map(Number)
  const [ah, am] = AHORA.split(":").map(Number)
  return ah * 60 + am - (h * 60 + m) > 120 ? "sin_registrar" : "pendiente"
}

/** Alimentos tóxicos por especie, con la razón y alternativas seguras (H3, H6). */
const TOXICOS = [
  { claves: ["uva", "pasa"], nombre: "Uvas", razon: "Las uvas y las pasas pueden causar daño renal grave, incluso en poca cantidad.", corto: "Las uvas y las pasas pueden afectar los riñones.", especies: ["perro", "gato"] },
  { claves: ["chocolate", "cacao"], nombre: "Chocolate", razon: "El chocolate tiene teobromina, que acelera el corazón y puede causar convulsiones.", corto: "El chocolate puede causar arritmias y convulsiones.", especies: ["perro", "gato"] },
  { claves: ["cebolla", "ajo", "puerro", "cebollin"], nombre: "Cebolla o ajo", razon: "La cebolla, el ajo y el puerro dañan los glóbulos rojos y causan anemia.", corto: "La cebolla y el ajo pueden causar anemia.", especies: ["perro", "gato"] },
  { claves: ["xilitol", "chicle"], nombre: "Xilitol", razon: "El xilitol (chicles y dulces sin azúcar) baja el azúcar en la sangre y daña el hígado.", corto: "El xilitol puede causar hipoglucemia y daño hepático.", especies: ["perro"] },
  { claves: ["aguacate"], nombre: "Aguacate", razon: "El aguacate tiene persina, que puede causar vómito y diarrea.", corto: "El aguacate puede causar vómito y diarrea.", especies: ["perro", "gato"] },
  { claves: ["macadamia", "nuez"], nombre: "Nueces de macadamia", razon: "Las nueces de macadamia causan debilidad, temblores y fiebre.", corto: "Las nueces de macadamia pueden causar temblores.", especies: ["perro"] },
  { claves: ["cafe", "alcohol", "cerveza", "vino"], nombre: "Café o alcohol", razon: "El café y el alcohol son tóxicos para el sistema nervioso.", corto: "El café y el alcohol afectan el sistema nervioso.", especies: ["perro", "gato"] },
  { claves: ["lirio"], nombre: "Lirio", razon: "Cualquier parte del lirio puede causar falla renal en gatos.", corto: "Los lirios pueden causar falla renal.", especies: ["gato"] },
]

export const ALTERNATIVAS = { perro: ["Manzana sin semillas", "Zanahoria", "Pepino"], gato: ["Pollo cocido sin piel", "Calabaza cocida", "Atún en agua"] }

/** El alimento tóxico que aparece en el texto, si lo hay. */
export function alimentoToxico(texto: string, especie: "perro" | "gato") {
  const t = normalizar(texto)
  if (!t) return undefined
  return TOXICOS.find((x) => x.especies.includes(especie) && x.claves.some((c) => t.includes(c)))
}

export type AlimentoToxico = NonNullable<ReturnType<typeof alimentoToxico>>

export function buscarToxico(nombre: string) {
  return TOXICOS.find((x) => x.nombre === nombre)
}

export const HACE = ["Menos de 30 min", "30–60 min", "1–2 h", "Más de 2 h"]
