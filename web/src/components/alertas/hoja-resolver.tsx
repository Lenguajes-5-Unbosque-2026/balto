"use client"

import { useState } from "react"

import { Boton } from "@/components/boton"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import {
  datosConocidos,
  intervaloAnterior,
  queSeRegistra,
  resolucionDe,
  textoIntervalo,
  type AlertaVista,
  type DatosResolver,
} from "@/lib/alertas"
import { fechaCorta, hoy, sumarDias } from "@/lib/fecha"

type HojaResolverProps = {
  alerta: AlertaVista | null
  /** "Registrar y resolver": guarda el evento con lo conocido y lo elegido aquí. */
  onRegistrar: (a: AlertaVista, d: DatosResolver) => void
  /** "Ver todos los datos": el formulario de E con lo mismo lleno. */
  onVerDatos: (a: AlertaVista, d: DatosResolver) => void
  onCerrar: () => void
}

/**
 * "Marcar resuelta" en un paso: registra el evento con los datos de la vez
 * anterior y solo pregunta cuándo se hizo y si toca otra dosis (o el peso).
 */
export function HojaResolver({ alerta, onRegistrar, onVerDatos, onCerrar }: HojaResolverProps) {
  return (
    <Hoja abierta={!!alerta} onCerrar={onCerrar} titulo={alerta ? pregunta(alerta) : ""}>
      {alerta && <Contenido alerta={alerta} onRegistrar={onRegistrar} onVerDatos={onVerDatos} />}
    </Hoja>
  )
}

type Cuando = "hoy" | "ayer" | "otra"
type Proxima = "no" | "intervalo" | "otra"

function Contenido({ alerta: a, onRegistrar, onVerDatos }: Pick<HojaResolverProps, "onRegistrar" | "onVerDatos"> & { alerta: AlertaVista }) {
  const r = resolucionDe(a)!
  const intervalo = intervaloAnterior(a)
  const resumen = resumenConocido(a)

  const [cuando, setCuando] = useState<Cuando>("hoy")
  const [otraFecha, setOtraFecha] = useState(hoy())
  const [proxima, setProxima] = useState<Proxima>(intervalo ? "intervalo" : "no")
  const [otraProxima, setOtraProxima] = useState("")
  const [peso, setPeso] = useState("")

  const fecha = cuando === "hoy" ? hoy() : cuando === "ayer" ? sumarDias(hoy(), -1) : otraFecha
  const fechaProxima = !r.proxima || proxima === "no" ? "" : proxima === "intervalo" ? sumarDias(fecha, intervalo) : otraProxima
  const datos: DatosResolver = { fecha, proxima: fechaProxima, ...(r.tipo === "peso" ? { peso_kg: peso } : {}) }
  const listo = !!fecha && fecha <= hoy() && (proxima !== "otra" || fechaProxima > fecha) && (r.tipo !== "peso" || Number(peso.replace(",", ".")) > 0)

  return (
    <div className="flex flex-col gap-5">
      <p className="texto-cuerpo text-texto-secundario">Queda en la línea de tiempo de {a.mascota.nombre} y la alerta pasa a Resueltas.</p>

      {resumen && (
        <div className="flex items-center gap-3 rounded-md bg-fondo px-4 py-3">
          <Icono nombre={ICONOS[r.tipo]} className="icono-m text-primario" />
          <span className="min-w-0 texto-etiqueta text-texto">{resumen}</span>
        </div>
      )}

      {r.tipo === "peso" && (
        <Campo etiqueta="Peso (kg)" requerido icono="monitor_weight" inputMode="decimal" placeholder="0,0" valor={peso} onCambio={setPeso} />
      )}

      <Grupo titulo={r.tipo === "peso" ? "¿Cuándo lo pesaste?" : "¿Cuándo?"}>
        <Chip texto="Hoy" activo={cuando === "hoy"} onClick={() => setCuando("hoy")} />
        <Chip texto="Ayer" activo={cuando === "ayer"} onClick={() => setCuando("ayer")} />
        <Chip texto="Otra fecha" icono="event" activo={cuando === "otra"} onClick={() => setCuando("otra")} />
      </Grupo>
      {cuando === "otra" && <Campo etiqueta="Fecha" type="date" icono="event" max={hoy()} valor={otraFecha} onCambio={setOtraFecha} />}

      {r.proxima && (
        <>
          <Grupo titulo={PREGUNTA_PROXIMA[r.tipo]}>
            <Chip texto="No" activo={proxima === "no"} onClick={() => setProxima("no")} />
            {intervalo > 0 && <Chip texto={textoIntervalo(intervalo)} activo={proxima === "intervalo"} onClick={() => setProxima("intervalo")} />}
            <Chip texto="Otra fecha" icono="event" activo={proxima === "otra"} onClick={() => setProxima("otra")} />
          </Grupo>
          {proxima === "otra" && (
            <Campo etiqueta="Próxima fecha" type="date" icono="event_repeat" min={sumarDias(fecha, 1)} valor={otraProxima} onCambio={setOtraProxima} />
          )}
          {fechaProxima && (
            <p className="-mt-2 flex items-center gap-2 texto-etiqueta text-texto-secundario">
              <Icono nombre="notifications_active" className="icono-s text-exito" />
              Te avisamos antes del {fechaCorta(fechaProxima)}
            </p>
          )}
        </>
      )}

      <div className="mt-1 flex flex-col gap-3">
        <Boton disabled={!listo} onClick={() => onRegistrar(a, datos)}>
          Registrar y resolver
          <Icono nombre="check" className="icono-m" />
        </Boton>
        <Boton variante="secundario" onClick={() => onVerDatos(a, datos)}>
          Ver todos los datos
        </Boton>
      </div>
    </div>
  )
}

function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="texto-etiqueta-fuerte text-texto">{titulo}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  )
}

const ICONOS = { vacuna: "vaccines", desparasitacion: "pest_control", examen: "labs", peso: "monitor_weight" } as const

const PREGUNTA_PROXIMA: Record<string, string> = {
  vacuna: "¿Toca otro refuerzo?",
  desparasitacion: "¿Toca otra dosis?",
  examen: "¿Toca otro control?",
}

/** Lo que se va a registrar con los datos de la vez anterior: "Antirrábica · Nobivac Rabies · Clínica Veterinaria Norte". */
function resumenConocido(a: AlertaVista) {
  const d = datosConocidos(a)
  return [d.vacuna, d.producto, d.tipo_examen, d.via && `vía ${d.via}`, d.laboratorio, d.veterinaria].filter(Boolean).join(" · ")
}

/** "¿Ya le aplicaron la antirrábica a Luna?" */
function pregunta(a: AlertaVista) {
  const nombre = a.mascota.nombre
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return `¿Ya le aplicaron ${queSeRegistra(a).toLowerCase()} a ${nombre}?`
    case "proxima_desparasitacion":
      return `¿Ya desparasitaste a ${nombre}?`
    case "control_examen":
      return `¿Ya le hicieron ${queSeRegistra(a).toLowerCase()} a ${nombre}?`
    case "control_peso":
      return `¿Cuánto pesa ${nombre}?`
    case "alimento_por_acabarse":
      return "¿Ya compraste la bolsa nueva?"
  }
}
