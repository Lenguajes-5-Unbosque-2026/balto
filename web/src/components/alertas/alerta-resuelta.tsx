"use client"

import { BotonIconoEnlace } from "@/components/boton-icono"
import { useSearchParams } from "next/navigation"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Nota } from "@/components/nota"
import { TarjetaEvento } from "@/components/tarjeta-evento"
import { queSeRegistra, type AlertaVista } from "@/lib/alertas"
import { pesoAnterior, type Evento } from "@/lib/eventos"
import { fechaCorta, sumarDias } from "@/lib/fecha"
import type { Alerta } from "@/lib/perfil"
import { useAlertas, type MascotaAlerta } from "@/lib/usar-alertas"
import { useEventos } from "@/lib/usar-eventos"

type AlertaResueltaProps = {
  alertas: Alerta[]
  eventos: Evento[]
  mascotas: MascotaAlerta[]
  marcas: Record<string, string>
  anticipacion: number
}

/** J5 · Alerta resuelta: se muestra en lugar de E9 al guardar desde "Marcar resuelta". */
export function AlertaResuelta({ alertas, eventos: base, mascotas, marcas, anticipacion }: AlertaResueltaProps) {
  const parametros = useSearchParams()
  const eventos = useEventos(base)
  const alerta = useAlertas(alertas, base, mascotas, marcas).find((a) => a.id === parametros.get("id"))
  const evento = eventos.find((e) => e.id === parametros.get("evento"))
  const proxima = evento && (evento.proximo_refuerzo || evento.proxima_dosis || evento.proximo_control)

  return (
    <main className="flex flex-1 flex-col gap-5 px-pantalla pt-14">
      <Encabezado titulo="Alerta" derecha={<BotonIconoEnlace href="/alertas" icono="close" etiqueta="Cerrar" />} />
      <div className="pt-6">
        <Estado tono="exito" icono="check_circle" titulo="Alerta resuelta" mensaje={mensaje(alerta, evento, !!proxima)} />
      </div>
      {evento && <TarjetaEvento evento={evento} href={`/evento?id=${evento.id}`} anterior={pesoAnterior(evento, eventos)} />}
      {proxima && anticipacion > 0 && (
        <Nota icono="notifications">
          Te avisaremos {anticipacion} días antes {evento.tipo === "desparasitacion" ? "de la próxima dosis" : evento.tipo === "examen" ? "del control" : "del refuerzo"}, el{" "}
          {fechaCorta(sumarDias(proxima, -anticipacion))}.
        </Nota>
      )}
      <BarraAccion>
        <BotonEnlace href="/alertas">Volver a alertas</BotonEnlace>
        {/* Con el texto del botón principal no cabe en dos columnas de 390 px. */}
        <BotonEnlace href="/linea-de-tiempo" variante="secundario" className="px-2 texto-cuerpo-fuerte">
          Ver línea de tiempo
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}

function mensaje(alerta: AlertaVista | undefined, evento: Evento | undefined, conProxima: boolean) {
  const que = alerta ? queSeRegistra(alerta) : "El evento"
  const quien = alerta ? ` de ${alerta.mascota.nombre}` : ""
  if (!evento) return `Marcamos la alerta${quien} como resuelta.`
  const proximo = evento.tipo === "desparasitacion" ? "la próxima dosis" : evento.tipo === "examen" ? "el próximo control" : "el próximo refuerzo"
  const genero = /^La /.test(que) ? "registrada" : "registrado"
  return conProxima ? `${que} quedó ${genero} y programamos ${proximo}.` : `${que} quedó ${genero} en la línea de tiempo${quien}.`
}
