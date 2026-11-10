"use client"

import { useMemo } from "react"

import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import type { Direccion, MetodoPago, Pedido, PedidoItem, Producto } from "@/lib/datos"
import { enSupabase } from "@/lib/sincronizar"
import { ENVIO, ENVIO_GRATIS_DESDE } from "@/lib/tienda"

const CLAVE_CARRITO = "balto:carrito"
const CLAVE_PEDIDOS = "balto:pedidos"
const CLAVE_DIRECCIONES = "balto:direcciones"
const CLAVE_METODOS = "balto:metodos-pago"
const CLAVE_PAGO = "balto:pago"

/** Un producto en el carrito; las vacunas llevan la mascota y la cita de aplicación (N5). */
export type ItemCarrito = { clave: string; producto_id: string; cantidad: number; mascota_id?: string; proveedor_id?: string; fecha_hora?: string }

/** Pedido hecho en este navegador, con sus productos. */
export type PedidoLocal = Pedido & { items: (ItemCarrito & { precio_unitario: number; cita_id?: string })[] }

export const claveItem = (productoId: string, mascotaId?: string) => (mascotaId ? `${productoId}-${mascotaId}` : productoId)

export function agregarAlCarrito(item: ItemCarrito) {
  guardarEnMapa<ItemCarrito>(CLAVE_CARRITO, item.clave, item)
}

export function quitarDelCarrito(clave: string) {
  guardarEnMapa<ItemCarrito>(CLAVE_CARRITO, clave, null)
}

export function vaciarCarrito(claves: string[]) {
  for (const c of claves) quitarDelCarrito(c)
}

export function guardarPedido(p: PedidoLocal) {
  guardarEnMapa<PedidoLocal>(CLAVE_PEDIDOS, p.id, p)
  const { items, ...pedido } = p
  enSupabase(
    { tipo: "guardar", tabla: "pedidos", donde: { id: p.id }, fila: pedido, alCrear: { dueno_id: DUENO_ACTUAL_ID } },
    {
      tipo: "reemplazar",
      tabla: "pedido_items",
      donde: { pedido_id: p.id },
      filas: items.map((i, n) => ({
        id: `${p.id}-i${n + 1}`,
        producto_id: i.producto_id,
        cantidad: i.cantidad,
        precio_unitario: i.precio_unitario,
        mascota_id: i.mascota_id ?? "",
        cita_id: i.cita_id ?? "",
      })),
    },
  )
}

export function guardarDireccion(d: Direccion) {
  guardarEnMapa<Direccion>(CLAVE_DIRECCIONES, d.id, d)
  enSupabase({ tipo: "guardar", tabla: "direcciones", donde: { id: d.id }, fila: d, alCrear: { dueno_id: DUENO_ACTUAL_ID } })
}

export function guardarMetodo(m: MetodoPago) {
  guardarEnMapa<MetodoPago>(CLAVE_METODOS, m.id, m)
  // Solo franquicia y últimos 4 dígitos: el número completo nunca se guarda.
  enSupabase({ tipo: "guardar", tabla: "metodos_pago", donde: { id: m.id }, fila: m, alCrear: { dueno_id: DUENO_ACTUAL_ID } })
}

/** Dirección y medio de pago elegidos en N7 ("pse" o el id de una tarjeta). */
export type SeleccionPago = { direccion_id: string; metodo: string }

export function guardarSeleccion(cambios: Partial<SeleccionPago>) {
  guardarEnMapa<SeleccionPago>(CLAVE_PAGO, "actual", cambios)
}

export type DatosTienda = {
  productos: Producto[]
  pedidos: Pedido[]
  items: PedidoItem[]
  direcciones: Direccion[]
  metodos: MetodoPago[]
}

/** Catálogo, carrito, pedidos, direcciones y medios de pago, con lo guardado en este navegador. */
export function useTienda({ productos, pedidos, items, direcciones, metodos }: DatosTienda) {
  const carritoLocal = useMapaLocal<ItemCarrito>(CLAVE_CARRITO)
  const pedidosLocales = useMapaLocal<PedidoLocal>(CLAVE_PEDIDOS)
  const direccionesLocales = useMapaLocal<Direccion>(CLAVE_DIRECCIONES)
  const metodosLocales = useMapaLocal<MetodoPago>(CLAVE_METODOS)
  const seleccion = useMapaLocal<SeleccionPago>(CLAVE_PAGO).actual

  return useMemo(() => {
    const carrito = Object.values(carritoLocal)
      .map((i) => ({ ...i, producto: productos.find((p) => p.id === i.producto_id)! }))
      .filter((i) => i.producto)
    const subtotal = carrito.reduce((s, i) => s + Number(i.producto.precio_cop) * i.cantidad, 0)
    const conAlimento = carrito.some((i) => i.producto.tipo === "alimento")
    const envio = conAlimento && subtotal < ENVIO_GRATIS_DESDE ? ENVIO : 0

    const todosPedidos: PedidoLocal[] = [
      ...Object.values(pedidosLocales),
      ...pedidos.filter((p) => !pedidosLocales[p.id]).map((p) => ({
        ...p,
        items: items
          .filter((i) => i.pedido_id === p.id)
          .map((i) => ({
            clave: i.id,
            producto_id: i.producto_id,
            cantidad: Number(i.cantidad),
            precio_unitario: Number(i.precio_unitario),
            mascota_id: i.mascota_id || undefined,
            cita_id: i.cita_id || undefined,
          })),
      })),
    ].sort((a, b) => b.fecha.localeCompare(a.fecha) || b.numero.localeCompare(a.numero))

    const listaDirecciones = [...direcciones.filter((d) => !direccionesLocales[d.id]), ...Object.values(direccionesLocales)]
    const listaMetodos = [...metodos.filter((m) => !metodosLocales[m.id]), ...Object.values(metodosLocales)]
    const direccion = listaDirecciones.find((d) => d.id === seleccion?.direccion_id) ?? listaDirecciones.find((d) => d.predeterminada === "true") ?? listaDirecciones[0]
    const metodo = seleccion?.metodo ?? listaMetodos.find((m) => m.predeterminado === "true")?.id ?? listaMetodos[0]?.id ?? ""

    return {
      carrito,
      cuenta: carrito.reduce((s, i) => s + i.cantidad, 0),
      subtotal,
      envio,
      total: subtotal + envio,
      conAlimento,
      pedidos: todosPedidos,
      direcciones: listaDirecciones,
      metodos: listaMetodos,
      direccion,
      metodo,
    }
  }, [carritoLocal, pedidosLocales, direccionesLocales, metodosLocales, seleccion, productos, pedidos, items, direcciones, metodos])
}
