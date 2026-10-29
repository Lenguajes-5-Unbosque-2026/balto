"use client"

import Link from "next/link"
import { useState } from "react"

import { Busqueda } from "@/components/busqueda"
import { Chip } from "@/components/chip"
import { EventoLinea, LineaMes } from "@/components/consulta/evento-linea"
import { HojaFiltros } from "@/components/consulta/hoja-filtros"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { TarjetaEvento } from "@/components/tarjeta-evento"
import { CATEGORIAS, coincide, enCategoria, pesoAnterior, type Evento } from "@/lib/eventos"
import { fechaNumerica, mesAnio } from "@/lib/fecha"
import { useFiltrosLinea, type Filtros } from "@/lib/filtros-linea"
import { useMascotaActiva } from "@/lib/mascota-activa"
import type { PerfilMascota } from "@/lib/perfil"
import { useEventos } from "@/lib/usar-eventos"

/** "2026" si el rango es un año completo; si no, las dos fechas. */
function textoRango({ desde, hasta }: Filtros) {
  if (desde && hasta && desde.slice(0, 4) === hasta.slice(0, 4) && desde.endsWith("-01-01") && hasta.endsWith("-12-31")) {
    return desde.slice(0, 4)
  }
  if (desde && hasta) return `${fechaNumerica(desde)} – ${fechaNumerica(hasta)}`
  return desde ? `Desde ${fechaNumerica(desde)}` : `Hasta ${fechaNumerica(hasta)}`
}

/** D2 · Línea de tiempo, con búsqueda (D9, D10), filtros (D3) y el estado vacío (D8). */
export function LineaDeTiempo({ mascotas, eventos: base }: { mascotas: PerfilMascota[]; eventos: Evento[] }) {
  const [mascota] = useMascotaActiva(mascotas)
  const [filtros, cambiarFiltros] = useFiltrosLinea()
  const [hojaAbierta, setHojaAbierta] = useState(false)
  const todos = useEventos(base).filter((e) => e.mascota_id === mascota.id)

  const { busqueda, categorias, desde, hasta } = filtros
  const conFechas = Boolean(desde || hasta)
  const conFiltros = categorias.length > 0 || conFechas
  // Con un solo tipo y sin fechas bastan los chips de atajo; si no, se muestran los filtros aplicados.
  const filtrosAvanzados = categorias.length > 1 || conFechas

  const visibles = todos.filter(
    (e) =>
      (categorias.length === 0 || categorias.some((c) => enCategoria(e.tipo, c))) &&
      (!desde || e.fecha >= desde) &&
      (!hasta || e.fecha <= hasta) &&
      coincide(e, busqueda),
  )

  const meses: { nombre: string; eventos: Evento[] }[] = []
  for (const e of visibles) {
    const nombre = mesAnio(e.fecha)
    if (meses.at(-1)?.nombre === nombre) meses.at(-1)!.eventos.push(e)
    else meses.push({ nombre, eventos: [e] })
  }

  return (
    <div className="flex flex-col gap-5 px-6 pt-14">
      <h1 className="grid h-11 place-items-center texto-titulo-seccion text-texto">Línea de tiempo</h1>

      <Busqueda
        valor={busqueda}
        onCambio={(v) => cambiarFiltros({ busqueda: v })}
        placeholder={`Buscar en el historial de ${mascota.nombre}`}
        onFiltros={() => setHojaAbierta(true)}
        filtrosActivos={conFiltros}
      />

      {todos.length === 0 ? (
        <SinEventos nombre={mascota.nombre} />
      ) : (
        <>
          <nav aria-label="Filtros" className="sin-barra-desplazamiento -mx-6 -mt-1 overflow-x-auto px-6">
            <div className="flex w-max gap-2">
              {filtrosAvanzados ? (
                <>
                  {CATEGORIAS.filter((c) => categorias.includes(c.slug)).map((c) => (
                    <Chip
                      key={c.slug}
                      texto={c.nombre}
                      icono={c.icono}
                      activo
                      aria-label={`Quitar filtro ${c.nombre}`}
                      onClick={() => cambiarFiltros({ categorias: categorias.filter((x) => x !== c.slug) })}
                    />
                  ))}
                  {conFechas && (
                    <Chip
                      texto={textoRango(filtros)}
                      icono="calendar_today"
                      activo
                      aria-label="Quitar filtro de fechas"
                      onClick={() => cambiarFiltros({ desde: "", hasta: "" })}
                    />
                  )}
                </>
              ) : (
                <>
                  <Chip
                    texto="Todos"
                    icono={busqueda ? "apps" : undefined}
                    activo={categorias.length === 0}
                    onClick={() => cambiarFiltros({ categorias: [] })}
                  />
                  {CATEGORIAS.map((c) => (
                    <Chip
                      key={c.slug}
                      texto={c.nombre}
                      icono={c.icono}
                      activo={categorias[0] === c.slug}
                      onClick={() => cambiarFiltros({ categorias: [c.slug] })}
                    />
                  ))}
                </>
              )}
            </div>
          </nav>

          {visibles.length === 0 ? (
            <div className="flex flex-col items-center gap-3.5 pt-4">
              <Estado
                tono="error"
                icono="search_off"
                titulo="Sin resultados"
                mensaje={
                  busqueda && conFiltros
                    ? "No encontramos nada con esa palabra y esos filtros."
                    : busqueda
                      ? "No encontramos nada con esa palabra."
                      : "No hay eventos con esos filtros."
                }
              />
              {conFiltros && (
                <button
                  type="button"
                  onClick={() => cambiarFiltros({ categorias: [], desde: "", hasta: "" })}
                  className="texto-etiqueta-fuerte text-primario"
                >
                  Quitar los filtros
                </button>
              )}
            </div>
          ) : busqueda ? (
            <section className="flex flex-col gap-3">
              <p className="texto-etiqueta text-texto-secundario">
                {visibles.length === 1 ? "1 resultado" : `${visibles.length} resultados`} para &quot;{busqueda.trim()}&quot;
              </p>
              <ul className="flex flex-col gap-3">
                {visibles.map((e) => (
                  <li key={e.id}>
                    <TarjetaEvento evento={e} anterior={pesoAnterior(e, todos)} href={`/evento?id=${e.id}`} />
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            meses.map((m) => (
              <section key={m.nombre} className="flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <h2 className="texto-titulo-seccion text-texto">{m.nombre}</h2>
                  <span className="texto-micro text-texto-secundario">
                    {m.eventos.length === 1 ? "1 evento" : `${m.eventos.length} eventos`}
                  </span>
                </div>
                <LineaMes cantidad={m.eventos.length}>
                  {m.eventos.map((e) => (
                    <EventoLinea key={e.id} evento={e} anterior={pesoAnterior(e, todos)} reciente={e.id === visibles[0].id} />
                  ))}
                </LineaMes>
              </section>
            ))
          )}
        </>
      )}

      <HojaFiltros
        abierta={hojaAbierta}
        onCerrar={() => setHojaAbierta(false)}
        filtros={filtros}
        onAplicar={(cambios) => {
          cambiarFiltros(cambios)
          setHojaAbierta(false)
        }}
      />
    </div>
  )
}

/** D8 · Línea de tiempo vacía. */
function SinEventos({ nombre }: { nombre: string }) {
  return (
    <div className="flex flex-col gap-5 pt-2">
      <Estado
        icono="history"
        titulo="Aún no hay eventos"
        mensaje={`Registra la primera vacuna, consulta o peso de ${nombre} y aparecerá aquí.`}
      />
      {/* La carga de documentos (C1) llega con el flujo C; mientras tanto se registran desde E. */}
      <Link href="/registrar" className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
          <Icono nombre="upload_file" className="icono-m" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="texto-cuerpo-fuerte text-texto">Subir documentos que ya tengas</span>
          <span className="texto-etiqueta text-texto-secundario">Carnet, exámenes o fórmulas</span>
        </span>
        <Icono nombre="chevron_right" className="icono-m text-texto-secundario" />
      </Link>
    </div>
  )
}
