"use client"

import { useRouter } from "next/navigation"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { agregarAlimento, useRecomendados, type PropsTienda } from "@/components/tienda/comun"
import { Cantidad } from "@/components/tienda/productos"
import { veterinariaCorta } from "@/lib/eventos"
import { fechaLarga } from "@/lib/fecha"
import { useMascotas } from "@/lib/mascota-activa"
import { iconoProducto, precio } from "@/lib/tienda"
import { agregarAlCarrito, quitarDelCarrito, useTienda } from "@/lib/usar-tienda"
import { useVolver } from "@/lib/usar-salud"

/** "jue 25, 10:00". */
export const cuandoAplicacion = (fechaHora: string) => `${fechaLarga(fechaHora.slice(0, 10)).slice(0, 3).toLowerCase()} ${Number(fechaHora.slice(8, 10))}, ${fechaHora.slice(11)}`

/** Resumen de subtotal, envío, aplicación y total (N6, N7, N15). */
export function Totales({ subtotal, envio, vacunas, etiqueta = "Subtotal" }: { subtotal: number; envio: number; vacunas: boolean; etiqueta?: string }) {
  return (
    <dl className="flex flex-col gap-2 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4">
      {[
        [etiqueta, precio(subtotal)],
        ["Envío", envio ? precio(envio) : "Gratis"],
        ...(vacunas ? [["Aplicación de la vacuna", "Incluida"]] : []),
      ].map(([e, v]) => (
        <div key={e} className="flex justify-between gap-4">
          <dt className="texto-etiqueta text-texto-secundario">{e}</dt>
          <dd className="texto-etiqueta-fuerte text-texto">{v}</dd>
        </div>
      ))}
      <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-borde pt-3">
        <dt className="texto-cuerpo-fuerte text-texto">Total</dt>
        <dd className="texto-titulo-seccion font-semibold text-primario">{precio(subtotal + envio)}</dd>
      </div>
    </dl>
  )
}

/** N6 · Carrito y N10 · Carrito vacío. */
export function Carrito(datos: PropsTienda) {
  const router = useRouter()
  const volver = useVolver("/tienda")
  const { carrito, subtotal, envio } = useTienda(datos)
  const { mascota, alimento, vacuna } = useRecomendados(datos)
  const mascotas = useMascotas(datos.mascotas)

  if (carrito.length === 0) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Carrito" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <div className="pt-4">
          <Estado icono="shopping_cart" titulo="Tu carrito está vacío" mensaje="Aquí aparece el alimento y las vacunas que agregues." />
        </div>
        {(alimento || vacuna) && <h2 className="mt-1 texto-titulo-seccion font-semibold text-texto">Recomendado para {mascota.nombre}</h2>}
        {alimento && (
          <FilaOpcion
            icono="restaurant"
            titulo={alimento.producto.nombre}
            detalle={`${alimento.rotulo} · ${precio(alimento.producto.precio_cop)}`}
            derecha={<Icono nombre="add" className="icono-m text-texto-secundario" />}
            onClick={() => agregarAlimento(alimento.producto)}
          />
        )}
        {vacuna && (
          <FilaOpcion
            icono={iconoProducto(vacuna.producto)}
            titulo={`${vacuna.producto.nombre} · ${mascota.nombre}`}
            detalle={`${vacuna.rotulo} · ${precio(vacuna.producto.precio_cop)}`}
            derecha={<Icono nombre="add" className="icono-m text-texto-secundario" />}
            href={`/tienda/vacuna?id=${vacuna.producto.id}&mascota=${mascota.id}&alerta=${vacuna.alerta.id}`}
          />
        )}
        <BarraAccion>
          <BotonEnlace href="/tienda">Ir a la tienda</BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado titulo="Carrito" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      {carrito.map((i) => {
        const esVacuna = i.producto.tipo !== "alimento"
        const vet = datos.proveedores.find((v) => v.id === i.proveedor_id)
        return (
          <div key={i.clave} className="flex items-center gap-3 rounded-md border border-borde-fuerte bg-superficie p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
              <Icono nombre={iconoProducto(i.producto)} className="icono-m" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="line-clamp-2 texto-cuerpo-fuerte text-texto">
                {esVacuna ? `${i.producto.nombre} · ${mascotas.find((m) => m.id === i.mascota_id)?.nombre ?? ""}` : i.producto.nombre}
              </span>
              <span className="truncate texto-etiqueta text-texto-secundario">
                {esVacuna
                  ? `${vet ? veterinariaCorta(vet.nombre) : "Aplicación"} ${cuandoAplicacion(i.fecha_hora ?? "")} · ${precio(i.producto.precio_cop)}`
                  : `${i.producto.presentacion} · ${precio(Number(i.producto.precio_cop) * i.cantidad)}`}
              </span>
            </span>
            {esVacuna ? (
              <button type="button" aria-label="Quitar" onClick={() => quitarDelCarrito(i.clave)} className="grid size-9 shrink-0 place-items-center text-texto-secundario">
                <Icono nombre="delete" className="icono-m" />
              </button>
            ) : (
              <Cantidad valor={i.cantidad} min={0} onCambio={(n) => (n === 0 ? quitarDelCarrito(i.clave) : agregarAlCarrito({ clave: i.clave, producto_id: i.producto_id, cantidad: n }))} />
            )}
          </div>
        )
      })}
      <Totales subtotal={subtotal} envio={envio} vacunas={carrito.some((i) => i.producto.tipo !== "alimento")} />
      <BarraAccion>
        <Boton onClick={() => router.push("/tienda/pago")}>
          Ir a pagar
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
