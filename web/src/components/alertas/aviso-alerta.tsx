"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { tituloAlertaVista, type AlertaVista } from "@/lib/alertas"
import type { Evento } from "@/lib/eventos"
import { HOY, diasEntre, fechaCorta, fechaLarga, sumarDias } from "@/lib/fecha"
import { nombreVacuna, type Alerta } from "@/lib/perfil"
import { posponerAlerta, useAlertas, type MascotaAlerta } from "@/lib/usar-alertas"

type AvisoAlertaProps = {
  alertas: Alerta[]
  eventos: Evento[]
  mascotas: MascotaAlerta[]
  marcas: Record<string, string>
}

const sinAnio = (iso: string) => fechaCorta(iso).replace(/ \d{4}$/, "")

/** J6 · Aviso de vacuna: así se ve la notificación que llega antes del vencimiento. */
export function AvisoAlerta({ alertas, eventos, mascotas, marcas }: AvisoAlertaProps) {
  const router = useRouter()
  const id = useSearchParams().get("id")
  const pendientes = useAlertas(alertas, eventos, mascotas, marcas)
    .filter((a) => a.grupo === "semana" || a.grupo === "vencida")
    .sort((a, b) => a.fecha_vencimiento.localeCompare(b.fecha_vencimiento))
  const alerta = pendientes.find((a) => a.id === id) ?? pendientes.at(-1)

  function masTarde() {
    // "Más tarde" = mañana a la misma hora (spec de J).
    posponerAlerta(alerta!.id, sumarDias(HOY, 1))
    toast.success("Te avisamos mañana")
    router.push("/")
  }

  return (
    <main className="flex flex-1 flex-col gap-5 px-pantalla pt-16">
      <div className="flex flex-col items-center gap-1 pb-4">
        <span className="texto-display text-texto">9:41</span>
        <span className="texto-cuerpo text-texto-secundario">{fechaLarga(HOY)}</span>
      </div>

      {alerta ? (
        <article className="flex flex-col gap-3 rounded-lg bg-superficie p-4 shadow-tarjeta">
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-xs bg-acento-suave text-primario">
              <Icono nombre="pets" className="icono-s" />
            </span>
            <span className="flex-1 texto-micro text-texto-secundario">Balto</span>
            <span className="texto-etiqueta text-texto-secundario">ahora</span>
          </div>
          <div className="flex flex-col gap-1">
            <h1 className="texto-cuerpo-fuerte text-texto">{tituloAviso(alerta)}</h1>
            <p className="texto-etiqueta text-texto-secundario">{detalleAviso(alerta)}</p>
          </div>
          <div className="flex gap-2.5 pt-1">
            <BotonEnlace href={`/alertas/detalle?id=${alerta.id}`} variante="suave" className="h-12">
              Ver alerta
            </BotonEnlace>
            <Boton variante="secundario" className="h-12" onClick={masTarde}>
              Más tarde
            </Boton>
          </div>
        </article>
      ) : (
        <Nota icono="notifications_off">No hay avisos pendientes esta semana.</Nota>
      )}

      <Nota icono="tune">Puedes cambiar cuándo te avisamos en Ajustes › Notificaciones.</Nota>

      <BarraAccion>
        <BotonEnlace href="/">Abrir la app</BotonEnlace>
      </BarraAccion>
    </main>
  )
}

function tituloAviso(a: AlertaVista) {
  const n = a.mascota.nombre
  switch (a.tipo) {
    case "refuerzo_vacuna":
      return `A ${n} le toca el refuerzo`
    case "proxima_desparasitacion":
      return `A ${n} le toca la desparasitación`
    case "control_examen":
      return `A ${n} le toca el control`
    case "control_peso":
      return `Es hora de pesar a ${n}`
    case "alimento_por_acabarse":
      return `Se acaba el alimento de ${n}`
  }
}

/** "Antirrábica · vence en 2 días (25 sep)". */
function detalleAviso(a: AlertaVista) {
  const dias = diasEntre(HOY, a.fecha_vencimiento)
  const que = a.tipo === "refuerzo_vacuna" && a.evento ? nombreVacuna(a.evento) : tituloAlertaVista(a)
  const cuando =
    dias < 0 ? `venció hace ${-dias} ${dias === -1 ? "día" : "días"}` : dias === 0 ? "vence hoy" : dias === 1 ? "vence mañana" : `vence en ${dias} días`
  return `${que} · ${cuando} (${sinAnio(a.fecha_vencimiento)})`
}
