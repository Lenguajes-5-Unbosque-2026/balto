"use client"

import { Icono } from "@/components/icono"
import { diaSemana, sumarDias } from "@/lib/fecha"
import { cn } from "@/lib/utils"

const MESES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

type CalendarioMesProps = {
  /** Primer día del mes que se muestra: "2026-10-01". */
  mes: string
  onMes: (mes: string) => void
  seleccionado?: string
  onElegir: (fecha: string) => void
  /** Días sombreados: con cupo (K5) o con citas (K6). */
  marcados?: Set<string>
  deshabilitado?: (fecha: string) => boolean
}

/** Mes con semanas de lunes a domingo (componente Calendario: K5, K6). */
export function CalendarioMes({ mes, onMes, seleccionado, onElegir, marcados, deshabilitado }: CalendarioMesProps) {
  const [a, m] = mes.split("-").map(Number)
  const dias = new Date(Date.UTC(a, m, 0)).getUTCDate()
  const vacios = (diaSemana(mes) + 6) % 7
  const otroMes = (delta: number) => new Date(Date.UTC(a, m - 1 + delta, 1)).toISOString().slice(0, 10)

  return (
    <section className="flex flex-col gap-2 rounded-lg bg-superficie p-4 movil-m:px-5">
      <div className="flex items-center justify-between">
        <button type="button" aria-label="Mes anterior" onClick={() => onMes(otroMes(-1))} className="grid size-8 place-items-center text-texto-secundario">
          <Icono nombre="chevron_left" className="icono-m" />
        </button>
        <span className="texto-cuerpo-fuerte text-texto">
          {MESES[m - 1]} {a}
        </span>
        <button type="button" aria-label="Mes siguiente" onClick={() => onMes(otroMes(1))} className="grid size-8 place-items-center text-texto-secundario">
          <Icono nombre="chevron_right" className="icono-m" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => (
          <span key={i} className="py-1 texto-micro text-texto-secundario">
            {d}
          </span>
        ))}
        {Array.from({ length: vacios }, (_, i) => (
          <span key={`v${i}`} />
        ))}
        {Array.from({ length: dias }, (_, i) => {
          const fecha = sumarDias(mes, i)
          const elegido = fecha === seleccionado
          const off = deshabilitado?.(fecha)
          return (
            <button
              key={fecha}
              type="button"
              disabled={off}
              aria-pressed={elegido}
              aria-label={fecha}
              onClick={() => onElegir(fecha)}
              className={cn(
                "mx-auto grid size-10 place-items-center rounded-completo texto-cuerpo transition-colors disabled:text-acento",
                elegido ? "bg-primario text-superficie" : marcados?.has(fecha) ? "bg-acento-suave text-texto" : "text-texto",
              )}
            >
              {i + 1}
            </button>
          )
        })}
      </div>
    </section>
  )
}
