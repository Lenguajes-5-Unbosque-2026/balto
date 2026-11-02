"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { BotonEnlace } from "@/components/boton"
import { Busqueda } from "@/components/busqueda"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { agregarAlimento, BotonCarrito, SeccionesTienda, TarjetaProducto, useRecomendados, type PropsTienda } from "@/components/tienda/comun"
import { textoEntrega } from "@/components/tienda/pedidos"
import type { Producto } from "@/lib/datos"
import { normalizar } from "@/lib/eventos"
import { HOY, sumarDias } from "@/lib/fecha"
import { useMascotas } from "@/lib/mascota-activa"
import { paraEspecie } from "@/lib/tienda"
import { useTienda } from "@/lib/usar-tienda"

/**
 * N1 · Tienda: la portada antes de las tres secciones. Muestra un resumen de cada
 * una (casillas), el pedido en curso, lo recomendado para la mascota activa y una
 * búsqueda en todo el catálogo (alimentos y vacunas) con los resultados aquí mismo.
 */
export function InicioTienda(datos: PropsTienda) {
  const router = useRouter()
  const { carrito, cuenta, pedidos } = useTienda(datos)
  const { mascota, alimento, vacuna, alertas } = useRecomendados(datos)
  const mascotas = useMascotas(datos.mascotas)
  const [busqueda, setBusqueda] = useState("")

  // Sin plan ni vacunas próximas: los más vendidos (spec de N).
  const masVendidos = !alimento && !vacuna ? datos.productos.filter((p) => p.tipo === "alimento" && p.especie.includes(mascota.especie)).slice(0, 2) : []
  const enCurso = pedidos.filter((p) => p.estado_pago === "aprobado" && p.estado_entrega && p.estado_entrega !== "entregado")
  const pronto = alertas.filter(
    (a) => a.grupo !== "resuelta" && (a.tipo === "refuerzo_vacuna" || a.tipo === "proxima_desparasitacion") && a.fecha_vencimiento <= sumarDias(HOY, 45),
  ).length
  const alimentos = datos.productos.filter((p) => p.tipo === "alimento").length

  const q = normalizar(busqueda)
  const resultados = q
    ? datos.productos.filter((p) => q.split(/\s+/).every((palabra) => normalizar(`${p.nombre} ${p.descripcion} ${p.tipo} ${p.especie}`).includes(palabra)))
    : []

  /** Las vacunas se abren para una mascota de su especie (la activa si sirve). */
  const hrefDe = (p: Producto) => {
    if (p.tipo === "alimento") return `/tienda/producto?id=${p.id}`
    const m = paraEspecie(p, mascota.especie) ? mascota : (mascotas.find((x) => paraEspecie(p, x.especie)) ?? mascota)
    return `/tienda/vacuna?id=${p.id}&mascota=${m.id}`
  }
  const agregar = (p: Producto) =>
    p.tipo === "alimento" ? agregarAlimento(p, 1, carrito.find((i) => i.producto_id === p.id)?.cantidad) : router.push(hrefDe(p))

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-12">
      <header className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="texto-titulo-pantalla text-texto">Tienda</h1>
          <p className="texto-cuerpo text-texto-secundario">Alimento y vacunas para tus mascotas, sin salir de la app.</p>
        </div>
        {cuenta > 0 && <BotonCarrito cuenta={cuenta} />}
      </header>
      <Busqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar alimento o vacuna" />

      {q ? (
        resultados.length ? (
          <>
            <h2 className="texto-titulo-seccion font-semibold text-texto">
              {resultados.length} {resultados.length === 1 ? "resultado" : "resultados"}
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {resultados.map((p) => (
                <TarjetaProducto key={p.id} producto={p} detalle={p.tipo === "alimento" ? undefined : "Aplicación incluida"} href={hrefDe(p)} onAgregar={() => agregar(p)} />
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-4 pt-4">
            <Estado tono="error" icono="search_off" titulo="No encontramos eso" mensaje="Prueba con otro nombre o pídenos el producto." />
            <BotonEnlace href={`/ajustes/escribenos?tema=producto&q=${encodeURIComponent(busqueda)}`} variante="secundario">
              Pedir un producto
            </BotonEnlace>
          </div>
        )
      ) : (
        <>
          <SeccionesTienda
            detalles={{
              alimentos: `${alimentos} productos`,
              vacunas: pronto ? `${pronto} ${pronto === 1 ? "le toca" : "les tocan"} pronto` : "Con aplicación",
              pedidos: enCurso.length ? `${enCurso.length} en curso` : "Sin pedidos en curso",
            }}
          />

          {enCurso[0] && (
            <Link href={`/tienda/pedido?id=${enCurso[0].id}`} className="flex items-center gap-3.5 rounded-lg bg-primario p-4 text-superficie">
              <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
                <Icono nombre="local_shipping" className="icono-m" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="texto-micro text-sobre-oscuro-secundario">Pedido #{enCurso[0].numero} en curso</span>
                <span className="truncate texto-cuerpo-fuerte">{textoEntrega(enCurso[0])}</span>
              </span>
              <Icono nombre="chevron_right" className="shrink-0 icono-m" />
            </Link>
          )}

          <h2 className="mt-1 texto-titulo-seccion font-semibold text-texto">{masVendidos.length ? "Los más vendidos" : `Recomendado para ${mascota.nombre}`}</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {alimento && (
              <TarjetaProducto
                producto={alimento.producto}
                rotulo={alimento.rotulo}
                detalle={`${alimento.producto.presentacion} · según su plan`}
                href={`/tienda/producto?id=${alimento.producto.id}`}
                onAgregar={() => agregar(alimento.producto)}
              />
            )}
            {vacuna && (
              <TarjetaProducto
                producto={{ ...vacuna.producto, nombre: vacuna.producto.tipo === "vacuna" ? `Vacuna ${vacuna.producto.nombre.toLowerCase()}` : vacuna.producto.nombre }}
                rotulo={vacuna.rotulo}
                detalle="Aplicación incluida"
                href={`/tienda/vacuna?id=${vacuna.producto.id}&mascota=${mascota.id}&alerta=${vacuna.alerta.id}`}
                onAgregar={() => router.push(`/tienda/vacuna?id=${vacuna.producto.id}&mascota=${mascota.id}&alerta=${vacuna.alerta.id}`)}
              />
            )}
            {masVendidos.map((p) => (
              <TarjetaProducto key={p.id} producto={p} href={`/tienda/producto?id=${p.id}`} onAgregar={() => agregar(p)} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
