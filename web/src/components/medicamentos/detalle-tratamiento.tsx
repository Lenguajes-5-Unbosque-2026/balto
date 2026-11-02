"use client"

import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Dialogo } from "@/components/dialogo"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"
import { FilaTomaDetalle, HojaOmitir } from "@/components/medicamentos/tomas"
import { HOY, fechaLarga, sumarDias } from "@/lib/fecha"
import {
  diaTratamiento,
  duracion,
  frecuenciaTratamiento,
  presentacionTratamiento,
  resumenTratamiento,
  tomasDelDia,
  type TomaVista,
} from "@/lib/medicamentos"
import { guardarTratamiento, useMedicamentos, type DatosMedicamentos } from "@/lib/usar-medicamentos"
import { useVolver } from "@/lib/usar-salud"

/** "Miércoles, 23 de septiembre" → "MIÉ 23 SEP". */
function diaCorto(iso: string) {
  const [dia, resto] = fechaLarga(iso).split(", ")
  const [d, , mes] = resto.split(" ")
  return `${dia.slice(0, 3)} ${d} ${mes.slice(0, 3)}`
}

/** G2 · Detalle de tratamiento, con el menú ••• (finalizar o reactivar) y G8. */
export function DetalleTratamiento(datos: DatosMedicamentos) {
  const router = useRouter()
  const volver = useVolver("/medicamentos")
  const id = useSearchParams().get("id") ?? ""
  const { tratamientos, registros } = useMedicamentos(datos)
  const t = tratamientos.find((x) => x.id === id)
  const [menu, setMenu] = useState(false)
  const [finalizar, setFinalizar] = useState(false)
  const [omitiendo, setOmitiendo] = useState<TomaVista | null>(null)

  if (!t) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Tratamiento" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos el tratamiento" mensaje="Puede que se haya registrado en otro navegador." />
        <BotonEnlace href="/medicamentos" variante="secundario">
          Ir a medicamentos
        </BotonEnlace>
      </main>
    )
  }

  const vigente = t.estado === "vigente"
  const dur = duracion(t)
  const dia = diaTratamiento(t)
  const progreso = vigente ? Math.round((dia / Math.max(dur, 1)) * 100) : 100
  const tomas = [...tomasDelDia(t, HOY, registros), ...tomasDelDia(t, sumarDias(HOY, -1), registros).reverse()]
  const resumen = resumenTratamiento(t, registros)
  const recordatorio = t.recordatorio === "true"

  function confirmarFin() {
    guardarTratamiento(t!.id, { estado: "finalizado", finalizado_antes: "true", fecha_fin: HOY, recordatorio: "false" })
    router.replace(`/medicamentos/finalizado?id=${t!.id}`)
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Tratamiento"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIcono icono="more_horiz" etiqueta="Más opciones" onClick={() => setMenu(true)} />}
      />

      <section className="relative flex flex-col gap-4 overflow-hidden rounded-lg bg-oscuro p-4 movil-m:p-5">
        {/* Círculo decorativo de la tarjeta, como en la tarjeta de Inicio. */}
        <span aria-hidden className="absolute -top-16 -right-16 size-44 rounded-completo bg-primario" />
        <div className="relative flex items-center gap-3.5">
          <span className="grid size-13 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="medication" className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col">
            <h2 className="line-clamp-2 texto-titulo-tarjeta break-words text-superficie">{t.medicamento}</h2>
            <span className="truncate texto-etiqueta text-sobre-oscuro-secundario">{presentacionTratamiento(t)}</span>
          </div>
          <span className="shrink-0 self-start rounded-completo bg-acento px-2.5 py-1 texto-micro text-oscuro">
            {vigente ? "Vigente" : "Finalizado"}
          </span>
        </div>
        <div className="relative flex gap-2">
          <RasgoOscuro icono="schedule" texto={frecuenciaTratamiento(t)} />
          {dur > 0 && <RasgoOscuro icono="calendar_month" texto={`${dur} días`} />}
          {t.prescrito_por && <RasgoOscuro icono="description" texto="Fórmula" />}
        </div>
        <div className="relative flex flex-col gap-2">
          <div className="flex justify-between texto-etiqueta-fuerte text-superficie">
            <span>{vigente ? `Día ${dia} de ${dur}` : `${resumen.dias} de ${dur} días`}</span>
            <span className="text-sobre-oscuro-secundario">{progreso} %</span>
          </div>
          <span className="h-2 overflow-hidden rounded-completo bg-superficie">
            {/* El ancho es el progreso del tratamiento: un dato, no un valor de diseño. */}
            <span className="block h-full rounded-completo bg-primario" style={{ width: `${progreso}%` }} />
          </span>
        </div>
      </section>

      <div className="flex items-center justify-between">
        <h3 className="texto-titulo-seccion text-texto">Horarios de toma</h3>
        {vigente && (
          <Link href={`/medicamentos/horarios?id=${t.id}`} className="texto-etiqueta-fuerte text-primario">
            Editar
          </Link>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {t.horas.map((h) => (
          <span key={h} className="flex h-10 items-center gap-1.5 rounded-completo bg-primario px-4 texto-cuerpo-fuerte text-superficie">
            <Icono nombre="schedule" className="icono-s" />
            {h}
          </span>
        ))}
        {vigente && (
          <Link
            href={`/medicamentos/horarios?id=${t.id}`}
            className="flex h-10 items-center gap-1.5 rounded-completo border border-borde-fuerte bg-superficie px-4 texto-etiqueta-fuerte text-texto"
          >
            <Icono nombre="add" className="icono-s" />
            Agregar
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3 rounded-md bg-acento-suave px-4 py-3.5">
        <Icono nombre="notifications_active" className="icono-m text-primario" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="texto-cuerpo-fuerte text-texto">Recordatorio de toma</span>
          <span className="texto-etiqueta text-texto-secundario">{vigente ? "10 min antes de cada horario" : "Apagado: el tratamiento terminó"}</span>
        </span>
        <Interruptor
          etiqueta="Recordatorio de toma"
          activo={vigente && recordatorio}
          deshabilitado={!vigente}
          onCambio={(activo) => guardarTratamiento(t.id, { recordatorio: String(activo) })}
        />
      </div>

      {vigente ? (
        <>
          <div className="mt-1 flex items-center justify-between">
            <h3 className="texto-titulo-seccion text-texto">Tomas</h3>
            <span className="texto-micro text-texto-secundario">{diaCorto(HOY)}</span>
          </div>
          {tomas.length ? (
            <div className="flex flex-col gap-3">
              {tomas.map((x) => (
                <FilaTomaDetalle key={x.clave} toma={x} onOmitir={setOmitiendo} />
              ))}
            </div>
          ) : (
            <p className="texto-cuerpo text-texto-secundario">Hoy no hay tomas.</p>
          )}
        </>
      ) : (
        <>
          <h3 className="mt-1 texto-titulo-seccion text-texto">Resumen</h3>
          <Resumen dias={`${resumen.dias} de ${dur} días`} tomadas={`${resumen.tomadas} de ${resumen.total}`} omitidas={resumen.omitidas} />
        </>
      )}

      <Hoja abierta={menu} onCerrar={() => setMenu(false)} titulo="Opciones">
        <div className="flex flex-col gap-2.5">
          {vigente ? (
            <>
              <FilaOpcion borde icono="schedule" titulo="Editar horarios" href={`/medicamentos/horarios?id=${t.id}`} />
              <FilaOpcion
                borde
                tono="error"
                icono="event_busy"
                titulo="Finalizar tratamiento"
                detalle="Se apagan los recordatorios"
                onClick={() => {
                  setMenu(false)
                  setFinalizar(true)
                }}
              />
            </>
          ) : (
            <FilaOpcion
              borde
              icono="restart_alt"
              titulo="Reactivar"
              detalle="Empieza hoy con la misma duración"
              href={`/medicamentos/horarios?id=${t.id}&reactivar=1`}
            />
          )}
        </div>
      </Hoja>

      {/* G8 · Finalizar tratamiento */}
      <Dialogo
        abierto={finalizar}
        onCerrar={() => setFinalizar(false)}
        icono="event_busy"
        titulo="¿Finalizar este tratamiento?"
        mensaje="Se apagan los recordatorios y queda en Finalizados. El historial no se borra."
      >
        <Boton onClick={confirmarFin}>Sí, finalizar</Boton>
        <Boton variante="secundario" onClick={() => setFinalizar(false)}>
          Seguir con el tratamiento
        </Boton>
      </Dialogo>

      <HojaOmitir toma={omitiendo} onCerrar={() => setOmitiendo(null)} />
    </main>
  )
}

function RasgoOscuro({ icono, texto }: { icono: string; texto: string }) {
  return (
    <span className="flex size-19 shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-primario px-0.5 text-center text-superficie">
      <Icono nombre={icono} className="icono-m" />
      <span className="line-clamp-2 w-full texto-micro normal-case">{texto}</span>
    </span>
  )
}

/** Duración, tomas registradas y omitidas (G2 finalizado y G9). */
export function Resumen({ dias, tomadas, omitidas }: { dias: string; tomadas: string; omitidas: number }) {
  return (
    <dl className="flex flex-col gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4 movil-m:px-5">
      {[
        ["Duración", dias],
        ["Tomas registradas", tomadas],
        ["Omitidas", String(omitidas)],
      ].map(([etiqueta, valor]) => (
        <div key={etiqueta} className="flex items-baseline justify-between gap-4">
          <dt className="texto-cuerpo text-texto-secundario">{etiqueta}</dt>
          <dd className="texto-etiqueta-fuerte text-texto">{valor}</dd>
        </div>
      ))}
    </dl>
  )
}
