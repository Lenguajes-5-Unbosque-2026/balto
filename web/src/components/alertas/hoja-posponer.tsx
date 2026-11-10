"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Boton } from "@/components/boton"
import { Campo } from "@/components/campo"
import { Hoja } from "@/components/hoja"
import { OpcionRadio } from "@/components/opcion-radio"
import { fechaCorta, hoy, sumarDias } from "@/lib/fecha"
import { posponerAlerta } from "@/lib/usar-alertas"

const OPCIONES = [
  { valor: "manana", titulo: "Mañana", icono: "schedule", dias: 1 },
  { valor: "tres", titulo: "En 3 días", icono: "calendar_month", dias: 3 },
  { valor: "elegir", titulo: "Elegir fecha", icono: "event", dias: 0 },
] as const

/** J3 · Posponer aviso: mueve el aviso a mañana, en 3 días o a una fecha; el vencimiento no cambia. */
export function HojaPosponer({ alertaId, onCerrar }: { alertaId: string | null; onCerrar: () => void }) {
  return (
    <Hoja abierta={!!alertaId} onCerrar={onCerrar} titulo="Posponer aviso">
      <Contenido alertaId={alertaId!} onCerrar={onCerrar} />
    </Hoja>
  )
}

function Contenido({ alertaId, onCerrar }: { alertaId: string; onCerrar: () => void }) {
  const [opcion, setOpcion] = useState<(typeof OPCIONES)[number]["valor"]>("manana")
  const [fecha, setFecha] = useState(sumarDias(hoy(), 7))

  const elegida = OPCIONES.find((o) => o.valor === opcion)!
  const destino = opcion === "elegir" ? fecha : sumarDias(hoy(), elegida.dias)

  function posponer() {
    posponerAlerta(alertaId, destino)
    toast.success(`Aviso pospuesto al ${fechaCorta(destino).replace(/ \d{4}$/, "")}`)
    onCerrar()
  }

  return (
    <div role="radiogroup" aria-label="¿Cuándo te avisamos?" className="flex flex-col gap-3">
      {OPCIONES.map((o) => (
        <OpcionRadio
          key={o.valor}
          icono={o.icono}
          titulo={o.titulo}
          detalle={o.dias ? fechaCorta(sumarDias(hoy(), o.dias)) : undefined}
          activa={opcion === o.valor}
          onElegir={() => setOpcion(o.valor)}
        />
      ))}
      {opcion === "elegir" && <Campo etiqueta="Fecha del aviso" type="date" icono="event" min={sumarDias(hoy(), 1)} valor={fecha} onCambio={setFecha} />}
      <Boton className="mt-3" disabled={!destino || destino <= hoy()} onClick={posponer}>
        Posponer
      </Boton>
    </div>
  )
}
