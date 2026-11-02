"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace, botonVariants } from "@/components/boton"
import { BotonIcono, BotonIconoEnlace } from "@/components/boton-icono"
import { CalendarioMes } from "@/components/calendario-mes"
import { Dialogo } from "@/components/dialogo"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Rasgo } from "@/components/rasgo"
import type { Cita, Veterinaria } from "@/lib/datos"
import { veterinariaCorta } from "@/lib/eventos"
import { HOY, fechaCorta, fechaLarga } from "@/lib/fecha"
import { hora12 } from "@/lib/medicamentos"
import { archivoIcs, distanciaKm, iconoServicio, puntoDe, rutaMapa, textoKm } from "@/lib/proveedores"
import { guardarCita, puntoReferencia, useCitas, useUbicacion } from "@/lib/usar-proveedores"
import { useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type CitasProps = { proveedores: Veterinaria[]; mascotas: { id: string; nombre: string }[]; citas: Cita[] }

/** "Jueves 25 de septiembre, 10:00 a. m.". */
const cuandoLargo = (c: Cita) => `${fechaLarga(c.fecha_hora.slice(0, 10)).replace(",", "")}, ${hora12(c.fecha_hora.slice(11))}`
/** "Jue 25 · 10:00". */
const cuandoCorto = (c: Cita) => `${fechaLarga(c.fecha_hora.slice(0, 10)).slice(0, 3)} ${Number(c.fecha_hora.slice(8, 10))} · ${c.fecha_hora.slice(11)}`

function Datos({ filas }: { filas: [string, string][] }) {
  return (
    <dl className="flex flex-col gap-2.5 rounded-lg border border-borde-fuerte bg-superficie px-4 py-4 movil-m:px-5">
      {filas.map(([e, v]) => (
        <div key={e} className="flex items-baseline justify-between gap-4">
          <dt className="shrink-0 texto-cuerpo text-texto-secundario">{e}</dt>
          <dd className="min-w-0 truncate text-right texto-etiqueta-fuerte text-texto">{v}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Descarga la cita como evento de calendario (.ics), con recordatorio un día antes. */
function descargarIcs(c: Cita, v: Veterinaria, mascota: string) {
  const enlace = document.createElement("a")
  enlace.href = URL.createObjectURL(new Blob([archivoIcs(c, v, mascota)], { type: "text/calendar" }))
  enlace.download = `cita_${mascota.toLowerCase()}_${c.fecha_hora.slice(0, 10)}.ics`
  enlace.click()
  URL.revokeObjectURL(enlace.href)
}

/** K9 · Cita agendada (/veterinarias/agendada?id=…). */
export function CitaAgendada({ proveedores, mascotas, citas: base }: CitasProps) {
  const id = useSearchParams().get("id")
  const c = useCitas(base).find((x) => x.id === id)
  const v = proveedores.find((x) => x.id === c?.proveedor_id)
  const ref = puntoReferencia(useUbicacion())
  const mascota = mascotas.find((m) => m.id === c?.mascota_id)?.nombre ?? ""

  if (!c || !v) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-pantalla">
        <Estado icono="search_off" titulo="No encontramos la cita" />
        <BotonEnlace href="/calendario" variante="secundario">
          Ver calendario
        </BotonEnlace>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Cita" derecha={<BotonIconoEnlace href="/calendario" icono="close" etiqueta="Cerrar" />} />
      <div className="pt-4">
        <Estado tono="exito" icono="event_available" titulo="Cita agendada" mensaje={cuandoLargo(c)} />
      </div>
      <Datos
        filas={[
          ["Veterinaria", veterinariaCorta(v.nombre)],
          ["Servicio", c.servicio],
          ["Mascota", mascota],
          ["Dirección", v.direccion],
        ]}
      />
      <FilaOpcion icono="calendar_add_on" titulo="Agregar al calendario" detalle="Recordatorio 1 día antes" onClick={() => descargarIcs(c, v, mascota)} />
      <a href={rutaMapa(v)} target="_blank" rel="noreferrer" className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
          <Icono nombre="directions" className="icono-m" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="texto-cuerpo-fuerte text-texto">Cómo llegar</span>
          <span className="texto-etiqueta text-texto-secundario">{textoKm(distanciaKm(ref, puntoDe(v)))}</span>
        </span>
        <Icono nombre="chevron_right" className="icono-m text-texto-secundario" />
      </a>
      <BarraAccion>
        <BotonEnlace href="/calendario">Ver calendario</BotonEnlace>
        <BotonEnlace href={`/veterinarias/ficha?id=${v.id}`} variante="secundario">
          Ver la clínica
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}

const ESTADOS: Record<Cita["estado"], { texto: string; icono: string; tono: "exito" | "alerta" | "neutro" }> = {
  confirmada: { texto: "Confirmada", icono: "check_circle", tono: "exito" },
  por_confirmar: { texto: "Por confirmar", icono: "schedule", tono: "neutro" },
  cancelada: { texto: "Cancelada", icono: "cancel", tono: "alerta" },
  realizada: { texto: "Realizada", icono: "task_alt", tono: "exito" },
}

/** K11 · Detalle de la cita, con reprogramar y cancelar (/veterinarias/cita?id=ci03). */
export function DetalleCita({ proveedores, mascotas, citas: base }: CitasProps) {
  const router = useRouter()
  const volver = useVolver("/calendario")
  const id = useSearchParams().get("id")
  const c = useCitas(base).find((x) => x.id === id)
  const v = proveedores.find((x) => x.id === c?.proveedor_id)
  const ref = puntoReferencia(useUbicacion())
  const [cancelar, setCancelar] = useState(false)
  const mascota = mascotas.find((m) => m.id === c?.mascota_id)?.nombre ?? ""

  if (!c || !v) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Cita" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos la cita" />
      </main>
    )
  }

  const estado = ESTADOS[c.estado]
  const activa = c.estado === "confirmada" || c.estado === "por_confirmar"
  const fecha = c.fecha_hora.slice(0, 10)

  async function compartir() {
    const texto = `${c!.servicio} de ${mascota} en ${v!.nombre}: ${cuandoLargo(c!)}. ${v!.direccion}.`
    if (navigator.share) {
      try {
        await navigator.share({ title: "Cita en Balto", text: texto })
      } catch {
        // Se cerró el menú de compartir.
      }
    } else {
      await navigator.clipboard?.writeText(texto)
      toast.success("Datos de la cita copiados")
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo="Cita"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIcono icono="ios_share" etiqueta="Compartir la cita" onClick={compartir} />}
      />
      <section className="flex flex-col gap-4 rounded-lg border border-borde-fuerte bg-superficie p-4 movil-m:p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre={iconoServicio(c.servicio)} className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h1 className="texto-titulo-tarjeta break-words text-texto">
              {c.servicio} · {mascota}
            </h1>
            <span className="texto-etiqueta text-texto-secundario">
              {fechaLarga(fecha).slice(0, 3)} {fechaCorta(fecha).replace(/ \d{4}$/, "")} · {hora12(c.fecha_hora.slice(11))}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Rasgo icono={estado.icono} texto={estado.texto} exito={estado.tono === "exito"} alerta={estado.tono === "alerta"} />
          <Rasgo icono="near_me" texto={textoKm(distanciaKm(ref, puntoDe(v)))} />
          <Rasgo icono="schedule" texto={`${c.duracion_min || 30} min`} />
        </div>
      </section>
      <Datos
        filas={[
          ["Veterinaria", veterinariaCorta(v.nombre)],
          ["Dirección", v.direccion],
          ["Teléfono", v.telefono],
        ]}
      />
      {activa && fecha >= HOY && (
        <>
          <FilaOpcion icono="edit_calendar" titulo="Reprogramar" detalle="Elegir otra fecha" href={`/veterinarias/agendar?cita=${c.id}`} />
          <FilaOpcion icono="cancel" titulo="Cancelar la cita" detalle="Te pedimos confirmarlo" onClick={() => setCancelar(true)} />
        </>
      )}
      <BarraAccion>
        <a href={rutaMapa(v)} target="_blank" rel="noreferrer" className={cn("inline-flex items-center justify-center", botonVariants())}>
          Cómo llegar
        </a>
        <a href={`tel:${v.telefono.replace(/\s/g, "")}`} className={cn("inline-flex items-center justify-center", botonVariants({ variante: "secundario" }))}>
          Llamar
        </a>
      </BarraAccion>
      <Dialogo
        abierto={cancelar}
        onCerrar={() => setCancelar(false)}
        tono="destructivo"
        icono="event_busy"
        titulo="¿Cancelar la cita?"
        mensaje={`${c.servicio} de ${mascota} el ${cuandoLargo(c).toLowerCase()}.`}
      >
        <Boton
          variante="destructivo"
          onClick={() => {
            guardarCita(c.id, { estado: "cancelada" })
            setCancelar(false)
            toast.success("Cita cancelada")
            router.replace("/calendario")
          }}
        >
          Sí, cancelar
        </Boton>
        <Boton variante="secundario" onClick={() => setCancelar(false)}>
          Volver
        </Boton>
      </Dialogo>
    </main>
  )
}

/** K6 · Calendario unificado: las citas de todas las mascotas. */
export function CalendarioCitas({ proveedores, mascotas, citas: base }: CitasProps) {
  const volver = useVolver("/")
  const citas = useCitas(base).filter((c) => c.estado !== "cancelada")
  const [mes, setMes] = useState(`${HOY.slice(0, 7)}-01`)
  const [dia, setDia] = useState<string | null>(null)
  const conCita = new Set(citas.map((c) => c.fecha_hora.slice(0, 10)))
  const lista = dia ? citas.filter((c) => c.fecha_hora.startsWith(dia)) : citas.filter((c) => c.fecha_hora.slice(0, 10) >= HOY)

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Calendario"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIconoEnlace href="/veterinarias" icono="add" etiqueta="Agendar cita" />}
      />
      <CalendarioMes mes={mes} onMes={setMes} seleccionado={dia ?? HOY} onElegir={(f) => setDia(f === dia ? null : f)} marcados={conCita} />
      <h2 className="texto-titulo-seccion text-texto">{dia ? `Citas del ${fechaCorta(dia)}` : "Próximas citas"}</h2>
      {lista.length === 0 ? (
        <div className="flex flex-col gap-4 pt-2">
          <Estado icono="event_available" titulo={dia ? "Sin citas ese día" : "No tienes citas próximas"} />
          <BotonEnlace href="/veterinarias" variante="secundario">
            Agendar cita
          </BotonEnlace>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((c) => {
            const v = proveedores.find((x) => x.id === c.proveedor_id)
            const mascota = mascotas.find((m) => m.id === c.mascota_id)?.nombre
            return (
              <FilaOpcion
                key={c.id}
                borde
                icono={iconoServicio(c.servicio)}
                titulo={cuandoCorto(c)}
                detalle={[c.servicio, mascota, v && veterinariaCorta(v.nombre), c.estado === "por_confirmar" && "por confirmar"].filter(Boolean).join(" · ")}
                href={`/veterinarias/cita?id=${c.id}`}
              />
            )
          })}
        </div>
      )}
    </main>
  )
}
