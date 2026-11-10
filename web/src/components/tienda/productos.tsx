"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Busqueda } from "@/components/busqueda"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionRadio } from "@/components/opcion-radio"
import { Rasgo } from "@/components/rasgo"
import { agregarAlimento, BotonCarrito, EncabezadoTienda, productoParaAlerta, TarjetaProducto, useRecomendados, type PropsTienda } from "@/components/tienda/comun"
import { frecuenciaAlerta } from "@/lib/alertas"
import { normalizar } from "@/lib/eventos"
import { fechaCorta, fechaLarga, hoy, sumarDias } from "@/lib/fecha"
import { useMascotas } from "@/lib/mascota-activa"
import { cuposDel, distanciaKm, proximosConCupo, puntoDe, textoKm } from "@/lib/proveedores"
import { agotado, iconoProducto, paraEspecie, precio, productoDeVacuna } from "@/lib/tienda"
import { puntoReferencia, useUbicacion } from "@/lib/usar-proveedores"
import { agregarAlCarrito, claveItem, useTienda } from "@/lib/usar-tienda"
import { useVolver } from "@/lib/usar-salud"

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/** Botones − cantidad + (N3, N6). */
export function Cantidad({ valor, onCambio, min = 1 }: { valor: number; onCambio: (n: number) => void; min?: number }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Uno menos"
        disabled={valor <= min}
        onClick={() => onCambio(valor - 1)}
        className="grid size-11 place-items-center rounded-completo bg-acento text-primario disabled:opacity-50"
      >
        <Icono nombre="remove" className="icono-m" />
      </button>
      <span className="w-5 text-center texto-titulo-seccion font-semibold text-texto">{valor}</span>
      <button type="button" aria-label="Uno más" onClick={() => onCambio(valor + 1)} className="grid size-11 place-items-center rounded-completo bg-primario text-superficie">
        <Icono nombre="add" className="icono-m" />
      </button>
    </div>
  )
}

/** N3 · Detalle de alimento (/tienda/producto?id=pr01). */
export function DetalleAlimento(datos: PropsTienda) {
  const router = useRouter()
  const volver = useVolver("/tienda/alimentos")
  const id = useSearchParams().get("id")
  const p = datos.productos.find((x) => x.id === id)
  const { carrito, cuenta } = useTienda(datos)
  const { mascota, plan, alimento } = useRecomendados(datos)
  const [cantidad, setCantidad] = useState(1)

  if (!p) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Detalle" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos el producto" />
      </main>
    )
  }

  const kg = Number.parseFloat(p.presentacion) || 0
  const delPlan = alimento?.producto.id === p.id && plan?.gramos_dia
  const sinStock = agotado(p)

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Detalle" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} derecha={<BotonCarrito cuenta={cuenta} />} />
      <div className="flex h-44 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primario bg-acento-suave text-texto-secundario">
        <Icono nombre={iconoProducto(p)} className="icono-xl text-primario" />
        <span className="texto-etiqueta">Foto del producto</span>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="texto-titulo-pantalla text-texto">{p.nombre}</h1>
        <span className="texto-cuerpo text-texto-secundario">
          {p.descripcion} · {p.presentacion}
        </span>
        <span className="texto-titulo-tarjeta text-texto">{precio(p.precio_cop)}</span>
      </div>
      {sinStock ? (
        <Nota tono="error" icono="inventory_2">
          Agotado por ahora. Vuelve pronto.
        </Nota>
      ) : delPlan ? (
        <Nota tono="exito" icono="check_circle">
          Coincide con el plan de {mascota.nombre}: con {plan!.gramos_dia} g al día le dura unos {Math.floor((kg * 1000) / plan!.gramos_dia)} días.
        </Nota>
      ) : (
        !paraEspecie(p, mascota.especie) && <Nota icono="info">Este alimento es para {p.especie.replace(";", " y ")}s.</Nota>
      )}
      <div className="flex items-center justify-between">
        <span className="texto-cuerpo-fuerte text-texto">Cantidad</span>
        <Cantidad valor={cantidad} onCambio={setCantidad} />
      </div>
      <BarraAccion>
        <Boton
          disabled={sinStock}
          onClick={() => {
            agregarAlimento(p, cantidad, carrito.find((i) => i.producto_id === p.id)?.cantidad)
            router.push("/tienda/carrito")
          }}
        >
          Agregar · {precio(Number(p.precio_cop) * cantidad)}
          <Icono nombre="add_shopping_cart" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** N4 · Vacunas: las que les tocan pronto a las mascotas y las demás que sirven para su especie. */
export function Vacunas(datos: PropsTienda) {
  const router = useRouter()
  const { cuenta } = useTienda(datos)
  const { alertas } = useRecomendados(datos)
  const mascotas = useMascotas(datos.mascotas)
  const [busqueda, setBusqueda] = useState("")

  const pronto = alertas
    .filter((a) => a.grupo !== "resuelta" && (a.tipo === "refuerzo_vacuna" || a.tipo === "proxima_desparasitacion") && a.grupo !== "adelante")
    .concat(
      alertas.filter(
        (a) => a.grupo === "adelante" && (a.tipo === "refuerzo_vacuna" || a.tipo === "proxima_desparasitacion") && a.fecha_vencimiento <= sumarDias(hoy(), 45),
      ),
    )
    .sort((a, b) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento))
    .flatMap((a) => {
      const m = mascotas.find((x) => x.id === a.mascota_id)
      const r = m && productoParaAlerta(datos.productos, a, m.especie)
      return r && m ? [{ ...r, mascota: m }] : []
    })
  const enPronto = new Set(pronto.map((x) => `${x.producto.id}-${x.mascota.id}`))

  const otras = datos.productos
    .filter((p) => p.tipo === "vacuna")
    .flatMap((p) => {
      const m = mascotas.find((x) => paraEspecie(p, x.especie) && !enPronto.has(`${p.id}-${x.id}`))
      if (!m) return []
      const refuerzo = alertas.find(
        (a) => a.mascota_id === m.id && a.tipo === "refuerzo_vacuna" && a.grupo !== "resuelta" && a.evento && productoDeVacuna(datos.productos, a.evento.vacuna ?? "", m.especie)?.id === p.id,
      )
      return [{ producto: p, mascota: m, detalle: refuerzo ? `Refuerzo de ${m.nombre} en ${sinAnio(refuerzo.fecha_vencimiento).split(" ")[1]} ${refuerzo.fecha_vencimiento.slice(0, 4)}` : `Para ${m.nombre}` }]
    })

  const q = normalizar(busqueda)
  const coincide = (nombre: string, mascota: string) => !q || q.split(/\s+/).every((palabra) => normalizar(`${nombre} ${mascota}`).includes(palabra))
  const prontoVisibles = pronto.filter((x) => coincide(x.producto.nombre, x.mascota.nombre))
  const otrasVisibles = otras.filter((x) => coincide(x.producto.nombre, x.mascota.nombre))

  return (
    <div className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <EncabezadoTienda actual="vacunas" cuenta={cuenta} />
      <Busqueda valor={busqueda} onCambio={setBusqueda} placeholder="Buscar vacuna o mascota" />
      <Nota>Las vacunas se compran con la aplicación incluida en una veterinaria aliada.</Nota>
      {prontoVisibles.length > 0 && (
        <>
          <h2 className="mt-1 texto-titulo-seccion font-semibold text-texto">Le tocan pronto</h2>
          <div className="grid grid-cols-2 gap-2.5">
            {prontoVisibles.map((x) => {
              const href = `/tienda/vacuna?id=${x.producto.id}&mascota=${x.mascota.id}&alerta=${x.alerta.id}`
              return (
                <TarjetaProducto
                  key={x.alerta.id}
                  producto={{ ...x.producto, nombre: `${x.producto.nombre} · ${x.mascota.nombre}` }}
                  rotulo={x.rotulo}
                  detalle="Aplicación incluida"
                  href={href}
                  onAgregar={() => router.push(href)}
                />
              )
            })}
          </div>
        </>
      )}
      {prontoVisibles.length === 0 && otrasVisibles.length === 0 && (
        <div className="pt-4">
          <Estado tono="error" icono="search_off" titulo="No encontramos esa vacuna" mensaje="Prueba con otro nombre." />
        </div>
      )}
      {otrasVisibles.length > 0 && <h2 className="mt-1 texto-titulo-seccion font-semibold text-texto">Otras vacunas</h2>}
      <div className="grid grid-cols-2 gap-2.5">
        {otrasVisibles.map((x) => {
          const href = `/tienda/vacuna?id=${x.producto.id}&mascota=${x.mascota.id}`
          return <TarjetaProducto key={x.producto.id} producto={x.producto} detalle={x.detalle} href={href} onAgregar={() => router.push(href)} />
        })}
      </div>
    </div>
  )
}

/** N5 · Detalle de vacuna y aplicación: veterinaria aliada y primer cupo (/tienda/vacuna?id=pr07&mascota=m01&alerta=a02). */
export function DetalleVacuna(datos: PropsTienda) {
  const router = useRouter()
  const volver = useVolver("/tienda/vacunas")
  const q = useSearchParams()
  const { cuenta } = useTienda(datos)
  const { alertas } = useRecomendados(datos)
  const mascotas = useMascotas(datos.mascotas)
  const mascota = mascotas.find((m) => m.id === q.get("mascota")) ?? mascotas[0]
  const alerta = alertas.find((a) => a.id === q.get("alerta"))
  // Desde "Comprar la vacuna" (J2, J4) llega solo la alerta: el producto sale de ella.
  const p = datos.productos.find((x) => x.id === q.get("id")) ?? (alerta && productoParaAlerta(datos.productos, alerta, mascota.especie)?.producto)
  const ref = puntoReferencia(useUbicacion())

  const opciones = datos.proveedores
    .filter((v) => v.aliada === "true" && v.servicios.split(";").includes("vacunacion") && v.agenda_en_linea === "true")
    .map((v) => {
      const dia = cuposDel(v, sumarDias(hoy(), 1)).length ? sumarDias(hoy(), 1) : proximosConCupo(v, hoy(), 1)[0]
      return { v, km: distanciaKm(ref, puntoDe(v)), dia, hora: dia ? cuposDel(v, dia)[0] : "" }
    })
    .filter((o) => o.dia)
    .sort((a, b) => a.km - b.km)
    .slice(0, 3)
  const [elegida, setElegida] = useState(0)

  if (!p) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Vacuna" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos la vacuna" />
      </main>
    )
  }

  const opcion = opciones[elegida]
  const cuando = (dia: string, hora: string) => `${fechaLarga(dia).slice(0, 3).toLowerCase()} ${Number(dia.slice(8))}, ${hora}`

  function agregar() {
    agregarAlCarrito({
      clave: claveItem(p!.id, mascota.id),
      producto_id: p!.id,
      cantidad: 1,
      mascota_id: mascota.id,
      proveedor_id: opcion.v.id,
      fecha_hora: `${opcion.dia} ${opcion.hora}`,
    })
    toast.success("Agregado al carrito", { description: `${p!.nombre} para ${mascota.nombre}` })
    router.push("/tienda/carrito")
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Vacuna" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} derecha={<BotonCarrito cuenta={cuenta} />} />
      <section className="flex flex-col gap-4 rounded-lg bg-oscuro p-4 movil-m:p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-acento-suave text-oscuro">
            <Icono nombre={iconoProducto(p)} className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h1 className="texto-titulo-tarjeta text-superficie">{p.nombre}</h1>
            <span className="texto-etiqueta text-sobre-oscuro-secundario">Para {mascota.nombre} · incluye la aplicación</span>
          </div>
        </div>
        <div className="flex gap-2">
          {alerta && <Rasgo icono="event" texto={sinAnio(alerta.fecha_vencimiento)} />}
          {alerta && frecuenciaAlerta(alerta) && <Rasgo icono="history" texto={frecuenciaAlerta(alerta)} />}
          <Rasgo icono="local_hospital" texto="Aliada" />
          <Rasgo icono="payments" texto={precio(p.precio_cop)} />
        </div>
      </section>

      <span className="texto-micro text-texto-secundario">Elige dónde y cuándo aplicarla</span>
      {opciones.length === 0 ? (
        <Nota tono="error" icono="event_busy">
          No hay horarios esta semana en las veterinarias aliadas.
        </Nota>
      ) : (
        <div role="radiogroup" className="flex flex-col gap-3">
          {opciones.map((o, i) => (
            <OpcionRadio key={o.v.id} icono="local_hospital" titulo={o.v.nombre} detalle={`${textoKm(o.km)} · ${cuando(o.dia, o.hora)}`} activa={elegida === i} onElegir={() => setElegida(i)} />
          ))}
        </div>
      )}
      <Nota icono="sync">Cuando confirmes la aplicación, queda registrada en la línea de tiempo de {mascota.nombre}.</Nota>
      <BarraAccion>
        <Boton disabled={!opcion} onClick={agregar}>
          Agregar · {precio(p.precio_cop)}
          <Icono nombre="add_shopping_cart" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
