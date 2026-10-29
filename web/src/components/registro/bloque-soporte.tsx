"use client"

import { useEffect, useRef, useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { Estado } from "@/components/estado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import type { Soporte } from "@/lib/eventos"
import { cn } from "@/lib/utils"

/** Límite de E8 y E13. */
const MAX_KB = 10 * 1024
/** Máximo de soportes por evento (spec de E). */
const MAX_SOPORTES = 5

export type Adjunto = Soporte & { url?: string }

type Origen = "camara" | "galeria" | "pdf"

export function textoTamano(kb: number) {
  return kb >= 1024 ? `${(kb / 1024).toFixed(1).replace(".", ",")} MB` : `${Math.round(kb)} KB`
}

function tipoArchivo(archivo: File): Soporte["tipo"] {
  if (archivo.type === "application/pdf") return "pdf"
  if (archivo.type === "image/png") return "png"
  return "jpg"
}

type BloqueSoporteProps = {
  soportes: Adjunto[]
  onCambio: (soportes: Adjunto[]) => void
  /** Si acepta PDF además de fotos (E7 y E11 solo aceptan fotos). */
  aceptaPdf?: boolean
  etiqueta?: string
  textoArea?: string
  iconoArea?: string
}

/**
 * Soporte del evento: área punteada que abre E8 (en todos los tipos, también E2–E4),
 * revisión de la foto (E12) y aviso si pesa más de 10 MB (E13).
 */
export function BloqueSoporte({
  soportes,
  onCambio,
  aceptaPdf = true,
  etiqueta,
  textoArea = "Foto (opcional)",
  iconoArea = "add_a_photo",
}: BloqueSoporteProps) {
  const camara = useRef<HTMLInputElement>(null)
  const galeria = useRef<HTMLInputElement>(null)
  const pdf = useRef<HTMLInputElement>(null)
  const [hojaAbierta, setHojaAbierta] = useState(false)
  const [revisando, setRevisando] = useState<Adjunto | null>(null)
  const [giro, setGiro] = useState(0)
  const [pesado, setPesado] = useState<{ nombre: string; kb: number } | null>(null)

  // Libera las vistas previas al salir de la pantalla.
  const urls = useRef(soportes)
  useEffect(() => {
    urls.current = soportes
  }, [soportes])
  useEffect(() => () => urls.current.forEach((s) => s.url && URL.revokeObjectURL(s.url)), [])

  const lleno = soportes.length >= MAX_SOPORTES

  function abrir(origen: Origen) {
    setHojaAbierta(false)
    setPesado(null)
    ;({ camara, galeria, pdf })[origen].current?.click()
  }

  function alElegir(origen: Origen, archivo?: File) {
    if (!archivo) return
    const kb = archivo.size / 1024
    if (kb > MAX_KB) {
      setPesado({ nombre: archivo.name, kb })
      return
    }
    const tipo = tipoArchivo(archivo)
    const adjunto: Adjunto = {
      nombre: archivo.name,
      tipo,
      tamanoKb: Math.round(kb),
      url: tipo === "pdf" ? undefined : URL.createObjectURL(archivo),
    }
    if (origen === "camara") {
      setGiro(0)
      setRevisando(adjunto)
    } else {
      onCambio([...soportes, adjunto])
    }
  }

  function quitar(i: number) {
    const s = soportes[i]
    if (s.url) URL.revokeObjectURL(s.url)
    onCambio(soportes.filter((_, j) => j !== i))
  }

  const entradas = (
    <>
      <input ref={camara} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { alElegir("camara", e.target.files?.[0]); e.target.value = "" }} />
      <input ref={galeria} type="file" accept="image/*" hidden onChange={(e) => { alElegir("galeria", e.target.files?.[0]); e.target.value = "" }} />
      <input ref={pdf} type="file" accept="application/pdf" hidden onChange={(e) => { alElegir("pdf", e.target.files?.[0]); e.target.value = "" }} />
    </>
  )

  return (
    <div className="flex flex-col gap-2">
      {entradas}
      {etiqueta && <span className="texto-etiqueta-fuerte text-texto">{etiqueta}</span>}

      {soportes.map((s, i) => (
        <div key={`${s.nombre}-${i}`} className="flex items-center gap-3 rounded-md border border-primario bg-superficie p-3.5">
          <span className="grid size-10 shrink-0 place-items-center overflow-hidden rounded-sm bg-acento-suave text-primario">
            <Icono nombre={s.tipo === "pdf" ? "picture_as_pdf" : "image"} className="icono-m" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate texto-cuerpo-fuerte text-texto">{s.nombre}</span>
            <span className="texto-etiqueta text-texto-secundario">
              {s.tipo === "pdf" ? "PDF" : "Foto"} · {textoTamano(s.tamanoKb)} · Cargado
            </span>
          </span>
          <button type="button" aria-label={`Quitar ${s.nombre}`} onClick={() => quitar(i)} className="grid size-8 place-items-center text-primario">
            <Icono nombre="close" className="icono-m" />
          </button>
        </div>
      ))}

      {!lleno && (
        <button
          type="button"
          onClick={() => setHojaAbierta(true)}
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-bloque border border-dashed border-primario bg-acento-suave text-primario"
        >
          <Icono nombre={iconoArea} className="icono-xl" />
          <span className="texto-etiqueta text-texto-secundario">{textoArea}</span>
        </button>
      )}

      {/* E8 · Adjuntar soporte */}
      <Drawer open={hojaAbierta} onOpenChange={setHojaAbierta}>
        <DrawerContent className="mx-auto max-w-app rounded-t-xl border-0 bg-superficie px-6 pt-3 pb-9">
          <span aria-hidden className="mx-auto mb-4 h-1.5 w-11 rounded-completo bg-acento" />
          <DrawerTitle className="mb-4 texto-titulo-tarjeta text-texto">Adjuntar soporte</DrawerTitle>
          <div className="flex flex-col gap-2.5">
            <OpcionHoja icono="photo_camera" titulo="Tomar foto" detalle="Carnet, fórmula o examen" onClick={() => abrir("camara")} />
            <OpcionHoja icono="photo_library" titulo="Elegir de la galería" onClick={() => abrir("galeria")} />
            {aceptaPdf && <OpcionHoja icono="picture_as_pdf" titulo="Subir PDF" detalle="Hasta 10 MB" onClick={() => abrir("pdf")} />}
            <Boton variante="secundario" className="mt-1" onClick={() => setHojaAbierta(false)}>
              Cancelar
            </Boton>
          </div>
        </DrawerContent>
      </Drawer>

      {/* E12 · Revisar la foto */}
      {revisando && (
        <Pantalla titulo="Revisar la foto" onAtras={() => setRevisando(null)}>
          <div className="relative grid h-80 place-items-center overflow-hidden rounded-lg bg-acento-suave">
            {revisando.url && (
              // Vista previa local de la foto recién tomada (object URL), no optimizable por next/image.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={revisando.url}
                alt="Vista previa de la foto"
                className="size-full object-contain transition-transform"
                style={{ transform: `rotate(${giro}deg)` }}
              />
            )}
          </div>
          <div className="flex gap-2">
            <Chip icono="rotate_right" texto="Girar" onClick={() => setGiro((g) => (g + 90) % 360)} activo />
            <Chip icono="replay" texto="Repetir" onClick={() => { setRevisando(null); abrir("camara") }} />
          </div>
          <Nota icono="visibility">Revisa que se lean las fechas y los nombres antes de adjuntarla.</Nota>
          <BarraAccion>
            <Boton onClick={() => { onCambio([...soportes, revisando]); setRevisando(null) }}>Usar esta foto</Boton>
            <Boton variante="secundario" onClick={() => { setRevisando(null); abrir("camara") }}>
              Tomar otra
            </Boton>
          </BarraAccion>
        </Pantalla>
      )}

      {/* E13 · Archivo muy pesado */}
      {pesado && (
        <Pantalla titulo="Adjuntar soporte" onAtras={() => setPesado(null)}>
          <Estado
            tono="error"
            icono="error"
            titulo="El archivo pesa más de 10 MB"
            mensaje={`No pudimos subir ${pesado.nombre} (${textoTamano(pesado.kb)}).`}
          />
          <Nota>Aceptamos JPG, PNG{aceptaPdf ? " y PDF" : ""} de hasta 10 MB.</Nota>
          <div className="flex flex-col gap-2.5">
            <OpcionHoja icono="photo_camera" titulo="Tomar una foto del documento" detalle="Suele pesar menos" onClick={() => abrir("camara")} />
            <OpcionHoja icono="folder" titulo="Elegir otro archivo" detalle="Desde la galería o archivos" onClick={() => abrir("galeria")} />
          </div>
          <BarraAccion>
            <Boton onClick={() => abrir("galeria")}>Elegir otro archivo</Boton>
            <Boton variante="secundario" onClick={() => setPesado(null)}>
              Guardar sin soporte
            </Boton>
          </BarraAccion>
        </Pantalla>
      )}
    </div>
  )
}

function OpcionHoja({ icono, titulo, detalle, onClick }: { icono: string; titulo: string; detalle?: string; onClick: () => void }) {
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

function Chip({ icono, texto, onClick, activo }: { icono: string; texto: string; onClick: () => void; activo?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-9.5 items-center gap-1.5 rounded-completo border px-4 texto-etiqueta-fuerte",
        activo ? "border-primario-relleno bg-primario-relleno text-superficie" : "border-borde-fuerte bg-superficie text-texto",
      )}
    >
      <Icono nombre={icono} className="icono-s" />
      {texto}
    </button>
  )
}

/** Pantalla completa encima del formulario (E12, E13), con flecha para volver. */
function Pantalla({ titulo, onAtras, children }: { titulo: string; onAtras: () => void; children: React.ReactNode }) {
  return (
    <div role="dialog" aria-label={titulo} className="fixed inset-0 z-20 mx-auto flex max-w-app flex-col gap-4 overflow-y-auto bg-fondo px-6 pt-14">
      <header className="relative mb-2 flex h-11 items-center justify-center">
        <button
          type="button"
          onClick={onAtras}
          aria-label="Volver"
          className="absolute left-0 grid size-11 place-items-center rounded-completo border border-borde bg-superficie text-texto"
        >
          <Icono nombre="arrow_back" className="icono-m" />
        </button>
        <h2 className="texto-titulo-seccion text-texto">{titulo}</h2>
      </header>
      {children}
    </div>
  )
}
