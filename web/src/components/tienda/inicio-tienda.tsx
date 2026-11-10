"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

import { Icono } from "@/components/icono"
import { agregarAlimento, BotonCarrito, SeccionesTienda, TarjetaProducto, useRecomendados, type PropsTienda } from "@/components/tienda/comun"
import { textoEntrega } from "@/components/tienda/pedidos"
import type { Producto } from "@/lib/datos"
import { hoy, sumarDias } from "@/lib/fecha"
import { useTienda } from "@/lib/usar-tienda"

/**
 * N1 · Tienda: la portada antes de las tres secciones. Cada casilla muestra un dato
 * de su sección para la mascota activa; debajo, el pedido en curso y lo recomendado.
 * Buscar se hace dentro de Alimentos o Vacunas.
 */
export function InicioTienda(datos: PropsTienda) {
  const router = useRouter()
  const { carrito, cuenta, pedidos } = useTienda(datos)
  const { mascota, restantes, alimento, vacuna, alertas } = useRecomendados(datos)

  // Sin plan ni vacunas próximas: los más vendidos (spec de N).
  const masVendidos = !alimento && !vacuna ? datos.productos.filter((p) => p.tipo === "alimento" && p.especie.includes(mascota.especie)).slice(0, 2) : []
  const enCurso = pedidos.filter((p) => p.estado_pago === "aprobado" && p.estado_entrega && p.estado_entrega !== "entregado")
  const pronto = alertas.filter(
    (a) => a.grupo !== "resuelta" && (a.tipo === "refuerzo_vacuna" || a.tipo === "proxima_desparasitacion") && a.fecha_vencimiento <= sumarDias(hoy(), 45),
  ).length
  const agregar = (p: Producto) => agregarAlimento(p, 1, carrito.find((i) => i.producto_id === p.id)?.cantidad)

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-12">
      <header className="flex items-start gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h1 className="texto-titulo-pantalla text-texto">Tienda</h1>
          <p className="texto-cuerpo text-texto-secundario">Alimento y vacunas para tus mascotas, sin salir de la app.</p>
        </div>
        {cuenta > 0 && <BotonCarrito cuenta={cuenta} />}
      </header>

      <SeccionesTienda
        detalles={{
          // Cuánto le queda del alimento del plan a la mascota activa (H1).
          alimentos: restantes === null ? `Para ${mascota.nombre}` : restantes === 0 ? "Se acaba hoy" : `Quedan ${restantes} ${restantes === 1 ? "día" : "días"}`,
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
    </div>
  )
}
