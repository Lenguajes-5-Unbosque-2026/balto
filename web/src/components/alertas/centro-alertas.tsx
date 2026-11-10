"use client"

import { useState } from "react"

import { useAccionesAlerta } from "@/components/alertas/acciones"
import { HojaCalendario, agregarAlCalendarioDeBalto } from "@/components/alertas/hoja-calendario"
import { HojaFiltrosAlertas, SIN_FILTROS, type FiltrosAlertas } from "@/components/alertas/hoja-filtros-alertas"
import { HojaPosponer } from "@/components/alertas/hoja-posponer"
import { TarjetaAlertaCompacta, TarjetaAlertaGrande, TarjetaAlertaResuelta } from "@/components/alertas/tarjeta-alerta"
import { BotonIcono } from "@/components/boton-icono"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Selector } from "@/components/selector"
import { enCategoriaAlerta, tituloAlertaVista, type AlertaVista } from "@/lib/alertas"
import type { Evento } from "@/lib/eventos"
import { diasEntre, fechaCorta, hoy } from "@/lib/fecha"
import type { Alerta } from "@/lib/perfil"
import { useAlertas, type MascotaAlerta } from "@/lib/usar-alertas"
import { cn } from "@/lib/utils"

type CentroAlertasProps = {
  alertas: Alerta[]
  eventos: Evento[]
  mascotas: MascotaAlerta[]
  marcas: Record<string, string>
}

const porFecha = (a: AlertaVista, b: AlertaVista) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento)

/** J1 · Centro de alertas, con J3 (posponer), J7 (sin pendientes) y J8 (filtros). */
export function CentroAlertas({ alertas: base, eventos, mascotas, marcas }: CentroAlertasProps) {
  const acciones = useAccionesAlerta()
  const todas = useAlertas(base, eventos, mascotas, marcas)
  const [pestana, setPestana] = useState<"proximas" | "resueltas">("proximas")
  const [filtros, setFiltros] = useState<FiltrosAlertas>(SIN_FILTROS)
  const [verFiltros, setVerFiltros] = useState(false)
  const [posponiendo, setPosponiendo] = useState<string | null>(null)
  const [alCalendario, setAlCalendario] = useState<AlertaVista | null>(null)

  const filtradas = todas.filter(
    (a) => (filtros.mascota === "todas" || a.mascota_id === filtros.mascota) && enCategoriaAlerta(a.tipo, filtros.categorias),
  )
  const vencidas = filtradas.filter((a) => a.grupo === "vencida").sort(porFecha)
  const semana = filtradas.filter((a) => a.grupo === "semana").sort(porFecha)
  const adelante = filtradas.filter((a) => a.grupo === "adelante").sort(porFecha)
  const resueltas = filtradas
    .filter((a) => a.grupo === "resuelta")
    .sort((a, b) => (b.fecha_resuelta ?? "").localeCompare(a.fecha_resuelta ?? ""))
  const pendientes = vencidas.length + semana.length
  const conFiltros = filtros.mascota !== "todas" || filtros.categorias.length > 0

  const grandes = [...vencidas, ...semana]

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-12">
      <header className="flex h-12.5 items-center gap-2.5">
        <h1 className="texto-titulo-pantalla text-texto">Alertas</h1>
        {pendientes > 0 && (
          <span className="grid size-7 place-items-center rounded-completo bg-primario texto-etiqueta-fuerte text-superficie">
            {pendientes}
          </span>
        )}
        <BotonIcono icono="tune" etiqueta="Filtrar alertas" punto={conFiltros} className="ml-auto" onClick={() => setVerFiltros(true)} />
      </header>

      <Selector
        etiqueta="Alertas"
        valor={pestana}
        onCambio={(v) => setPestana(v as typeof pestana)}
        opciones={[
          { valor: "proximas", etiqueta: `Próximas (${pendientes})` },
          { valor: "resueltas", etiqueta: "Resueltas" },
        ]}
      />

      {pestana === "resueltas" ? (
        resueltas.length > 0 ? (
          <div className="flex flex-col gap-3">
            {resueltas.map((a) => (
              <TarjetaAlertaResuelta key={a.id} alerta={a} />
            ))}
          </div>
        ) : (
          <div className="pt-8">
            <Estado icono="history" titulo="Sin alertas resueltas" mensaje="Cuando marques una alerta como resuelta, quedará aquí." />
          </div>
        )
      ) : pendientes === 0 ? (
        <SinPendientes
          alertas={filtradas}
          nombres={(filtros.mascota === "todas" ? mascotas : mascotas.filter((m) => m.id === filtros.mascota)).map((m) => m.nombre)}
          proxima={adelante[0]}
          resueltas={resueltas.length}
          onVerResueltas={() => setPestana("resueltas")}
        />
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2 movil-m:gap-2.5">
            <Ficha numero={vencidas.length} texto="Urgente" tono="error" />
            <Ficha numero={semana.length} texto="Esta semana" tono="error" />
            <Ficha numero={adelante.length} texto="Al día" tono="exito" />
          </div>

          {vencidas.length > 0 && <Grupo titulo="Urgente" />}
          {grandes.map((a, i) => (
            <div key={a.id} className="contents">
              {i === vencidas.length && semana.length > 0 && <Grupo titulo="Esta semana" />}
              <TarjetaAlertaGrande
                alerta={a}
                oscura={i === 0}
                onResolver={() => acciones.resolver(a)}
                onPosponer={() => setPosponiendo(a.id)}
                onCalendario={() => {
                  agregarAlCalendarioDeBalto(a)
                  setAlCalendario({ ...a, en_calendario: true })
                }}
              />
            </div>
          ))}

          {adelante.length > 0 && (
            <>
              <Grupo titulo="Más adelante" />
              {adelante.map((a) => (
                <TarjetaAlertaCompacta key={a.id} alerta={a} />
              ))}
            </>
          )}
        </>
      )}

      <HojaFiltrosAlertas
        abierta={verFiltros}
        onCerrar={() => setVerFiltros(false)}
        mascotas={mascotas}
        filtros={filtros}
        onAplicar={(f) => {
          setFiltros(f)
          setVerFiltros(false)
        }}
      />
      <HojaPosponer alertaId={posponiendo} onCerrar={() => setPosponiendo(null)} />
      {acciones.hojaResolver}
      <HojaCalendario alerta={alCalendario} onCerrar={() => setAlCalendario(null)} />
    </div>
  )
}

function Grupo({ titulo }: { titulo: string }) {
  return <h2 className="mt-1 texto-micro text-texto">{titulo}</h2>
}

function Ficha({ numero, texto, tono }: { numero: number; texto: string; tono: "error" | "exito" }) {
  return (
    // En 320 px "Esta semana" pasa a dos líneas en vez de cortarse.
    <div className={cn("flex min-h-17 flex-col justify-center rounded-md px-2.5 py-2 movil-m:px-3", tono === "error" ? "bg-error-suave text-error" : "bg-exito-suave text-exito")}>
      <span className="texto-titulo-tarjeta">{numero}</span>
      <span className="texto-etiqueta">{texto}</span>
    </div>
  )
}

type SinPendientesProps = {
  alertas: AlertaVista[]
  nombres: string[]
  proxima?: AlertaVista
  resueltas: number
  onVerResueltas: () => void
}

/** J7 · Sin alertas pendientes: nada vencido ni nada que venza en los próximos 7 días. */
function SinPendientes({ alertas, nombres, proxima, resueltas, onVerResueltas }: SinPendientesProps) {
  const quienes = nombres.length > 1 ? `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}` : (nombres[0] ?? "Tus mascotas")
  const verbo = nombres.length > 1 ? "no tienen" : "no tiene"
  const anio = hoy().slice(0, 4)
  const delAnio = alertas.filter((a) => a.grupo === "resuelta" && (a.fecha_resuelta ?? "").startsWith(anio)).length
  return (
    <div className="flex flex-col gap-3 pt-4">
      <Estado tono="exito" icono="verified" titulo="Todo al día" mensaje={`${quienes} ${verbo} nada pendiente esta semana.`} />
      <div className="mt-3 flex flex-col gap-3">
        <FilaOpcion
          icono="history"
          titulo="Ver alertas resueltas"
          detalle={resueltas === 0 ? "Aún no hay" : `${delAnio} este año`}
          onClick={onVerResueltas}
        />
        {proxima && (
          <FilaOpcion
            icono="event_upcoming"
            titulo={`Próxima: ${tituloAlertaVista(proxima).charAt(0).toLowerCase()}${tituloAlertaVista(proxima).slice(1)}`}
            detalle={`${fechaCorta(proxima.fecha_vencimiento).replace(/ \d{4}$/, "")} · en ${diasEntre(hoy(), proxima.fecha_vencimiento)} días`}
            href={`/alertas/detalle?id=${proxima.id}`}
          />
        )}
      </div>
    </div>
  )
}
