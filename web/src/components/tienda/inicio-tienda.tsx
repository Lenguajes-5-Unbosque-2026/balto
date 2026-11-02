"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { Busqueda } from "@/components/busqueda"
import { Icono } from "@/components/icono"
import { BotonEnlace } from "@/components/boton"
import { agregarAlimento, BotonCarrito, SeccionesTienda, TarjetaProducto, useRecomendados, type PropsTienda } from "@/components/tienda/comun"
import { useTienda } from "@/lib/usar-tienda"

/** N1 · Tienda: búsqueda, categorías y lo recomendado para la mascota activa. */
export function InicioTienda(datos: PropsTienda) {
  const router = useRouter()
  const { carrito, cuenta } = useTienda(datos)
  const { mascota, alimento, vacuna } = useRecomendados(datos)
  const [busqueda, setBusqueda] = useState("")
  // Sin plan ni vacunas próximas: los más vendidos (spec de N).
  const masVendidos = !alimento && !vacuna ? datos.productos.filter((p) => p.tipo === "alimento" && p.especie.includes(mascota.especie)).slice(0, 2) : []

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-12">
      <header className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="texto-titulo-pantalla text-texto">Tienda</h1>
          <p className="texto-cuerpo text-texto-secundario">Alimento y vacunas para tus mascotas, sin salir de la app.</p>
        </div>
        {cuenta > 0 && <BotonCarrito cuenta={cuenta} />}
      </header>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (busqueda.trim()) router.push(`/tienda/alimentos?q=${encodeURIComponent(busqueda.trim())}`)
        }}
      >
        <Busqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar alimento o vacuna" />
      </form>

      <SeccionesTienda actual="alimentos" />

      <BotonEnlace href="/tienda/alimentos?todo=1">
        Ver todos los alimentos
        <Icono nombre="arrow_forward" className="icono-m" />
      </BotonEnlace>

      <h2 className="mt-1 texto-titulo-seccion font-semibold text-texto">{masVendidos.length ? "Los más vendidos" : `Recomendado para ${mascota.nombre}`}</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {alimento && (
          <TarjetaProducto
            producto={alimento.producto}
            rotulo={alimento.rotulo}
            detalle={`${alimento.producto.presentacion} · según su plan`}
            href={`/tienda/producto?id=${alimento.producto.id}`}
            onAgregar={() => agregarAlimento(alimento.producto, 1, carrito.find((i) => i.producto_id === alimento.producto.id)?.cantidad)}
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
          <TarjetaProducto key={p.id} producto={p} href={`/tienda/producto?id=${p.id}`} onAgregar={() => agregarAlimento(p)} />
        ))}
      </div>
    </div>
  )
}
