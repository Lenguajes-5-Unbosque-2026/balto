"use client"

import { useState } from "react"
import { toast } from "sonner"

import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Icono } from "@/components/icono"
import type { Soporte } from "@/lib/eventos"
import { cn } from "@/lib/utils"

const accion =
  "flex h-10 min-w-0 items-center justify-center gap-1.5 rounded-completo border border-borde-fuerte bg-superficie px-2 texto-etiqueta-fuerte text-texto disabled:opacity-50"

/** D5 · Ver o descargar soporte, en pantalla completa sobre D4. */
export function VisorSoporte({ soporte, onCerrar }: { soporte: Soporte; onCerrar: () => void }) {
  const [giro, setGiro] = useState(0)
  const [fallo, setFallo] = useState(false)
  const esFoto = soporte.tipo !== "pdf"
  const disponible = Boolean(soporte.url) && !fallo

  async function compartir() {
    if (!soporte.url) return
    try {
      const archivo = new File([await (await fetch(soporte.url)).blob()], soporte.nombre, {
        type: esFoto ? `image/${soporte.tipo === "jpg" ? "jpeg" : soporte.tipo}` : "application/pdf",
      })
      if (navigator.canShare?.({ files: [archivo] })) {
        await navigator.share({ files: [archivo], title: soporte.nombre })
        return
      }
      if (navigator.share) {
        await navigator.share({ title: soporte.nombre, url: new URL(soporte.url, location.href).href })
        return
      }
      toast("Este navegador no permite compartir", { description: "Descárgalo y envíalo desde tus archivos." })
    } catch (error) {
      // Cerrar el menú de compartir no es un error.
      if (error instanceof DOMException && error.name === "AbortError") return
      toast("No pudimos compartir el archivo")
    }
  }

  return (
    <div role="dialog" aria-label="Soporte" className="fixed inset-0 z-20 mx-auto flex max-w-app flex-col gap-4 bg-fondo px-6 pt-14 pb-10">
      <Encabezado titulo="Soporte" izquierda={<BotonIcono icono="close" etiqueta="Cerrar" onClick={onCerrar} />} />

      <div className="grid min-h-0 flex-1 place-items-center overflow-hidden rounded-lg border border-dashed border-primario bg-acento-suave p-4">
        {disponible && esFoto ? (
          // Archivo estático de /public/soportes; next/image no aporta en una vista con giro libre.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={soporte.url}
            alt={soporte.nombre}
            onError={() => setFallo(true)}
            className="max-h-full max-w-full object-contain transition-transform"
            style={{ transform: `rotate(${giro}deg)` }}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Icono nombre={esFoto ? "image" : "description"} className="icono-xl text-primario" />
            <span className="texto-cuerpo-fuerte break-all text-texto">{soporte.nombre}</span>
            {disponible ? (
              <a href={soporte.url} target="_blank" rel="noreferrer" className="texto-etiqueta-fuerte text-primario">
                Abrir el PDF
              </a>
            ) : (
              <span className="max-w-60 texto-etiqueta text-texto-secundario">
                La vista previa estará disponible cuando los soportes se guarden en la nube.
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={compartir} disabled={!disponible} className={accion}>
          <Icono nombre="ios_share" className="icono-s" />
          Compartir
        </button>
        <a
          href={disponible ? soporte.url : undefined}
          download={soporte.nombre}
          aria-disabled={!disponible}
          className={cn(accion, !disponible && "pointer-events-none opacity-50")}
        >
          <Icono nombre="download" className="icono-s" />
          Descargar
        </a>
        <button type="button" onClick={() => setGiro((g) => (g + 90) % 360)} disabled={!disponible || !esFoto} className={accion}>
          <Icono nombre="rotate_right" className="icono-s" />
          Rotar
        </button>
      </div>
    </div>
  )
}
