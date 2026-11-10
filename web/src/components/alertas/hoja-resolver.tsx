"use client"

import { Boton } from "@/components/boton"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { queSeRegistra, type AlertaVista } from "@/lib/alertas"

type HojaResolverProps = {
  alerta: AlertaVista | null
  onRegistrar: (a: AlertaVista) => void
  onCerrar: () => void
}

/**
 * "Marcar resuelta": antes de abrir el formulario de E, explica que la alerta
 * se resuelve registrando el evento y qué pasa al guardarlo.
 */
export function HojaResolver({ alerta, onRegistrar, onCerrar }: HojaResolverProps) {
  return (
    <Hoja abierta={!!alerta} onCerrar={onCerrar} titulo={alerta ? pregunta(alerta) : ""}>
      {alerta && <Contenido alerta={alerta} onRegistrar={() => onRegistrar(alerta)} onCerrar={onCerrar} />}
    </Hoja>
  )
}

function Contenido({ alerta: a, onRegistrar, onCerrar }: { alerta: AlertaVista; onRegistrar: () => void; onCerrar: () => void }) {
  const que = queSeRegistra(a).toLowerCase()
  const siguiente = proximoAviso(a)
  const resultados = [
    { icono: "timeline", texto: `Queda en la línea de tiempo de ${a.mascota.nombre}` },
    { icono: "task_alt", texto: "La alerta pasa a Resueltas" },
    ...(siguiente ? [{ icono: "notifications_active", texto: `Te avisamos antes de ${siguiente}` }] : []),
  ]

  return (
    <div className="flex flex-col gap-4">
      <p className="texto-cuerpo text-texto-secundario">
        Para marcar la alerta como resuelta, registra {que}.{" "}
        {a.tipo === "control_peso" ? "Toma menos de un minuto." : "Los datos que ya conocemos vienen llenos: solo revisa y guarda."}
      </p>
      <ul className="flex flex-col gap-2.5 rounded-md bg-fondo p-4">
        {resultados.map((r) => (
          <li key={r.icono} className="flex items-center gap-3 texto-etiqueta text-texto">
            <Icono nombre={r.icono} className="icono-s text-exito" />
            {r.texto}
          </li>
        ))}
      </ul>
      <div className="mt-1 flex flex-col gap-3">
        <Boton onClick={onRegistrar}>
          {textoBoton(a)}
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
        <Boton variante="secundario" onClick={onCerrar}>
          Todavía no
        </Boton>
      </div>
    </div>
  )
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
      return `¿Ya pesaste a ${nombre}?`
    case "alimento_por_acabarse":
      return "¿Ya compraste la bolsa nueva?"
  }
}

function textoBoton(a: AlertaVista) {
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return "Registrar la vacuna"
    case "proxima_desparasitacion":
      return "Registrar la desparasitación"
    case "control_examen":
      return "Registrar el examen"
    default:
      return "Registrar el peso"
  }
}

/** Lo que se vuelve a avisar si el evento trae próxima fecha (el peso no tiene). */
function proximoAviso(a: AlertaVista) {
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return "el próximo refuerzo"
    case "proxima_desparasitacion":
      return "la próxima dosis"
    case "control_examen":
      return "el próximo control"
    default:
      return ""
  }
}
