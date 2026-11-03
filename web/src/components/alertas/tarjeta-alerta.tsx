"use client"

import Link from "next/link"

import { Icono } from "@/components/icono"
import {
  ICONOS_ALERTA,
  detalleAlerta,
  rotuloAdelante,
  rotuloVence,
  tituloAlertaVista,
  type AlertaVista,
} from "@/lib/alertas"
import { fechaCorta } from "@/lib/fecha"
import { cn } from "@/lib/utils"

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

type TarjetaGrandeProps = {
  alerta: AlertaVista
  /** La primera de la lista va en oscuro; las demás, en verde (J1). */
  oscura?: boolean
  onResolver: () => void
  onPosponer: () => void
  onCalendario: () => void
}

/** Alerta vencida o de esta semana, con "Marcar resuelta", posponer y agregar al calendario (componente Tarjeta de alerta). */
export function TarjetaAlertaGrande({ alerta: a, oscura, onResolver, onPosponer, onCalendario }: TarjetaGrandeProps) {
  const vencida = a.grupo === "vencida"
  return (
    <article className={cn("flex flex-col gap-4 rounded-lg p-4 movil-m:p-5", oscura ? "bg-oscuro" : "bg-primario")}>
      <Link href={`/alertas/detalle?id=${a.id}`} className="flex items-center gap-3.5">
        <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-acento-suave text-oscuro">
          <Icono nombre={ICONOS_ALERTA[a.tipo]} className="icono-m" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className={cn("texto-micro", vencida ? "text-error-suave" : "text-sobre-oscuro-secundario")}>{rotuloVence(a)}</span>
          <span className="truncate texto-titulo-seccion font-semibold text-superficie">{tituloAlertaVista(a)}</span>
          <span className="truncate texto-etiqueta text-sobre-oscuro-secundario">
            {a.mascota.nombre} · {detalleAlerta(a)}
          </span>
        </span>
      </Link>
      {a.pospuesta && (
        <span className="-mt-1 flex items-center gap-1.5 texto-etiqueta text-sobre-oscuro-secundario">
          <Icono nombre="snooze" className="icono-s" />
          Aviso pospuesto al {sinAnio(a.pospuesta)}
        </span>
      )}
      <div className="flex items-center gap-2 movil-m:gap-2.5">
        <button
          type="button"
          onClick={onResolver}
          className={cn(
            "flex h-11 min-w-0 flex-1 items-center justify-center gap-1.5 rounded-completo px-3 texto-boton movil-m:h-12 movil-m:gap-2 movil-m:px-4",
            oscura ? "bg-acento text-primario" : "bg-oscuro text-superficie",
          )}
        >
          {/* Llamado a la acción: "Ya lo resolví" se leía como si la alerta ya estuviera resuelta. */}
          <span className="truncate">{a.tipo === "alimento_por_acabarse" ? "Marcar comprado" : "Marcar resuelta"}</span>
          {/* En 320 px el check no cabe junto al texto completo. */}
          <Icono nombre="check" className="hidden icono-m movil-m:inline-block" />
        </button>
        <BotonRedondo icono="snooze" etiqueta="Posponer aviso" onClick={onPosponer} />
        <BotonRedondo icono="calendar_add_on" etiqueta="Agregar al calendario" onClick={onCalendario} />
      </div>
    </article>
  )
}

function BotonRedondo({ icono, etiqueta, onClick }: { icono: string; etiqueta: string; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={etiqueta}
      onClick={onClick}
      className="grid size-11 shrink-0 place-items-center rounded-completo bg-superficie text-oscuro movil-m:size-12"
    >
      <Icono nombre={icono} className="icono-m" />
    </button>
  )
}

/** Alerta de "Más adelante": fila blanca con la fecha, el título y la mascota. */
export function TarjetaAlertaCompacta({ alerta: a }: { alerta: AlertaVista }) {
  return (
    <Link href={`/alertas/detalle?id=${a.id}`} className="flex min-w-0 items-center gap-3.5 rounded-lg bg-superficie p-4 movil-m:px-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={ICONOS_ALERTA[a.tipo]} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="texto-micro text-primario">{rotuloAdelante(a)}</span>
        <span className="truncate texto-titulo-seccion font-semibold text-texto">{tituloAlertaVista(a)}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">
          {a.mascota.nombre} · {a.pospuesta ? `aviso pospuesto al ${sinAnio(a.pospuesta)}` : detalleAlerta(a)}
        </span>
      </span>
      <Icono nombre="chevron_right" className="shrink-0 icono-m text-texto-secundario" />
    </Link>
  )
}

/** Alerta de la pestaña Resueltas: con la fecha en que se resolvió y el evento que la resolvió. */
export function TarjetaAlertaResuelta({ alerta: a }: { alerta: AlertaVista }) {
  const href = a.evento_resolucion_id ? `/evento?id=${a.evento_resolucion_id}` : `/alertas/detalle?id=${a.id}`
  return (
    <Link href={href} className="flex min-w-0 items-center gap-3.5 rounded-lg bg-superficie p-4 movil-m:px-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-exito-suave text-exito">
        <Icono nombre="task_alt" className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="texto-micro text-exito">Resuelta · {sinAnio(a.fecha_resuelta ?? a.fecha_vencimiento)}</span>
        <span className="truncate texto-cuerpo-fuerte text-texto">{tituloAlertaVista(a)}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">
          {a.mascota.nombre} · venció el {fechaCorta(a.fecha_vencimiento)}
        </span>
      </span>
      <Icono nombre="chevron_right" className="shrink-0 icono-m text-texto-secundario" />
    </Link>
  )
}
