"use client"

import Link from "next/link"

import { Icono } from "@/components/icono"
import { ICONOS_ALERTA } from "@/lib/alertas"
import type { Evento } from "@/lib/eventos"
import { cuandoVence, tituloAlerta, type Alerta } from "@/lib/perfil"
import { cn } from "@/lib/utils"

/** "Próximo a vencer": la alerta más cercana de la mascota activa (componente Tarjeta de alerta, variante Inicio). */
export function TarjetaProximo({ alerta, evento, mascota }: { alerta?: Alerta; evento?: Evento; mascota: string }) {
  const vencida = alerta?.estado === "vencida" || (alerta && cuandoVence(alerta.fecha_vencimiento).startsWith("venció"))
  return (
    <Link
      href={alerta ? `/alertas/detalle?id=${alerta.id}` : "/alertas"}
      className="flex w-full items-center gap-3 rounded-lg bg-acento-suave py-4 pr-3 pl-4 text-left movil-m:gap-4 movil-m:pr-4 movil-m:pl-5"
    >
      {/* El ícono siempre va en verde; lo vencido se marca solo con el rótulo en rojo. */}
      <Icono nombre={alerta ? ICONOS_ALERTA[alerta.tipo] : "task_alt"} className="icono-l text-primario" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={cn("texto-micro", vencida ? "text-error" : "text-primario")}>
          {!alerta ? "Sin pendientes" : vencida ? "Vencido" : "Próximo a vencer"}
        </span>
        <span className="truncate texto-cuerpo-fuerte text-texto">{alerta ? tituloAlerta(alerta, evento) : "Todo al día"}</span>
        <span className="texto-etiqueta text-texto-secundario">
          {mascota} · {alerta ? cuandoVence(alerta.fecha_vencimiento) : "nada por vencer"}
        </span>
      </span>
      <span className="grid size-11 shrink-0 place-items-center rounded-completo bg-primario-relleno text-superficie movil-m:size-12">
        <Icono nombre="chevron_right" className="icono-m" />
      </span>
    </Link>
  )
}
