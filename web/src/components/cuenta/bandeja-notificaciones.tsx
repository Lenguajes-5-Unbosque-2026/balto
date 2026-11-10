"use client"

import Link from "next/link"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Nota } from "@/components/nota"
import { ICONOS_ALERTA, tituloAlertaVista } from "@/lib/alertas"
import type { Pedido } from "@/lib/datos"
import type { Evento } from "@/lib/eventos"
import { diasEntre, hoy } from "@/lib/fecha"
import { tomasDelDia } from "@/lib/medicamentos"
import type { Alerta } from "@/lib/perfil"
import { useAlertas, type MascotaAlerta } from "@/lib/usar-alertas"
import { marcarLeidas, useLeidas } from "@/lib/usar-cuenta"
import { useMedicamentos, type DatosMedicamentos } from "@/lib/usar-medicamentos"
import { useVolver } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type BandejaProps = DatosMedicamentos & {
  alertas: Alerta[]
  eventos: Evento[]
  mascotas: MascotaAlerta[]
  marcas: Record<string, string>
  pedidos: Pedido[]
}

type Notificacion = { id: string; icono: string; titulo: string; detalle: string; href: string; orden: string }

/** "hace 1 h", "ayer", "hace 3 días": cuándo llegó el aviso. */
function hace(fecha: string) {
  const dias = diasEntre(fecha, hoy())
  if (dias <= 0) return "hoy"
  return dias === 1 ? "ayer" : `hace ${dias} días`
}

/** M9 · Notificaciones: los avisos enviados de alertas, tomas y pedidos, con los no leídos resaltados. */
export function BandejaNotificaciones({ alertas, eventos, mascotas, marcas, pedidos, ...meds }: BandejaProps) {
  const volver = useVolver("/")
  const leidas = useLeidas()
  const [filtro, setFiltro] = useState<"todas" | "sin-leer">("todas")
  const pendientes = useAlertas(alertas, eventos, mascotas, marcas).filter((a) => a.grupo === "semana" || a.grupo === "vencida")
  const { tratamientos, registros } = useMedicamentos(meds)

  const lista: Notificacion[] = [
    ...pendientes.map((a) => {
      const dias = diasEntre(hoy(), a.fecha_vencimiento)
      const cuando = dias < 0 ? `Venció hace ${-dias} días` : dias === 0 ? "Vence hoy" : dias === 1 ? "Vence mañana" : `Vence en ${dias} días`
      return {
        id: `alerta-${a.id}`,
        icono: ICONOS_ALERTA[a.tipo],
        titulo: tituloAlertaVista(a),
        detalle: `${a.mascota.nombre} · ${cuando}`,
        href: `/alertas/detalle?id=${a.id}`,
        orden: a.fecha_vencimiento,
      }
    }),
    ...tratamientos
      .filter((t) => t.estado === "vigente" && t.recordatorio === "true")
      .flatMap((t) => tomasDelDia(t, hoy(), registros).filter((x) => x.estado !== "tomada"))
      .map((x) => ({
        id: `toma-${x.clave}`,
        icono: "medication",
        titulo: `Dosis de las ${x.hora}`,
        detalle: `${x.tratamiento.medicamento.split(" ")[0]} · hoy`,
        href: `/medicamentos/detalle?id=${x.tratamiento.id}`,
        orden: hoy(),
      })),
    ...pedidos
      .filter((p) => p.estado_entrega === "en_camino" || p.estado_pago === "rechazado")
      .map((p) => ({
        id: `pedido-${p.id}`,
        icono: p.estado_pago === "rechazado" ? "credit_card_off" : "local_shipping",
        titulo: p.estado_pago === "rechazado" ? "Pago rechazado" : "Tu pedido salió",
        detalle: `Pedido #${p.numero} · ${hace(p.fecha)}`,
        href: `/tienda/pedido?id=${p.id}`,
        orden: p.fecha,
      })),
  ]
  const sinLeer = lista.filter((n) => !leidas[n.id])
  const visibles = filtro === "todas" ? lista : sinLeer

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo="Notificaciones"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIcono icono="done_all" etiqueta="Marcar todas como leídas" onClick={() => marcarLeidas(lista.map((n) => n.id))} />}
      />
      <div className="flex gap-2">
        <Chip texto="Todas" icono="apps" activo={filtro === "todas"} onClick={() => setFiltro("todas")} />
        <Chip texto={`Sin leer (${sinLeer.length})`} icono="mark_email_unread" activo={filtro === "sin-leer"} onClick={() => setFiltro("sin-leer")} />
      </div>

      {visibles.length === 0 ? (
        <div className="pt-6">
          <Estado icono="notifications_off" titulo="No tienes notificaciones" mensaje={filtro === "sin-leer" ? "Ya viste todo lo que te avisamos." : undefined} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visibles.map((n) => (
            <FilaOpcion
              key={n.id}
              icono={n.icono}
              titulo={n.titulo}
              detalle={n.detalle}
              href={n.href}
              onClick={() => marcarLeidas([n.id])}
              className={cn(!leidas[n.id] && "border border-primario")}
            />
          ))}
        </div>
      )}

      <Nota icono="tune">
        Elige qué avisos quieres recibir en{" "}
        <Link href="/ajustes/notificaciones" className="texto-etiqueta-fuerte text-primario">
          Ajustes › Notificaciones
        </Link>
        .
      </Nota>

      <BarraAccion>
        <BotonEnlace href="/alertas">Ver todas las alertas</BotonEnlace>
      </BarraAccion>
    </main>
  )
}
