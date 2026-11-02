"use client"

import Link from "next/link"
import { toast } from "sonner"

import { BotonIconoEnlace } from "@/components/boton-icono"
import { Icono } from "@/components/icono"
import type { AlertaVista } from "@/lib/alertas"
import { diasRestantes } from "@/lib/alimentacion"
import type { Producto } from "@/lib/datos"
import { HOY, diasEntre } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { nombreVacuna } from "@/lib/perfil"
import { agotado, iconoProducto, precio, productoDelPlan, productoDeVacuna, productoDesparasitacion } from "@/lib/tienda"
import type { PropsTienda } from "@/lib/tienda-servidor"
import { useAlertas } from "@/lib/usar-alertas"
import { usePlanes } from "@/lib/usar-alimentacion"
import { agregarAlCarrito, claveItem, useTienda } from "@/lib/usar-tienda"
import { cn } from "@/lib/utils"

export type { PropsTienda }

/** Ícono del carrito con el contador (encabezados de N). */
export function BotonCarrito({ cuenta }: { cuenta: number }) {
  return (
    <span className="relative">
      <BotonIconoEnlace href="/tienda/carrito" icono="shopping_cart" etiqueta={cuenta ? `Carrito (${cuenta})` : "Carrito"} />
      {cuenta > 0 && (
        <span className="pointer-events-none absolute -top-1 -right-1 grid size-5 place-items-center rounded-completo bg-primario texto-micro text-superficie">
          {cuenta}
        </span>
      )}
    </span>
  )
}

/** Agrega el alimento al carrito sumando la cantidad (N2, N3, N10). */
export function agregarAlimento(p: Producto, cantidad = 1, actual = 0) {
  if (agotado(p)) {
    toast("Este producto está agotado")
    return
  }
  agregarAlCarrito({ clave: claveItem(p.id), producto_id: p.id, cantidad: actual + cantidad })
  toast.success("Agregado al carrito", { description: p.nombre })
}

const dias = (n: number) => (n === 0 ? "hoy" : n === 1 ? "mañana" : `en ${n} días`)

/** "Se acaba en 12 días" (alimento del plan) y "Vence en 2 días" (vacuna o desparasitación más próxima) de la mascota activa. */
export function useRecomendados(datos: PropsTienda) {
  const [mascota] = useMascotaActiva(datos.mascotas)
  const { planes } = usePlanes(datos)
  const alertas = useAlertas(datos.alertas, datos.eventos, datos.mascotas, datos.marcas)
  const plan = planes[mascota.id]
  const restantes = plan ? diasRestantes(plan) : null
  const alimento = productoDelPlan(datos.productos, plan)
  const proxima = alertas
    .filter((a) => a.mascota_id === mascota.id && a.grupo !== "resuelta" && (a.tipo === "refuerzo_vacuna" || a.tipo === "proxima_desparasitacion"))
    .sort((a, b) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento))[0]
  return {
    mascota,
    plan,
    alimento: alimento && { producto: alimento, rotulo: restantes !== null ? `Se acaba ${dias(restantes)}` : "Según su plan" },
    vacuna: proxima && productoParaAlerta(datos.productos, proxima, mascota.especie),
    alertas,
  }
}

/** El producto de la Tienda que resuelve una alerta de vacuna o desparasitación (N4, N5). */
export function productoParaAlerta(productos: Producto[], a: AlertaVista, especie: string) {
  const producto =
    a.tipo === "proxima_desparasitacion" ? productoDesparasitacion(productos) : a.evento ? productoDeVacuna(productos, nombreVacuna(a.evento), especie) : undefined
  if (!producto) return undefined
  const n = diasEntre(HOY, a.fecha_vencimiento)
  return { producto, alerta: a, rotulo: n < 0 ? `Venció hace ${-n} días` : `Vence ${dias(n)}` }
}

type TarjetaProductoProps = {
  producto: Producto
  rotulo?: string
  detalle?: string
  href: string
  onAgregar: () => void
}

/** Producto en cuadrícula con imagen, nombre, precio y + (componente Tarjeta de producto). */
export function TarjetaProducto({ producto: p, rotulo, detalle, href, onAgregar }: TarjetaProductoProps) {
  const sinStock = agotado(p)
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-borde-fuerte bg-superficie p-2.5 movil-m:p-3">
      <Link href={href} className="flex flex-col gap-2">
        <span className="grid h-24 place-items-center rounded-md bg-acento-suave text-primario movil-m:h-28">
          <Icono nombre={iconoProducto(p)} className="icono-xl" />
        </span>
        <span className="flex flex-col gap-0.5">
          {(rotulo || sinStock) && <span className={cn("texto-micro", sinStock ? "text-error" : "text-primario")}>{sinStock ? "Agotado" : rotulo}</span>}
          <span className="line-clamp-2 texto-cuerpo-fuerte text-texto">{p.nombre}</span>
          <span className="truncate texto-etiqueta text-texto-secundario">{detalle ?? p.presentacion}</span>
        </span>
      </Link>
      <div className="mt-auto flex items-center justify-between gap-1">
        <span className="texto-titulo-seccion font-semibold text-texto">{precio(p.precio_cop)}</span>
        <button
          type="button"
          aria-label={`Agregar ${p.nombre}`}
          disabled={sinStock}
          onClick={onAgregar}
          className="grid size-9 shrink-0 place-items-center rounded-completo bg-primario text-superficie disabled:opacity-40"
        >
          <Icono nombre="add" className="icono-m" />
        </button>
      </div>
    </div>
  )
}

/** Cantidad en el carrito de un alimento, para sumar al agregar. */
export function useCantidad(datos: PropsTienda, productoId: string) {
  return useTienda(datos).carrito.find((i) => i.clave === claveItem(productoId))?.cantidad ?? 0
}
