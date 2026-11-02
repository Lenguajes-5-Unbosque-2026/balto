"use client"

import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { FilaInterruptor } from "@/components/fila-interruptor"
import { Icono } from "@/components/icono"
import { Pasos } from "@/components/pasos"
import { Selector } from "@/components/selector"
import { DIAS_SEMANA, FRECUENCIAS, horasDesde, restarMinutos } from "@/lib/medicamentos"
import { cn } from "@/lib/utils"

const PRIMERAS = ["06:00", "07:00", "08:00", "09:00", "10:00"]

export type Horarios = { frecuencia: string; horas: string[]; dias_semana: string; recordatorio: boolean }

type PasoHorariosProps = {
  inicial: Horarios
  /** "Paso 2 de 2" en el alta (G3 → G4); sin pasos al editar desde G2. */
  conPasos?: boolean
  textoBoton?: string
  onVolver: () => void
  onGuardar: (h: Horarios) => void
}

const iconoHora = (hora: string) => {
  const h = Number(hora.slice(0, 2))
  if (h >= 6 && h < 12) return "light_mode"
  if (h >= 12 && h < 18) return "wb_twilight"
  return "dark_mode"
}

/** G4 · Definir horarios de toma: frecuencia, primera toma del día (o días y hora) y recordatorio. */
export function PasoHorarios({ inicial, conPasos, textoBoton = "Guardar horarios", onVolver, onGuardar }: PasoHorariosProps) {
  const [frecuencia, setFrecuencia] = useState(FRECUENCIAS.some((f) => f.valor === inicial.frecuencia) ? inicial.frecuencia : "cada_12h")
  const [primera, setPrimera] = useState(inicial.horas[0] && PRIMERAS.includes(inicial.horas[0]) ? inicial.horas[0] : "08:00")
  const [dias, setDias] = useState<string[]>(inicial.dias_semana.split(";").filter(Boolean))
  const [recordatorio, setRecordatorio] = useState(inicial.recordatorio)

  const horas = horasDesde(primera, frecuencia)
  const porDias = frecuencia === "por_dias"
  const completo = !porDias || dias.length > 0

  function alternarDia(d: string) {
    setDias((x) => (x.includes(d) ? x.filter((y) => y !== d) : [...x, d]))
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Horarios de toma" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={onVolver} />} />
      {conPasos && <Pasos paso={2} nombre="Horarios" />}

      <Selector etiqueta="Frecuencia" valor={frecuencia} onCambio={setFrecuencia} opciones={FRECUENCIAS.map((f) => ({ valor: f.valor, etiqueta: f.etiqueta }))} />

      {porDias && (
        <>
          <span className="texto-micro text-texto-secundario">Días de la semana</span>
          <div className="grid grid-cols-7 gap-1.5">
            {DIAS_SEMANA.map((d) => (
              <button
                key={d.valor}
                type="button"
                aria-pressed={dias.includes(d.valor)}
                aria-label={d.valor}
                onClick={() => alternarDia(d.valor)}
                className={cn(
                  "grid aspect-square place-items-center rounded-completo border texto-etiqueta-fuerte",
                  dias.includes(d.valor) ? "border-primario bg-primario text-superficie" : "border-borde-fuerte bg-superficie text-texto",
                )}
              >
                {d.corto}
              </button>
            ))}
          </div>
        </>
      )}

      <span className="texto-micro text-texto-secundario">{porDias ? "Hora" : "Primera toma del día"}</span>
      <div className="flex flex-wrap gap-2">
        {PRIMERAS.map((h) => (
          <Chip key={h} texto={h} activo={primera === h} onClick={() => setPrimera(h)} className="h-11 px-4.5 texto-cuerpo-fuerte" />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {horas.map((h, i) => (
          <div key={h} className="flex items-center gap-3.5 rounded-md border border-borde-fuerte bg-superficie p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
              <Icono nombre={iconoHora(h)} className="icono-m" />
            </span>
            <span className="flex flex-col">
              <span className="texto-cuerpo-fuerte text-texto">Toma {i + 1}</span>
              <span className="texto-etiqueta text-texto-secundario">{h}</span>
            </span>
          </div>
        ))}
        <div className="rounded-md border border-borde-fuerte bg-superficie p-3.5">
          <FilaInterruptor
            icono="notifications_active"
            titulo="Recordatorio"
            detalle={recordatorio ? `10 min antes de cada toma (${horas.map((h) => restarMinutos(h, 10)).join(" · ")})` : "10 min antes de cada toma"}
            activo={recordatorio}
            onCambio={setRecordatorio}
          />
        </div>
      </div>

      <BarraAccion>
        <Boton disabled={!completo} onClick={() => onGuardar({ frecuencia, horas, dias_semana: porDias ? dias.join(";") : "", recordatorio })}>
          {textoBoton}
          <Icono nombre="check" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
