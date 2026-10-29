"use client"

import Link from "next/link"

import { Icono } from "@/components/icono"
import type { Evento } from "@/lib/eventos"
import { cuandoVence, tituloAlerta, type Alerta } from "@/lib/perfil"
import { avisarPronto } from "@/lib/pronto"
import { cn } from "@/lib/utils"

const ICONOS: Record<Alerta["tipo"], string> = {
  refuerzo_vacuna: "vaccines",
  proxima_desparasitacion: "pest_control",
  control_examen: "labs",
  control_peso: "monitor_weight",
  alimento_por_acabarse: "restaurant",
}

const caja = "flex w-full items-center gap-4 rounded-lg bg-acento-suave py-4 pr-4 pl-5 text-left"

/** "Próximo a vencer": la alerta más cercana de la mascota activa (componente Tarjeta de alerta, variante Inicio). */
export function TarjetaProximo({ alerta, evento, mascota }: { alerta?: Alerta; evento?: Evento; mascota: string }) {
  const vencida = alerta?.estado === "vencida"
  const contenido = (
    <>
      <Icono nombre={alerta ? ICONOS[alerta.tipo] : "task_alt"} className={cn("icono-l", vencida ? "text-error" : "text-primario")} />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("texto-micro", vencida ? "text-error" : "text-primario")}>
          {!alerta ? "Sin pendientes" : vencida ? "Vencido" : "Próximo a vencer"}
        </span>
        <span className="truncate texto-cuerpo-fuerte text-texto">{alerta ? tituloAlerta(alerta, evento) : "Todo al día"}</span>
        <span className="truncate texto-etiqueta text-texto-secundario">
          {mascota} · {alerta ? cuandoVence(alerta.fecha_vencimiento) : "nada por vencer"}
        </span>
      </span>
      <span className="grid size-12 shrink-0 place-items-center rounded-completo bg-primario-relleno text-superficie">
        <Icono nombre="chevron_right" className="icono-m" />
      </span>
    </>
  )

  // El detalle de la alerta (J2) llega con el flujo J; mientras tanto se abre el evento que la generó (D4).
  if (evento) {
    return (
      <Link href={`/evento?id=${evento.id}`} className={caja}>
        {contenido}
      </Link>
    )
  }
  return (
    <button type="button" onClick={() => avisarPronto("Alertas")} className={caja}>
      {contenido}
    </button>
  )
}
