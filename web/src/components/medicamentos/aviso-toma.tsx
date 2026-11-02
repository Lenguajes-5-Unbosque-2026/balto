"use client"

import { BotonVolver } from "@/components/boton-volver"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { BotonEnlace } from "@/components/boton"
import { Icono } from "@/components/icono"
import { confirmarToma, HojaOmitir } from "@/components/medicamentos/tomas"
import { HOY, fechaLarga } from "@/lib/fecha"
import { nombreTratamiento, tomasDelDia, type TomaVista } from "@/lib/medicamentos"
import { useMedicamentos, type DatosMedicamentos } from "@/lib/usar-medicamentos"

type AvisoTomaProps = DatosMedicamentos & { mascotas: { id: string; nombre: string }[] }

/** G5 · Recordatorio de toma: la notificación "Hora de la dosis de Luna" (/medicamentos/aviso?id=t04). */
export function AvisoToma({ mascotas, ...datos }: AvisoTomaProps) {
  const router = useRouter()
  const id = useSearchParams().get("id")
  const { tratamientos, registros } = useMedicamentos(datos)
  const vigentes = tratamientos.filter((t) => t.estado === "vigente")
  const t = vigentes.find((x) => x.id === id) ?? vigentes[0]
  const toma = t && (tomasDelDia(t, HOY, registros).find((x) => x.estado === "pendiente" || x.estado === "pospuesta") ?? tomasDelDia(t, HOY, registros)[0])
  const [omitiendo, setOmitiendo] = useState<TomaVista | null>(null)
  const mascota = mascotas.find((m) => m.id === t?.mascota_id)

  return (
    <main className="-mb-px flex flex-1 flex-col gap-6 bg-primario px-pantalla pt-14">
      <BotonVolver respaldo="/medicamentos" />
      <div className="flex flex-col items-center gap-1 pb-6 text-superficie">
        <span className="texto-reloj">9:41</span>
        <span className="texto-cuerpo text-sobre-oscuro-secundario">{fechaLarga(HOY)}</span>
      </div>

      {t && toma ? (
        <article className="flex flex-col gap-3 rounded-lg bg-superficie p-4">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-xs bg-primario text-superficie">
              <Icono nombre="pets" className="icono-s" />
            </span>
            <span className="flex-1 texto-micro text-texto-secundario">Balto</span>
            <span className="texto-etiqueta text-texto-secundario">ahora</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="texto-cuerpo-fuerte text-texto">Hora de la dosis de {mascota?.nombre ?? "tu mascota"}</h1>
            <p className="texto-etiqueta text-texto">
              {nombreTratamiento(t)} · {t.dosis} ({toma.hora})
            </p>
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => setOmitiendo(toma)} className="h-11 flex-1 rounded-completo bg-acento texto-boton text-primario">
              Omitir
            </button>
            <button
              type="button"
              onClick={() => {
                confirmarToma(toma)
                router.push(`/medicamentos/detalle?id=${t.id}`)
              }}
              className="h-11 flex-1 rounded-completo bg-primario texto-boton text-superficie"
            >
              Ya la di
            </button>
          </div>
        </article>
      ) : (
        <div className="flex flex-col gap-4 rounded-lg bg-superficie p-5">
          <p className="texto-cuerpo text-texto">No hay tomas pendientes hoy.</p>
          <BotonEnlace href="/medicamentos">Ver medicamentos</BotonEnlace>
        </div>
      )}

      <HojaOmitir
        toma={omitiendo}
        onCerrar={() => {
          setOmitiendo(null)
          if (t) router.push(`/medicamentos/detalle?id=${t.id}`)
        }}
      />
    </main>
  )
}
