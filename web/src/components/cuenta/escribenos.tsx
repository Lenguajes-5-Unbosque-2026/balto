"use client"

import { useSearchParams } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { AreaTexto, Campo } from "@/components/campo"
import { Encabezado } from "@/components/encabezado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import type { Dueno } from "@/lib/datos"
import { useDueno } from "@/lib/usar-cuenta"
import { useVolver } from "@/lib/usar-salud"

const TEMAS = ["Problema con la app", "Pregunta sobre mi cuenta", "Tienda y pedidos", "Sugerencia"]

/** M19 · Escríbenos: tema, correo de respuesta, mensaje y adjuntos (/ajustes/escribenos?tema=problema). */
export function Escribenos({ dueno: base }: { dueno: Dueno }) {
  const volver = useVolver("/ajustes/ayuda")
  const dueno = useDueno(base)
  const [tema, setTema] = useState(useSearchParams().get("tema") === "problema" ? TEMAS[0] : "")
  const [correo, setCorreo] = useState<string | null>(null)
  const [mensaje, setMensaje] = useState("")
  const [adjuntos, setAdjuntos] = useState<string[]>([])
  const camara = useRef<HTMLInputElement>(null)
  const galeria = useRef<HTMLInputElement>(null)
  const pdf = useRef<HTMLInputElement>(null)

  const respuesta = correo ?? dueno.correo
  const agregar = (archivo?: File) => archivo && setAdjuntos((x) => [...x, archivo.name])

  function enviar() {
    toast.success("Mensaje enviado", { description: `Te respondemos a ${respuesta} en 1 día hábil.` })
    volver()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Escríbenos" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <Campo etiqueta="Tema" icono="help" placeholder="¿Sobre qué nos escribes?" sugerencias={TEMAS} valor={tema} onCambio={setTema} />
      <Campo etiqueta="Te respondemos a" type="email" icono="mail" valor={respuesta} onCambio={setCorreo} />
      <AreaTexto etiqueta="Mensaje" placeholder="Cuéntanos qué pasó y en qué pantalla." valor={mensaje} onCambio={setMensaje} />

      <div className="flex flex-wrap gap-2">
        <Adjuntar icono="photo_camera" texto="Cámara" onClick={() => camara.current?.click()} />
        <Adjuntar icono="photo_library" texto="Galería" onClick={() => galeria.current?.click()} />
        <Adjuntar icono="picture_as_pdf" texto="PDF" onClick={() => pdf.current?.click()} />
      </div>
      <input ref={camara} type="file" accept="image/*" capture="environment" hidden onChange={(e) => agregar(e.target.files?.[0])} />
      <input ref={galeria} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => agregar(e.target.files?.[0])} />
      <input ref={pdf} type="file" accept="application/pdf" hidden onChange={(e) => agregar(e.target.files?.[0])} />
      {adjuntos.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {adjuntos.map((a, i) => (
            <li key={`${a}-${i}`} className="flex items-center gap-2 texto-etiqueta text-texto">
              <Icono nombre="attach_file" className="icono-s text-primario" />
              <span className="min-w-0 flex-1 truncate">{a}</span>
              <button type="button" aria-label={`Quitar ${a}`} onClick={() => setAdjuntos((x) => x.filter((_, j) => j !== i))}>
                <Icono nombre="close" className="icono-s text-texto-secundario" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Nota icono="schedule">Respondemos en 1 día hábil. Puedes adjuntar una captura.</Nota>

      <BarraAccion>
        <Boton disabled={!tema.trim() || !mensaje.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respuesta)} onClick={enviar}>
          Enviar
        </Boton>
      </BarraAccion>
    </main>
  )
}

function Adjuntar({ icono, texto, onClick }: { icono: string; texto: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-10 items-center gap-1.5 rounded-completo border border-borde-fuerte bg-superficie px-4 texto-etiqueta-fuerte text-texto"
    >
      <Icono nombre={icono} className="icono-s" />
      {texto}
    </button>
  )
}
