"use client"

import { useState } from "react"

import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Encabezado } from "@/components/encabezado"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"
import { OpcionRadio } from "@/components/opcion-radio"
import { guardarPreferencia, usePreferencias, type Preferencia } from "@/lib/usar-cuenta"
import { useVolver } from "@/lib/usar-salud"

/** Tipos de aviso de M3, con las anticipaciones que ofrece cada uno (spec de M). */
const TIPOS = [
  { tipo: "vacunas_desparasitaciones", nombre: "Vacunas y desparasitaciones", icono: "vaccines", opciones: ["1 dia", "3 dias", "7 dias", "15 dias"] },
  { tipo: "tomas", nombre: "Tomas de medicamentos", icono: "medication", opciones: ["a la hora", "5 min", "10 min", "15 min"] },
  { tipo: "comidas", nombre: "Comidas", icono: "restaurant", opciones: ["a la hora", "10 min", "30 min"] },
  { tipo: "citas", nombre: "Citas", icono: "event", opciones: ["1 hora", "1 dia"] },
  { tipo: "salud", nombre: "Salud (peso y controles)", icono: "monitor_heart", opciones: ["1 dia", "3 dias", "7 dias"] },
  { tipo: "pedidos", nombre: "Pedidos de la tienda", icono: "local_shipping", opciones: [] },
] as const

/** "7 dias" → "7 días antes"; "a la hora" queda igual. */
function textoAnticipacion(a: string) {
  if (!a) return ""
  if (a === "a la hora") return "A la hora"
  return `${a.replace("dias", "días").replace(/\bdia\b/, "día")} antes`
}

/** M3 · Configurar notificaciones: un interruptor por tipo, su anticipación y la franja de no molestar. */
export function ConfigurarNotificaciones({ preferencias: base }: { preferencias: Preferencia[] }) {
  const volver = useVolver("/ajustes")
  const prefs = usePreferencias(base)
  const [eligiendo, setEligiendo] = useState<(typeof TIPOS)[number] | null>(null)
  const [desde, hasta] = (prefs.no_molestar?.anticipacion || "22:00|07:00").split("|")

  function cambiar(tipo: string, activo: boolean) {
    const t = TIPOS.find((x) => x.tipo === tipo)!
    const anticipacion = prefs[tipo]?.anticipacion || (t.opciones.length ? t.opciones[Math.min(2, t.opciones.length - 1)] : "")
    guardarPreferencia(tipo, { activo: String(activo), anticipacion })
  }

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14 pb-10">
      <Encabezado titulo="Notificaciones" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      {TIPOS.map((t) => {
        const p = prefs[t.tipo]
        const activo = p?.activo === "true"
        return (
          <div key={t.tipo} className="flex items-center gap-3.5 rounded-md border border-borde-fuerte bg-superficie p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
              <Icono nombre={t.icono} className="icono-m" />
            </span>
            {/* Tocar el texto cambia la anticipación (solo si el aviso está encendido). */}
            <button
              type="button"
              disabled={!activo || t.opciones.length === 0}
              onClick={() => setEligiendo(t)}
              className="flex min-w-0 flex-1 flex-col text-left"
            >
              <span className="texto-cuerpo-fuerte text-texto">{t.nombre}</span>
              {activo && p.anticipacion && <span className="texto-etiqueta text-texto-secundario">{textoAnticipacion(p.anticipacion)}</span>}
            </button>
            <Interruptor etiqueta={t.nombre} activo={activo} onCambio={(a) => cambiar(t.tipo, a)} />
          </div>
        )
      })}

      <span className="mt-2 texto-micro text-texto-secundario">No molestar</span>
      <div className="grid grid-cols-2 gap-3">
        <Campo
          etiqueta="Desde"
          type="time"
          icono="dark_mode"
          valor={desde}
          onCambio={(v) => guardarPreferencia("no_molestar", { activo: "true", anticipacion: `${v}|${hasta}` })}
        />
        <Campo
          etiqueta="Hasta"
          type="time"
          icono="light_mode"
          valor={hasta}
          onCambio={(v) => guardarPreferencia("no_molestar", { activo: "true", anticipacion: `${desde}|${v}` })}
        />
      </div>

      <Hoja abierta={!!eligiendo} onCerrar={() => setEligiendo(null)} titulo={eligiendo ? `Avisarme de ${eligiendo.nombre.toLowerCase()}` : "Anticipación"}>
        {eligiendo && <Anticipacion tipo={eligiendo} actual={prefs[eligiendo.tipo]?.anticipacion ?? ""} onListo={() => setEligiendo(null)} />}
      </Hoja>
    </main>
  )
}

function Anticipacion({ tipo, actual, onListo }: { tipo: (typeof TIPOS)[number]; actual: string; onListo: () => void }) {
  const [valor, setValor] = useState(actual)
  return (
    <div role="radiogroup" className="flex flex-col gap-3">
      {tipo.opciones.map((o) => (
        <OpcionRadio key={o} titulo={textoAnticipacion(o)} activa={valor === o} onElegir={() => setValor(o)} />
      ))}
      <Boton
        className="mt-2"
        onClick={() => {
          guardarPreferencia(tipo.tipo, { anticipacion: valor })
          onListo()
        }}
      >
        Guardar
      </Boton>
    </div>
  )
}
