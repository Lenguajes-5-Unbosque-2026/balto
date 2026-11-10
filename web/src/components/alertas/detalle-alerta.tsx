"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

import { useAccionesAlerta } from "@/components/alertas/acciones"
import { HojaPosponer } from "@/components/alertas/hoja-posponer"
import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Rasgo } from "@/components/rasgo"
import {
  ICONOS_ALERTA,
  detalleResolver,
  frecuenciaAlerta,
  textoUltimaVez,
  tituloAlertaVista,
  veterinariaAlerta,
  type AlertaVista,
} from "@/lib/alertas"
import { puedeVolver } from "@/lib/navegacion"
import type { Evento } from "@/lib/eventos"
import { diasEntre, fechaCorta, hoy } from "@/lib/fecha"
import { nombreVacuna, type Alerta } from "@/lib/perfil"
import { useAlertas, type MascotaAlerta } from "@/lib/usar-alertas"

type DetalleAlertaProps = {
  alertas: Alerta[]
  eventos: Evento[]
  mascotas: MascotaAlerta[]
  marcas: Record<string, string>
}

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/** J2 · Detalle de alerta y J4 · Alerta vencida (/alertas/detalle?id=a08). */
export function DetalleAlerta({ alertas, eventos, mascotas, marcas }: DetalleAlertaProps) {
  const router = useRouter()
  const id = useSearchParams().get("id") ?? ""
  const alerta = useAlertas(alertas, eventos, mascotas, marcas).find((a) => a.id === id)
  const [posponiendo, setPosponiendo] = useState(false)
  const acciones = useAccionesAlerta()

  function volver() {
    if (puedeVolver()) router.back()
    else router.push("/alertas")
  }

  const encabezado = <Encabezado titulo="Alerta" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />

  if (!alerta) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        {encabezado}
        <Estado icono="search_off" titulo="No encontramos la alerta" mensaje="Puede que se haya eliminado el evento que la creó." />
        <BotonEnlace href="/alertas" variante="secundario">
          Ir a alertas
        </BotonEnlace>
      </main>
    )
  }

  if (alerta.grupo === "resuelta") {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        {encabezado}
        <Estado
          tono="exito"
          icono="task_alt"
          titulo="Alerta resuelta"
          mensaje={`${tituloAlertaVista(alerta)} de ${alerta.mascota.nombre} se resolvió el ${fechaCorta(alerta.fecha_resuelta ?? hoy())}.`}
        />
        {alerta.evento_resolucion_id && (
          <BotonEnlace href={`/evento?id=${alerta.evento_resolucion_id}`} variante="secundario">
            Ver el evento
          </BotonEnlace>
        )}
      </main>
    )
  }

  const opciones = (
    <Opciones alerta={alerta} vencida={alerta.grupo === "vencida"} acciones={acciones} onPosponer={() => setPosponiendo(true)} />
  )

  if (alerta.grupo === "vencida") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado}
        <div className="pt-4">
          <Estado tono="error" icono="error" titulo={tituloVencida(alerta)} mensaje={mensajeVencida(alerta)} />
        </div>
        {alerta.tipo === "refuerzo_vacuna" && alerta.evento && /antirr/i.test(nombreVacuna(alerta.evento)) && (
          <Nota tono="error" icono="gavel">
            La antirrábica es obligatoria en Colombia (Ley 576).
          </Nota>
        )}
        {opciones}
        <BarraAccion>
          <Boton onClick={() => acciones.resolver(alerta)}>{alerta.tipo === "alimento_por_acabarse" ? "Marcar comprado" : "Marcar resuelta"}</Boton>
          {alerta.tipo === "alimento_por_acabarse" ? (
            <Boton variante="secundario" onClick={() => acciones.comprar(alerta)}>
              Comprar
            </Boton>
          ) : (
            <Boton variante="secundario" onClick={() => acciones.agendar(alerta)}>
              Agendar cita
            </Boton>
          )}
        </BarraAccion>
        {acciones.hojaResolver}
      </main>
    )
  }

  const dias = diasEntre(hoy(), alerta.fecha_vencimiento)
  const cuando = dias === 0 ? "hoy" : dias === 1 ? "mañana" : `en ${dias} días`
  const frecuencia = frecuenciaAlerta(alerta)
  const veterinaria = veterinariaAlerta(alerta)

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      {encabezado}
      <section className="flex flex-col gap-4 rounded-lg bg-oscuro p-4 movil-m:p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-sm bg-acento-suave text-oscuro">
            <Icono nombre={ICONOS_ALERTA[alerta.tipo]} className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="texto-titulo-tarjeta break-words text-superficie">{tituloAlertaVista(alerta)}</h2>
            <span className="texto-etiqueta text-sobre-oscuro-secundario">
              {alerta.mascota.nombre} · vence el {sinAnio(alerta.fecha_vencimiento)} ({cuando})
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Rasgo icono="calendar_today" texto={sinAnio(alerta.fecha_vencimiento)} />
          {frecuencia && <Rasgo icono="history" texto={frecuencia} />}
          {veterinaria && <Rasgo icono="local_hospital" texto={veterinaria} />}
        </div>
      </section>

      {textoUltimaVez(alerta) && <p className="texto-cuerpo text-texto">{textoUltimaVez(alerta)}</p>}
      {alerta.pospuesta && (
        <Nota icono="snooze">Pospusiste el aviso al {fechaCorta(alerta.pospuesta)}. El vencimiento sigue siendo el {sinAnio(alerta.fecha_vencimiento)}.</Nota>
      )}

      <h3 className="mt-1 texto-titulo-seccion font-semibold text-texto">¿Qué quieres hacer?</h3>
      {opciones}

      <HojaPosponer alertaId={posponiendo ? alerta.id : null} onCerrar={() => setPosponiendo(false)} />
      {acciones.hojaResolver}
    </main>
  )
}

type OpcionesProps = {
  alerta: AlertaVista
  vencida: boolean
  acciones: ReturnType<typeof useAccionesAlerta>
  onPosponer: () => void
}

/** "¿Qué quieres hacer?": resolver, agendar, comprar y posponer (J4 sin posponer). */
function Opciones({ alerta: a, vencida, acciones, onPosponer }: OpcionesProps) {
  const esVacuna = a.tipo === "refuerzo_vacuna"
  const esAlimento = a.tipo === "alimento_por_acabarse"
  return (
    <div className="flex flex-col gap-3">
      <FilaOpcion
        borde={!vencida}
        tono="exito"
        icono="check_circle"
        titulo={esAlimento ? "Marcar comprado" : "Marcar resuelta"}
        detalle={detalleResolver(a)}
        onClick={() => acciones.resolver(a)}
      />
      {!esAlimento && a.tipo !== "control_peso" && (
        <FilaOpcion borde={!vencida} icono="calendar_month" titulo="Agendar cita" detalle="Buscar veterinaria" onClick={() => acciones.agendar(a)} />
      )}
      {(esVacuna || esAlimento) && (
        <FilaOpcion
          borde={!vencida}
          icono={vencida ? "shopping_cart" : "storefront"}
          titulo={esVacuna ? "Comprar la vacuna" : "Comprar alimento"}
          detalle={esVacuna ? (vencida ? "Con aplicación incluida" : "Con aplicación en veterinaria aliada") : "Ver alimentos en la Tienda"}
          onClick={() => acciones.comprar(a)}
        />
      )}
      {!vencida && <FilaOpcion borde icono="snooze" titulo="Posponer aviso" onClick={onPosponer} />}
    </div>
  )
}

/** "Refuerzo antirrábica vencido", "Desparasitación interna vencida". */
function tituloVencida(a: AlertaVista) {
  const titulo = tituloAlertaVista(a)
  if (a.tipo === "alimento_por_acabarse") return "Se acabó el alimento"
  return `${titulo} ${a.tipo === "proxima_desparasitacion" ? "vencida" : "vencido"}`
}

/** "Venció hace 3 días, el 25 sep. Agenda la aplicación pronto." */
function mensajeVencida(a: AlertaVista) {
  const dias = -diasEntre(hoy(), a.fecha_vencimiento)
  const hace = `Venció hace ${dias} ${dias === 1 ? "día" : "días"}, el ${sinAnio(a.fecha_vencimiento)}.`
  const que = {
    refuerzo_vacuna: "Agenda la aplicación pronto.",
    proxima_desparasitacion: "Aplica la dosis pronto.",
    control_examen: "Agenda el control pronto.",
    control_peso: `Pesa a ${a.mascota.nombre} y regístralo.`,
    alimento_por_acabarse: "Compra una bolsa nueva pronto.",
  }[a.tipo]
  return `${hace} ${que}`
}
