"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { VisorSoporte } from "@/components/consulta/visor-soporte"
import { Dialogo } from "@/components/dialogo"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Rasgo } from "@/components/rasgo"
import { textoTamano } from "@/components/registro/bloque-soporte"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import {
  filasEvento,
  iconoEvento,
  lugarEvento,
  rasgosEvento,
  tituloEvento,
  type Evento,
  type Soporte,
} from "@/lib/eventos"
import { fechaCorta } from "@/lib/fecha"
import { avisarPronto } from "@/lib/pronto"
import { eliminarEvento } from "@/lib/registro-local"
import { useEventos } from "@/lib/usar-eventos"
import { cn } from "@/lib/utils"

/** D4 · Detalle de evento, con D5 (soporte) y D7 (eliminar). */
export function DetalleEvento({ eventos: base, dueno }: { eventos: Evento[]; dueno: string }) {
  const router = useRouter()
  const id = useSearchParams().get("id") ?? ""
  const evento = useEventos(base).find((e) => e.id === id)
  const [viendo, setViendo] = useState<Soporte | null>(null)
  const [menu, setMenu] = useState(false)
  const [confirmar, setConfirmar] = useState(false)

  function volver() {
    if (window.history.length > 1) router.back()
    else router.push("/linea-de-tiempo")
  }

  if (!evento) {
    return (
      <main className="flex flex-1 flex-col gap-6 px-pantalla pt-14">
        <Encabezado titulo="Detalle" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
        <Estado icono="search_off" titulo="No encontramos el evento" mensaje="Puede que se haya eliminado." />
        <BotonEnlace href="/linea-de-tiempo" variante="secundario">
          Ir a la línea de tiempo
        </BotonEnlace>
      </main>
    )
  }

  const soportes = evento.soportes ?? []
  const rasgos = rasgosEvento(evento)
  const titulo = tituloEvento(evento)

  function eliminar() {
    eliminarEvento(evento!.id)
    toast.success("Evento eliminado")
    router.replace("/linea-de-tiempo")
  }

  function descargarSoportes() {
    setMenu(false)
    const publicados = soportes.filter((s) => s.url)
    if (publicados.length === 0) {
      toast("No hay soportes para descargar")
      return
    }
    for (const s of publicados) {
      const enlace = document.createElement("a")
      enlace.href = s.url!
      enlace.download = s.nombre
      enlace.click()
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado
        titulo="Detalle"
        izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />}
        derecha={<BotonIcono icono="more_horiz" etiqueta="Más opciones" onClick={() => setMenu(true)} />}
      />

      <section className="flex flex-col gap-4 rounded-lg bg-primario p-5">
        <div className="flex items-center gap-3.5">
          <span className="grid size-11 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre={iconoEvento(evento)} className="icono-m" />
          </span>
          <div className="flex min-w-0 flex-col">
            <h2 className="texto-titulo-tarjeta break-words text-superficie">{titulo}</h2>
            <span className="texto-etiqueta text-sobre-oscuro-secundario">
              {[fechaCorta(evento.fecha), lugarEvento(evento)].filter(Boolean).join(" · ")}
            </span>
          </div>
        </div>
        {rasgos.length > 0 && (
          <div className="flex gap-2">
            {rasgos.map((r) => (
              <Rasgo key={r.icono + r.texto} icono={r.icono} texto={r.texto} alerta={r.icono === "error"} />
            ))}
          </div>
        )}
      </section>

      <dl className="flex flex-col gap-2.5 rounded-md border border-borde-fuerte bg-superficie px-4 py-3.5">
        {filasEvento(evento, dueno).map((f) => (
          <div key={f.etiqueta} className={cn("flex gap-4", f.largo ? "flex-col gap-0.5" : "items-baseline justify-between")}>
            <dt className="shrink-0 texto-etiqueta text-texto-secundario">{f.etiqueta}</dt>
            <dd className={cn("min-w-0 text-texto", f.largo ? "texto-etiqueta" : "text-right texto-etiqueta-fuerte")}>{f.valor}</dd>
          </div>
        ))}
      </dl>

      {soportes.map((s, i) => (
        <button
          key={`${s.nombre}-${i}`}
          type="button"
          onClick={() => setViendo(s)}
          className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5 text-left"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre={s.tipo === "pdf" ? "picture_as_pdf" : "image"} className="icono-m" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate texto-cuerpo-fuerte text-texto">{s.nombre}</span>
            <span className="texto-etiqueta text-texto-secundario">
              {s.tipo === "pdf" ? "PDF" : "Foto"} · {textoTamano(s.tamanoKb)}
            </span>
          </span>
          <Icono nombre="chevron_right" className="icono-m text-texto-secundario" />
        </button>
      ))}

      <div className="flex gap-2.5">
        <Boton variante="destructivo-contorno" onClick={() => setConfirmar(true)}>
          Eliminar
          <Icono nombre="delete" className="icono-s" />
        </Boton>
        <BotonEnlace href={`/evento/editar?id=${evento.id}`}>
          Editar
          <Icono nombre="edit" className="icono-s" />
        </BotonEnlace>
      </div>

      {viendo && <VisorSoporte soporte={viendo} onCerrar={() => setViendo(null)} />}

      {/* Menú ••• (spec de D): compartir el evento (L1) y descargar sus soportes. */}
      <Drawer open={menu} onOpenChange={setMenu}>
        <DrawerContent className="mx-auto max-w-app rounded-t-xl border-0 bg-superficie px-pantalla pt-3 pb-9">
          <span aria-hidden className="mx-auto mb-4 h-1.5 w-11 rounded-completo bg-acento" />
          <DrawerTitle className="mb-4 texto-titulo-tarjeta text-texto">Opciones</DrawerTitle>
          <div className="flex flex-col gap-2.5">
            <OpcionMenu
              icono="ios_share"
              titulo="Compartir este evento"
              onClick={() => {
                setMenu(false)
                avisarPronto("Compartir")
              }}
            />
            <OpcionMenu
              icono="download"
              titulo="Descargar soportes"
              detalle={soportes.length ? undefined : "Este evento no tiene soportes"}
              onClick={descargarSoportes}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* D7 · Eliminar evento */}
      <Dialogo
        abierto={confirmar}
        onCerrar={() => setConfirmar(false)}
        tono="destructivo"
        icono="delete"
        titulo="¿Eliminar este evento?"
        mensaje={`Se borrará «${titulo}»${soportes.length === 1 ? " y su soporte" : soportes.length > 1 ? " y sus soportes" : ""}. No se puede deshacer.`}
      >
        <Boton variante="destructivo" onClick={eliminar}>
          Sí, eliminar
        </Boton>
        <Boton variante="secundario" onClick={() => setConfirmar(false)}>
          Cancelar
        </Boton>
      </Dialogo>
    </main>
  )
}

function OpcionMenu({ icono, titulo, detalle, onClick }: { icono: string; titulo: string; detalle?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-3 rounded-md border border-borde bg-superficie p-3.5 text-left">
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="texto-cuerpo-fuerte text-texto">{titulo}</span>
        {detalle && <span className="texto-etiqueta text-texto-secundario">{detalle}</span>}
      </span>
      <Icono nombre="chevron_right" className="icono-m text-texto-secundario" />
    </button>
  )
}
