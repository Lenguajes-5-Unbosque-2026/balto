"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Boton } from "@/components/boton"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { OpcionRadio } from "@/components/opcion-radio"
import { AHORA, hoy } from "@/lib/fecha"
import { hora12, momentoDelDia, nombreTratamiento, restarMinutos, type TomaVista } from "@/lib/medicamentos"
import { registrarToma } from "@/lib/usar-medicamentos"
import { cn } from "@/lib/utils"

/** "Confirmar": marca la toma como tomada con la hora actual. */
export function confirmarToma(t: TomaVista) {
  registrarToma(t.clave, { estado: "tomada", hora_real: AHORA })
  toast.success(`Toma de las ${t.hora} confirmada`)
}

const puedeResponder = (t: TomaVista) => t.estado === "pendiente" || t.estado === "pospuesta"

/** Estado de la toma en una línea: "Tomada a las 8:05", "Pendiente", "Aviso reprogramado 8:30". */
function textoEstado(t: TomaVista, largo: boolean) {
  switch (t.estado) {
    case "tomada":
      return t.hora_real ? `Tomada ${largo ? hora12(t.hora_real) : `a las ${t.hora_real.replace(/^0/, "")}`}` : "Tomada"
    case "pospuesta":
      return t.aviso_reprogramado ? `Aviso reprogramado ${hora12(t.aviso_reprogramado)}` : "Aviso reprogramado"
    case "omitida":
      return "Omitida"
    case "sin_registrar":
      return "Sin registrar"
    case "pendiente":
      return largo ? `Aviso ${hora12(restarMinutos(t.hora, 10))}` : "Pendiente"
  }
}

type FilaTomaProps = { toma: TomaVista; onOmitir: (t: TomaVista) => void }

/** Toma de "Tomas de hoy" (G1): hora · medicamento, estado y "Confirmar". */
export function FilaTomaHoy({ toma: t, onOmitir }: FilaTomaProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-borde-fuerte bg-superficie p-3.5 movil-m:gap-3.5">
      {/* Tocar la toma pendiente (no su botón) abre G6. */}
      <button
        type="button"
        disabled={!puedeResponder(t)}
        onClick={() => onOmitir(t)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left movil-m:gap-3.5"
      >
        <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
          <Icono nombre="schedule" className="icono-m" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate texto-cuerpo-fuerte text-texto">
            {t.hora} · {t.tratamiento.medicamento.split(" ")[0]}
          </span>
          <span className={cn("truncate texto-etiqueta", t.estado === "omitida" || t.estado === "sin_registrar" ? "text-error" : "text-texto-secundario")}>
            {textoEstado(t, false)}
          </span>
        </span>
      </button>
      {puedeResponder(t) ? (
        <button type="button" onClick={() => confirmarToma(t)} className="shrink-0 px-1 texto-etiqueta-fuerte text-primario">
          Confirmar
        </button>
      ) : t.estado === "tomada" ? (
        <Icono nombre="check_circle" className="shrink-0 icono-m text-texto-secundario" />
      ) : null}
    </div>
  )
}

/** Toma de G2: bloque de hora, momento del día, estado y la acción o el chip de estado. */
export function FilaTomaDetalle({ toma: t, onOmitir }: FilaTomaProps) {
  const ayer = t.fecha < hoy()
  const [h] = t.hora.split(":").map(Number)
  return (
    <div className="flex items-center gap-3 rounded-md border border-borde-fuerte bg-superficie p-3 movil-m:gap-3.5 movil-m:p-3.5">
      <span className="flex w-13 shrink-0 flex-col items-center border-r border-borde-fuerte pr-3">
        <span className="texto-titulo-seccion font-semibold text-texto">{t.hora}</span>
        <span className="texto-micro text-texto-secundario">{h < 12 ? "AM" : "PM"}</span>
      </span>
      <button
        type="button"
        disabled={!puedeResponder(t)}
        onClick={() => onOmitir(t)}
        className="flex min-w-0 flex-1 flex-col text-left"
      >
        <span className="truncate texto-cuerpo-fuerte text-texto">
          {ayer ? `Ayer · ${momentoDelDia(t.hora).toLowerCase()}` : momentoDelDia(t.hora)}
        </span>
        <span className="truncate texto-etiqueta text-texto-secundario">{textoEstado(t, true)}</span>
      </button>
      {puedeResponder(t) ? (
        <button
          type="button"
          onClick={() => confirmarToma(t)}
          className="h-11 shrink-0 rounded-completo bg-primario px-4 texto-boton text-superficie"
        >
          Confirmar
        </button>
      ) : t.estado === "tomada" ? (
        <span className="flex h-8 shrink-0 items-center gap-1 rounded-completo bg-exito-suave px-3 texto-etiqueta-fuerte text-exito">
          <Icono nombre="check_circle" className="icono-s" />
          Tomada
        </span>
      ) : (
        <span className="flex h-8 shrink-0 items-center gap-1 rounded-completo bg-oscuro px-3 texto-etiqueta-fuerte text-superficie">
          <Icono nombre="close" className="icono-s" />
          {t.estado === "omitida" ? "Omitida" : "Sin registrar"}
        </span>
      )}
    </div>
  )
}

/** G6 · Marcar dosis como omitida: recordar en 30 min u omitirla. */
export function HojaOmitir({ toma, onCerrar }: { toma: TomaVista | null; onCerrar: () => void }) {
  return (
    <Hoja abierta={!!toma} onCerrar={onCerrar} titulo="Marcar dosis como omitida">
      <ContenidoOmitir toma={toma!} onCerrar={onCerrar} />
    </Hoja>
  )
}

function ContenidoOmitir({ toma, onCerrar }: { toma: TomaVista; onCerrar: () => void }) {
  const [opcion, setOpcion] = useState<"posponer" | "omitir">("posponer")

  function confirmar() {
    if (opcion === "posponer") {
      const aviso = restarMinutos(AHORA, -30)
      registrarToma(toma.clave, { estado: "pospuesta", aviso_reprogramado: aviso })
      toast.success(`Te recordamos a las ${aviso}`)
    } else {
      registrarToma(toma.clave, { estado: "omitida" })
      toast(`Dosis de las ${toma.hora} omitida`)
    }
    onCerrar()
  }

  return (
    <div role="radiogroup" aria-label="Qué hacer con la dosis" className="flex flex-col gap-3">
      <p className="-mt-2 mb-1 texto-cuerpo text-texto-secundario">
        ¿Qué quieres hacer con la dosis de las {toma.hora} de {nombreTratamiento(toma.tratamiento)}?
      </p>
      <OpcionRadio icono="more_time" titulo="Recordarme en 30 min" activa={opcion === "posponer"} onElegir={() => setOpcion("posponer")} />
      <OpcionRadio
        icono="block"
        titulo="Omitir esta dosis"
        detalle="Quedará registrada como omitida"
        activa={opcion === "omitir"}
        onElegir={() => setOpcion("omitir")}
      />
      <Boton className="mt-2" onClick={confirmar}>
        Confirmar
      </Boton>
    </div>
  )
}
