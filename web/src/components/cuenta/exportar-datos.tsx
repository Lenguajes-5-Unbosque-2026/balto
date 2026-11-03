"use client"

import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionRadio } from "@/components/opcion-radio"
import { Selector } from "@/components/selector"
import type { Dueno } from "@/lib/datos"
import type { Evento } from "@/lib/eventos"
import { HOY, normalizarNombreArchivo } from "@/lib/fecha"
import { useMascotaActiva, useMascotas } from "@/lib/mascota-activa"
import type { PerfilMascota } from "@/lib/perfil"
import { useDueno } from "@/lib/usar-cuenta"
import { useEventos } from "@/lib/usar-eventos"
import { useVolver } from "@/lib/usar-salud"

type ExportarProps = { dueno: Dueno; mascotas: PerfilMascota[]; eventos: Evento[] }

/** M6 · Exportar mis datos → M14 · Exportación lista. */
export function ExportarDatos({ dueno: duenoBase, mascotas: base, eventos: eventosBase }: ExportarProps) {
  const volver = useVolver("/ajustes")
  const dueno = useDueno(duenoBase)
  const mascotas = useMascotas(base)
  const [activa] = useMascotaActiva(base)
  const eventos = useEventos(eventosBase)
  const [cuales, setCuales] = useState<"todas" | "una">("todas")
  const [formato, setFormato] = useState<"pdf" | "datos">("datos")
  const [listo, setListo] = useState(false)

  const elegidas = cuales === "todas" ? mascotas : [activa]
  const nombre = `balto_datos_${normalizarNombreArchivo(dueno.nombre.split(" ")[0])}.${formato === "pdf" ? "pdf" : "json"}`

  /** Datos: un archivo con las fichas y todos los eventos. PDF: el reporte completo listo para guardar desde el navegador. */
  function descargar() {
    if (formato === "pdf") {
      window.open(`/compartir/pdf?mascota=${cuales === "todas" ? "todas" : activa.id}&secciones=completo`, "_blank")
      return
    }
    const ids = new Set(elegidas.map((m) => m.id))
    const contenido = {
      exportado: HOY,
      dueno,
      mascotas: elegidas,
      eventos: eventos.filter((e) => ids.has(e.mascota_id)),
    }
    const enlace = document.createElement("a")
    enlace.href = URL.createObjectURL(new Blob([JSON.stringify(contenido, null, 2)], { type: "application/json" }))
    enlace.download = nombre
    enlace.click()
    URL.revokeObjectURL(enlace.href)
  }

  if (listo) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Exportar mis datos" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setListo(false)} />} />
        <div className="pt-4">
          <Estado
            icono="folder_zip"
            titulo="Tu archivo está listo"
            mensaje={`${nombre} · ${elegidas.length} ${elegidas.length === 1 ? "mascota" : "mascotas"}`}
          />
        </div>
        <FilaOpcion icono="download" titulo="Descargar ahora" detalle="El enlace sirve por 7 días" derecha={<Icono nombre="download" className="icono-m text-texto-secundario" />} onClick={descargar} />
        <FilaOpcion icono="mail" titulo="Enviar a mi correo" detalle={dueno.correo} onClick={() => toast.success(`Te enviamos el enlace a ${dueno.correo}`)} />
        <Nota icono="assignment_turned_in">
          {formato === "pdf" ? "Incluye las fichas y todo el historial de salud." : "Incluye fichas, eventos y la lista de soportes de cada evento."}
        </Nota>
        <BarraAccion>
          <Boton onClick={descargar}>Descargar</Boton>
          <BotonEnlace href="/ajustes" variante="secundario" className="px-2 texto-cuerpo-fuerte">
            Volver a ajustes
          </BotonEnlace>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Exportar mis datos" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="pt-4">
        <Estado icono="download" titulo="Tus datos son tuyos" mensaje="Descarga toda la información y los soportes de tus mascotas cuando quieras." />
      </div>
      <div role="radiogroup" aria-label="Qué mascotas" className="flex flex-col gap-3">
        <OpcionRadio icono="pets" titulo="Todas las mascotas" activa={cuales === "todas"} onElegir={() => setCuales("todas")} />
        <OpcionRadio icono="pets" titulo={`Solo ${activa.nombre}`} activa={cuales === "una"} onElegir={() => setCuales("una")} />
      </div>
      <Selector
        etiqueta="Formato"
        valor={formato}
        onCambio={(v) => setFormato(v as typeof formato)}
        opciones={[
          { valor: "pdf", etiqueta: "PDF" },
          { valor: "datos", etiqueta: "Archivo de datos" },
        ]}
      />
      <BarraAccion>
        <Boton onClick={() => setListo(true)}>
          Descargar
          <Icono nombre="download" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
