import type { Producto } from "@/lib/datos"
import { normalizar } from "@/lib/eventos"

/** "$ 289.900" (pesos colombianos, sin decimales). */
export function precio(cop: number | string) {
  return `$ ${String(Math.round(Number(cop))).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`
}

/** Envío gratis desde $300.000; sin alimento no hay envío (las vacunas se aplican en la veterinaria). */
export const ENVIO = 8000
export const ENVIO_GRATIS_DESDE = 300000

export function iconoProducto(p: Pick<Producto, "tipo" | "nombre">) {
  if (p.tipo === "vacuna") return "vaccines"
  if (p.tipo === "desparasitacion") return "pest_control"
  return /snack/i.test(p.nombre) ? "cookie" : "restaurant"
}

export const paraEspecie = (p: Producto, especie: string) => p.especie.split(";").includes(especie)

export const agotado = (p: Producto) => p.tipo === "alimento" && Number(p.stock) <= 0

/** El concentrado del catálogo que coincide con el plan de alimentación (H1): "Adulto · salmón" → "Concentrado adulto salmón". */
export function productoDelPlan(productos: Producto[], plan?: { tipo: string; marca: string; tipo_alimento: string }) {
  if (!plan || plan.tipo !== "concentrado") return undefined
  const palabras = normalizar(`${plan.tipo_alimento} ${plan.marca}`).split(/[^a-z]+/).filter((w) => w.length > 3)
  return productos.find((p) => p.tipo === "alimento" && palabras.some((w) => normalizar(p.nombre).includes(w)))
}

/** La vacuna o desparasitación del catálogo para una alerta: "Antirrábica felina" → Antirrábica. */
export function productoDeVacuna(productos: Producto[], nombre: string, especie: string) {
  const n = normalizar(nombre)
  return productos.find((p) => p.tipo === "vacuna" && paraEspecie(p, especie) && n.includes(normalizar(p.nombre).split(" ")[0]))
}

export const productoDesparasitacion = (productos: Producto[]) => productos.find((p) => p.tipo === "desparasitacion")

/** Pasos del seguimiento de N9. */
export const PASOS_PEDIDO = [
  { estado: "confirmado", nombre: "Pedido confirmado", icono: "check_circle" },
  { estado: "preparacion", nombre: "En preparación", icono: "inventory_2" },
  { estado: "en_camino", nombre: "En camino", icono: "local_shipping" },
  { estado: "entregado", nombre: "Entregado", icono: "home" },
] as const

export const pasoPedido = (estado: string) => Math.max(PASOS_PEDIDO.findIndex((p) => p.estado === estado), 0)

/** Bancos de PSE (N13, N16). */
export const BANCOS = ["Bancolombia", "Banco de Bogotá", "Davivienda", "BBVA", "Nequi", "Daviplata"]

/** Tarjeta de prueba que la pasarela rechaza (para ver N14). */
export const TARJETA_RECHAZADA = "0002"
