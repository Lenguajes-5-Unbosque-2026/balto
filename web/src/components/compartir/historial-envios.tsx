"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { cuandoSeEnvio, estadoEnlace, paginasPdf, seccionesDe, textoSecciones, textoVence } from "@/lib/compartir"
import type { Envio } from "@/lib/datos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { guardarEnvio, useEnvios } from "@/lib/usar-envios"
import { useVolver } from "@/lib/usar-salud"

const CANALES: Record<string, [string, string]> = {
  whatsapp: ["chat", "PDF por WhatsApp"],
  correo: ["mail", "PDF por correo"],
  imprimir: ["print", "PDF impreso"],
  guardar: ["download", "PDF guardado"],
  compartir: ["ios_share", "PDF compartido"],
}

/** L8 · Lo que compartí: PDF enviados y enlaces de la mascota activa; el ícono desactiva un enlace activo. */
export function HistorialEnvios({ mascotas, envios: base }: { mascotas: { id: string; nombre: string }[]; envios: Envio[] }) {
  const volver = useVolver("/vista-rapida")
  const [mascota] = useMascotaActiva(mascotas)
  const [filtro, setFiltro] = useState<"todo" | "activos">("todo")
  const envios = useEnvios(base).filter((e) => e.mascota_id === mascota.id)
  const lista = filtro === "todo" ? envios : envios.filter((e) => e.formato === "enlace" && estadoEnlace(e) === "activo")

  function desactivar(e: Envio) {
    guardarEnvio(e.id, { activo: "false" })
    toast.success("Enlace desactivado", { description: "Quien lo abra verá que ya no sirve." })
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Lo que compartí" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="flex gap-2">
        <Chip texto="Todo" icono="apps" activo={filtro === "todo"} onClick={() => setFiltro("todo")} />
        <Chip texto="Enlaces activos" icono="mark_email_read" activo={filtro === "activos"} onClick={() => setFiltro("activos")} />
      </div>

      {lista.length === 0 ? (
        <div className="pt-6">
          <Estado icono="share" titulo="Nada por aquí todavía" mensaje={`Lo que compartas de ${mascota.nombre} aparecerá en esta lista.`} />
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((e) =>
            e.formato === "enlace" ? (
              <div key={e.id} className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
                  <Icono nombre="link" className="icono-m" />
                </span>
                <Link href={`/p/${e.token}?vista=previa`} className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate texto-cuerpo-fuerte text-texto">Enlace · {textoVence(e)}</span>
                  <span className="truncate texto-etiqueta text-texto-secundario">{textoSecciones(seccionesDe(e.secciones))}</span>
                </Link>
                {estadoEnlace(e) === "activo" && (
                  <button type="button" aria-label="Desactivar enlace" onClick={() => desactivar(e)} className="grid size-9 shrink-0 place-items-center text-texto-secundario">
                    <Icono nombre="link_off" className="icono-m" />
                  </button>
                )}
              </div>
            ) : (
              <div key={e.id} className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
                <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
                  <Icono nombre={(CANALES[e.canal] ?? CANALES.compartir)[0]} className="icono-m" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate texto-cuerpo-fuerte text-texto">{(CANALES[e.canal] ?? CANALES.compartir)[1]}</span>
                  <span className="truncate texto-etiqueta text-texto-secundario">
                    {e.destinatario
                      ? `${e.destinatario} · ${cuandoSeEnvio(e.fecha)}`
                      : `${cuandoSeEnvio(e.fecha).replace(/^h/, "H")} · ${paginasPdf(seccionesDe(e.secciones))} páginas`}
                  </span>
                </span>
              </div>
            ),
          )}
        </div>
      )}

      <Nota>Toca el ícono de un enlace activo para desactivarlo.</Nota>

      <BarraAccion>
        <BotonEnlace href="/compartir">Compartir de nuevo</BotonEnlace>
      </BarraAccion>
    </main>
  )
}
