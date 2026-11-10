"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Pasos } from "@/components/pasos"
import { Selector } from "@/components/selector"
import { EncabezadoTienda, type PropsTienda } from "@/components/tienda/comun"
import { Totales, cuandoAplicacion } from "@/components/tienda/carrito"
import { veterinariaCorta } from "@/lib/eventos"
import { fechaCorta, hoy, sumarDias } from "@/lib/fecha"
import { hora12 } from "@/lib/medicamentos"
import { PASOS_PEDIDO, iconoProducto, pasoPedido, precio } from "@/lib/tienda"
import { useTienda, type PedidoLocal } from "@/lib/usar-tienda"
import { useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/** "Llega mañana entre 8 a. m. y 12 m." a partir de "28 oct · 8 a. m.–12 m.". */
export function textoEntrega(p: PedidoLocal) {
  const [dia, rango = ""] = p.ventana_entrega.split(" · ")
  if (p.estado_entrega === "entregado") return `Entregado el ${dia}`
  const cuando = dia === sinAnio(hoy()) ? "hoy" : dia === sinAnio(sumarDias(hoy(), 1)) ? "mañana" : `el ${dia}`
  const [desde, hasta] = rango.split("–")
  return hasta ? `Llega ${cuando} entre ${desde.trim()} y ${hasta.trim()}` : `Llega ${cuando}`
}

function Lineas({ p, datos }: { p: PedidoLocal; datos: PropsTienda }) {
  return (
    <>
      {p.items.map((i) => {
        const producto = datos.productos.find((x) => x.id === i.producto_id)
        if (!producto) return null
        const mascota = datos.mascotas.find((m) => m.id === i.mascota_id)?.nombre
        const vet = datos.proveedores.find((v) => v.id === i.proveedor_id)
        const cita = datos.citas.find((c) => c.id === i.cita_id)
        const fechaHora = i.fecha_hora ?? cita?.fecha_hora
        const vacuna = producto.tipo !== "alimento"
        return (
          <FilaOpcion
            key={i.clave}
            icono={iconoProducto(producto)}
            titulo={vacuna ? `${producto.nombre} · ${mascota ?? ""}` : producto.nombre}
            detalle={
              vacuna
                ? [fechaHora && cuandoAplicacion(fechaHora), vet && veterinariaCorta(vet.nombre)].filter(Boolean).join(" · ")
                : `${producto.presentacion} · ${i.cantidad > 1 ? `${i.cantidad} × ` : ""}${precio(i.precio_unitario)}`
            }
            href={vacuna && i.cita_id ? `/veterinarias/cita?id=${i.cita_id}` : undefined}
            derecha={vacuna && i.cita_id ? undefined : <span />}
          />
        )
      })}
    </>
  )
}

/** N8 · Pedido confirmado (/tienda/confirmado?id=…). */
export function PedidoConfirmado(datos: PropsTienda) {
  const id = useSearchParams().get("id")
  const p = useTienda(datos).pedidos.find((x) => x.id === id)

  if (!p) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-pantalla">
        <Estado icono="search_off" titulo="No encontramos el pedido" />
        <BotonEnlace href="/tienda/pedidos">Mis pedidos</BotonEnlace>
      </main>
    )
  }

  const alimento = p.items.find((i) => datos.productos.find((x) => x.id === i.producto_id)?.tipo === "alimento")
  const vacunas = p.items.filter((i) => i.cita_id)

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Pedido" derecha={<BotonIconoEnlace href="/tienda" icono="close" etiqueta="Cerrar" />} />
      <Estado tono="exito" icono="check_circle" titulo="¡Pedido confirmado!" mensaje={`Pedido #${p.numero}`} />
      {alimento && (
        <FilaOpcion
          borde
          icono="local_shipping"
          titulo={datos.productos.find((x) => x.id === alimento.producto_id)!.nombre}
          detalle={textoEntrega(p)}
          derecha={<span />}
        />
      )}
      {vacunas.map((i) => {
        const vet = datos.proveedores.find((v) => v.id === i.proveedor_id)
        const producto = datos.productos.find((x) => x.id === i.producto_id)!
        return (
          <FilaOpcion
            key={i.clave}
            borde
            icono={iconoProducto(producto)}
            titulo={`${producto.nombre}${vet ? ` · ${veterinariaCorta(vet.nombre)}` : ""}`}
            detalle={`${cuandoAplicacion(i.fecha_hora ?? "")} · agregada al calendario`}
            href={`/veterinarias/cita?id=${i.cita_id}`}
          />
        )
      })}
      <Nota icono="notifications_active">Te avisaremos cuando el pedido salga{vacunas.length ? " y un día antes de la cita" : ""}.</Nota>
      <BarraAccion>
        <BotonEnlace href={`/tienda/pedido?id=${p.id}`}>Ver mi pedido</BotonEnlace>
        <BotonEnlace href="/tienda" variante="secundario">
          Listo
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}

/** N9 · Mis pedidos y seguimiento, con En curso y Anteriores. */
export function MisPedidos(datos: PropsTienda) {
  const { pedidos, cuenta } = useTienda(datos)
  const [pestana, setPestana] = useState<"curso" | "anteriores">("curso")
  const enCurso = pedidos.filter((p) => p.estado_pago === "aprobado" && p.estado_entrega && p.estado_entrega !== "entregado")
  const anteriores = pedidos.filter((p) => !enCurso.includes(p))
  const actual = enCurso[0]

  return (
    <div className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <EncabezadoTienda actual="pedidos" cuenta={cuenta} />
      <Selector
        etiqueta="Pedidos"
        valor={pestana}
        onCambio={(v) => setPestana(v as typeof pestana)}
        opciones={[
          { valor: "curso", etiqueta: "En curso" },
          { valor: "anteriores", etiqueta: "Anteriores" },
        ]}
      />
      {pestana === "curso" ? (
        actual ? (
          <Seguimiento p={actual} datos={datos} />
        ) : (
          <div className="flex flex-col gap-4 pt-6">
            <Estado icono="local_shipping" titulo="Aún no tienes pedidos en curso" />
            <BotonEnlace href="/tienda">Ir a la tienda</BotonEnlace>
          </div>
        )
      ) : anteriores.length ? (
        <div className="flex flex-col gap-3">
          {anteriores.map((p) => (
            <FilaOpcion
              key={p.id}
              borde
              icono={p.estado_pago === "rechazado" ? "credit_card_off" : "inventory_2"}
              titulo={`Pedido #${p.numero}`}
              detalle={`${p.estado_pago === "rechazado" ? "Pago rechazado" : p.estado_entrega === "entregado" ? textoEntrega(p) : "Solo vacunas"} · ${precio(p.total)}`}
              href={`/tienda/pedido?id=${p.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="pt-6">
          <Estado icono="history" titulo="Sin pedidos anteriores" />
        </div>
      )}
    </div>
  )
}

function Seguimiento({ p, datos }: { p: PedidoLocal; datos: PropsTienda }) {
  const paso = pasoPedido(p.estado_entrega)
  const producto = datos.productos.find((x) => x.id === p.items[0]?.producto_id)
  const hora = p.fecha.slice(11)
  return (
    <>
      <Link href={`/tienda/pedido?id=${p.id}`} className="flex items-center gap-3.5 rounded-lg bg-primario p-4 text-superficie movil-m:p-5">
        <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
          <Icono nombre="local_shipping" className="icono-l" />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="texto-titulo-tarjeta">Pedido #{p.numero}</span>
          <span className="texto-etiqueta text-sobre-oscuro-secundario">
            {producto?.nombre} · {textoEntrega(p).replace(/^Llega /, "llega ")}
          </span>
        </span>
      </Link>
      <Pasos paso={paso + 1} total={4} nombre={PASOS_PEDIDO[paso].nombre} />
      <div className="flex flex-col gap-3">
        {PASOS_PEDIDO.map((s, i) => {
          const hecho = i <= paso
          return (
            <div key={s.estado} className={cn("flex items-center gap-3.5 rounded-md bg-superficie p-3.5", !hecho && "border border-borde-fuerte")}>
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-sm", hecho ? "bg-exito-suave text-exito" : "bg-acento-suave text-primario")}>
                <Icono nombre={s.icono} className="icono-m" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="texto-cuerpo-fuerte text-texto">{s.nombre}</span>
                <span className="texto-etiqueta text-texto-secundario">
                  {!hecho ? "Pendiente" : i === 0 && hora ? `${p.fecha.startsWith(hoy()) ? "Hoy" : sinAnio(p.fecha.slice(0, 10))}, ${hora12(hora)}` : p.fecha.startsWith(hoy()) ? "Hoy" : sinAnio(p.fecha.slice(0, 10))}
                </span>
              </span>
              {hecho && <Icono nombre="check" className="icono-m text-exito" />}
            </div>
          )
        })}
      </div>
    </>
  )
}

/** N15 · Detalle del pedido (/tienda/pedido?id=…). */
export function DetallePedido(datos: PropsTienda) {
  const volver = useVolver("/tienda/pedidos")
  const id = useSearchParams().get("id")
  const p = useTienda(datos).pedidos.find((x) => x.id === id)

  if (!p) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Pedido" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos el pedido" />
      </main>
    )
  }

  const ayuda = `/ajustes/escribenos?tema=pedido&pedido=${p.numero}`
  const rechazado = p.estado_pago === "rechazado"
  const estado = rechazado ? "Pago rechazado" : p.estado_entrega ? PASOS_PEDIDO[pasoPedido(p.estado_entrega)].nombre : "Pagado"

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado
        titulo={`Pedido #${p.numero}`}
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIconoEnlace href={ayuda} icono="help" etiqueta="Ayuda con el pedido" />}
      />
      <section className="flex flex-col gap-1 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4 movil-m:px-5">
        <span className={cn("texto-micro", rechazado ? "text-error" : "text-primario")}>{estado}</span>
        <span className="texto-titulo-seccion font-semibold text-texto">
          {rechazado ? "No se hizo ningún cobro" : p.ventana_entrega ? textoEntrega(p) : "Las vacunas se aplican en la veterinaria"}
        </span>
      </section>
      <Lineas p={p} datos={datos} />
      <Totales etiqueta="Productos" subtotal={Number(p.subtotal)} envio={Number(p.envio)} vacunas={false} />
      <BarraAccion>
        {p.estado_entrega && p.estado_entrega !== "entregado" && !rechazado ? (
          <BotonEnlace href="/tienda/pedidos" className="px-2 texto-cuerpo-fuerte">
            Seguir el pedido
          </BotonEnlace>
        ) : (
          <BotonEnlace href="/tienda" className="px-2 texto-cuerpo-fuerte">
            Volver a la tienda
          </BotonEnlace>
        )}
        <BotonEnlace href={ayuda} variante="secundario" className="px-2 texto-cuerpo-fuerte">
          Necesito ayuda
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}
