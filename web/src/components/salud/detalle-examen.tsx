"use client"

import { useSearchParams } from "next/navigation"
import { useState, type ReactNode } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { VisorSoporte } from "@/components/consulta/visor-soporte"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Rasgo } from "@/components/rasgo"
import { textoTamano } from "@/components/registro/bloque-soporte"
import type { Evento, Soporte } from "@/lib/eventos"
import { fechaCorta, mesesEntre } from "@/lib/fecha"
import { useEventos } from "@/lib/usar-eventos"
import { useVolver } from "@/lib/usar-salud"

/** F7 · Detalle de examen (/salud/examen?id=e04). */
export function DetalleExamen({ eventos: base }: { eventos: Evento[] }) {
  const volver = useVolver("/salud/examenes")
  const id = useSearchParams().get("id") ?? ""
  const examen = useEventos(base).find((e) => e.id === id && e.tipo === "examen")
  const [viendo, setViendo] = useState<Soporte | null>(null)

  const encabezado = (derecha?: ReactNode) => (
    <Encabezado titulo="Examen" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} derecha={derecha} />
  )

  if (!examen) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        {encabezado()}
        <Estado icono="search_off" titulo="No encontramos el examen" mensaje="Puede que se haya eliminado." />
      </main>
    )
  }

  const alterado = examen.resultado === "alterado"
  const soportes = examen.soportes ?? []
  const meses = examen.proximo_control ? mesesEntre(examen.fecha, examen.proximo_control) : 0
  const compartir = `/compartir?contenido=examen&evento=${examen.id}`

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {encabezado(<BotonIconoEnlace href={compartir} icono="ios_share" etiqueta="Compartir examen" />)}

      <section className="flex flex-col gap-4 rounded-lg border border-borde-fuerte bg-superficie p-4 movil-m:p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="science" className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="texto-titulo-tarjeta break-words text-texto">{examen.tipo_examen}</h2>
            <span className="truncate texto-etiqueta text-texto-secundario">
              {[fechaCorta(examen.fecha), examen.laboratorio].filter(Boolean).join(" · ")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Rasgo icono={alterado ? "error" : "check_circle"} texto={alterado ? "Alterado" : "Normal"} alerta={alterado} exito={!alterado} />
          {soportes.length > 0 && <Rasgo icono="description" texto={soportes[0].tipo === "pdf" ? "PDF" : "Foto"} />}
          {meses > 0 && <Rasgo icono="event_repeat" texto={meses === 12 ? "Anual" : meses === 6 ? "Semestral" : `${meses} meses`} />}
        </div>
      </section>

      <dl className="flex flex-col gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4 movil-m:px-5">
        <Fila etiqueta="Solicitado por" valor={examen.solicitado_por || "—"} />
        <Fila etiqueta="Resultado" valor={alterado ? "Alterado" : "Dentro de rangos"} />
        <Fila etiqueta="Próximo control" valor={examen.proximo_control ? fechaCorta(examen.proximo_control) : "Sin control"} />
      </dl>

      {soportes.map((s, i) => (
        <button
          key={`${s.nombre}-${i}`}
          type="button"
          onClick={() => setViendo(s)}
          className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5 text-left"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="description" className="icono-m" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate texto-cuerpo-fuerte text-texto">{s.nombre}</span>
            <span className="texto-etiqueta text-texto-secundario">
              {s.tipo === "pdf" ? "PDF" : "Foto"} · {textoTamano(s.tamanoKb)}
            </span>
          </span>
          <Icono nombre="visibility" className="icono-m text-texto-secundario" />
        </button>
      ))}

      {examen.resultado_principal && (
        <div className="flex flex-col gap-2">
          <span className="texto-etiqueta-fuerte text-texto">Resultado principal</span>
          <p className="min-h-22 rounded-md border border-borde bg-superficie px-4 py-3.5 texto-cuerpo text-texto-secundario">
            {examen.resultado_principal}
          </p>
        </div>
      )}

      <BarraAccion>
        <BotonEnlace href={compartir}>Compartir</BotonEnlace>
        <BotonEnlace href={`/evento/editar?id=${examen.id}`} variante="secundario">
          Editar
        </BotonEnlace>
      </BarraAccion>

      {viendo && <VisorSoporte soporte={viendo} onCerrar={() => setViendo(null)} />}
    </main>
  )
}

function Fila({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="shrink-0 texto-cuerpo text-texto-secundario">{etiqueta}</dt>
      <dd className="min-w-0 truncate text-right texto-etiqueta-fuerte text-texto">{valor}</dd>
    </div>
  )
}
