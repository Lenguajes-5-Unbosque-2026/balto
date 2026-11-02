"use client"

import { AccesosRapidos } from "@/components/inicio/accesos-rapidos"
import { EncabezadoInicio } from "@/components/inicio/encabezado-inicio"
import { SelectorMascotas } from "@/components/inicio/selector-mascotas"
import { TarjetaMascota } from "@/components/inicio/tarjeta-mascota"
import { TarjetaProximo } from "@/components/inicio/tarjeta-proximo"
import type { Evento } from "@/lib/eventos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { proximaAlerta, type Alerta, type PerfilMascota } from "@/lib/perfil"
import { useAlertas } from "@/lib/usar-alertas"
import { useEventos } from "@/lib/usar-eventos"

const SIN_MARCAS = {}

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
  // Sin las resueltas en J ni las de eventos eliminados en D7.
  const vigentes = useAlertas(alertas, base, mascotas, SIN_MARCAS).filter((a) => a.grupo !== "resuelta")
  const alerta = proximaAlerta(vigentes, mascota.id)

  return (
    <div className="flex flex-col gap-5 px-pantalla pt-12">
      <EncabezadoInicio nombre={dueno} />
      <SelectorMascotas mascotas={mascotas} activa={mascota} onCambio={cambiarMascota} />
      <TarjetaMascota mascota={mascota} eventos={eventos} />
      <TarjetaProximo alerta={alerta} evento={alerta?.evento} mascota={mascota.nombre} />
      <AccesosRapidos />
    </div>
  )
}
