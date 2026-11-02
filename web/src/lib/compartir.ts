import type { Envio } from "@/lib/datos"
import { AHORA, HOY, diasEntre, sumarDias } from "@/lib/fecha"

/** Secciones de L1, en el orden de la lista. Las alergias van siempre, por seguridad. */
export const SECCIONES = [
  { slug: "identificacion", nombre: "Identificación y contacto", corto: "identificación", icono: "badge" },
  { slug: "vacunas", nombre: "Vacunas y desparasitaciones", corto: "vacunas", icono: "vaccines" },
  { slug: "medicacion", nombre: "Medicación vigente", corto: "medicación", icono: "medication" },
  { slug: "consultas", nombre: "Consultas", corto: "consultas", icono: "stethoscope" },
  { slug: "examenes", nombre: "Exámenes", corto: "exámenes", icono: "labs" },
] as const

export type Seccion = (typeof SECCIONES)[number]["slug"]

export const TODAS: Seccion[] = SECCIONES.map((s) => s.slug)

/** "completo" o la lista separada por ";" → las secciones. */
export function seccionesDe(texto: string): Seccion[] {
  if (texto === "completo") return TODAS
  return texto.split(";").filter((s): s is Seccion => TODAS.includes(s as Seccion))
}

/** "Identificación, vacunas y medicación". */
export function textoSecciones(secciones: Seccion[]) {
  if (secciones.length === TODAS.length) return "Perfil completo"
  const nombres = SECCIONES.filter((s) => secciones.includes(s.slug)).map((s) => s.corto)
  const texto = nombres.length > 1 ? `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}` : (nombres[0] ?? "")
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

/** Páginas del PDF: la de identificación más una por cada dos secciones. */
export function paginasPdf(secciones: Seccion[]) {
  return 1 + Math.ceil(Math.max(secciones.length - 1, 0) / 2)
}

export const VENCIMIENTOS = [
  { valor: "24_horas", etiqueta: "24 horas", icono: "schedule", dias: 1 },
  { valor: "7_dias", etiqueta: "7 días", icono: "event", dias: 7 },
  { valor: "sin_vencimiento", etiqueta: "Sin vencimiento", icono: "all_inclusive", dias: 0 },
] as const

/** Fecha y hora en que vence un enlace creado ahora. */
export function expiraEn(vencimiento: Envio["vencimiento"]) {
  const v = VENCIMIENTOS.find((x) => x.valor === vencimiento)
  return v?.dias ? `${sumarDias(HOY, v.dias)} ${AHORA}` : ""
}

/** "activo", "vencido" o "desactivado" (L5, L6, L8). */
export function estadoEnlace(e: Envio): "activo" | "vencido" | "desactivado" {
  if (e.activo !== "true") return "desactivado"
  if (e.expira_en && e.expira_en < `${HOY} ${AHORA}`) return "vencido"
  return "activo"
}

/** "vence en 7 días", "vence hoy", "sin vencimiento", "vencido". */
export function textoVence(e: Envio) {
  const estado = estadoEnlace(e)
  if (estado !== "activo") return estado
  if (!e.expira_en) return "sin vencimiento"
  const dias = diasEntre(HOY, e.expira_en.slice(0, 10))
  if (dias <= 0) return "vence hoy"
  return dias === 1 ? "vence mañana" : `vence en ${dias} días`
}

/** Token de 20 caracteres para balto.app/p/<token>. */
export function nuevoToken() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789"
  const azar = crypto.getRandomValues(new Uint8Array(20))
  return Array.from(azar, (n) => letras[n % letras.length]).join("")
}

/** "Hoy, 9:41 a. m.", "ayer", "26 oct". */
export function cuandoSeEnvio(fecha: string) {
  const dias = diasEntre(fecha, HOY)
  if (dias === 0) return "hoy"
  if (dias === 1) return "ayer"
  return `hace ${dias} días`
}
