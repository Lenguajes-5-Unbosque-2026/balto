import type { Metadata } from "next"

import { BandejaNotificaciones } from "@/components/cuenta/bandeja-notificaciones"
import { marcasDePlanes, mascotasAlerta } from "@/lib/alertas-servidor"
import { obtenerEventosDueno, obtenerPedidos, obtenerTodasAlertas } from "@/lib/datos"
import { datosMedicamentos } from "@/lib/medicamentos-servidor"

export const metadata: Metadata = { title: "Notificaciones · Balto" }

/** M9 · Notificaciones. Se abre con la campana de Inicio. */
export default function NotificacionesPage() {
  return (
    <BandejaNotificaciones
      alertas={obtenerTodasAlertas()}
      eventos={obtenerEventosDueno()}
      mascotas={mascotasAlerta()}
      marcas={marcasDePlanes()}
      pedidos={obtenerPedidos()}
      {...datosMedicamentos()}
    />
  )
}
