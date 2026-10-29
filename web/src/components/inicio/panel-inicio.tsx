"use client"

import { AccesosRapidos } from "@/components/inicio/accesos-rapidos"
import { EncabezadoInicio } from "@/components/inicio/encabezado-inicio"
import { SelectorMascotas } from "@/components/inicio/selector-mascotas"
import { TarjetaMascota } from "@/components/inicio/tarjeta-mascota"
import { TarjetaProximo } from "@/components/inicio/tarjeta-proximo"
import type { Evento } from "@/lib/eventos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { proximaAlerta, type Alerta, type PerfilMascota } from "@/lib/perfil"
import { useEventos } from "@/lib/usar-eventos"

type PanelInicioProps = {
  dueno: string
  mascotas: PerfilMascota[]
  eventos: Evento[]
  alertas: Alerta[]
}

/** Inicio: saludo, mascota activa, lo próximo que vence y accesos rápidos. */
export function PanelInicio({ dueno, mascotas, eventos: base, alertas }: PanelInicioProps) {
  const [mascota, cambiarMascota] = useMascotaActiva(mascotas)
  const eventos = useEventos(base).filter((e) => e.mascota_id === mascota.id)
  // Si se eliminó el evento que generó la alerta, la alerta también se va (spec de D).
  const vigentes = alertas.filter((a) => !a.evento_id || eventos.some((e) => e.id === a.evento_id))
  const alerta = proximaAlerta(vigentes, mascota.id)
  const eventoAlerta = alerta && eventos.find((e) => e.id === alerta.evento_id)

  return (
    <div className="flex flex-col gap-5 px-6 pt-12">
      <EncabezadoInicio nombre={dueno} />
      <SelectorMascotas mascotas={mascotas} activa={mascota} onCambio={cambiarMascota} />
      <TarjetaMascota mascota={mascota} eventos={eventos} />
      <TarjetaProximo alerta={alerta} evento={eventoAlerta} mascota={mascota.nombre} />
      <AccesosRapidos />
    </div>
  )
}
