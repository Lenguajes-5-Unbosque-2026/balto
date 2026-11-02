"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { AreaTexto, Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { DialogoSalir } from "@/components/dialogo-salir"
import { Encabezado } from "@/components/encabezado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { BloqueSoporte, type Adjunto } from "@/components/registro/bloque-soporte"
import { puedeVolver } from "@/lib/navegacion"
import { HOY } from "@/lib/fecha"
import { CONSISTENCIAS, TIPOS_HABITO, type TipoHabito } from "@/lib/habitos"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { guardarEvento } from "@/lib/registro-local"
import { guardarHabito } from "@/lib/usar-habitos"
import { cn } from "@/lib/utils"

/** "45 min", "6 h", "1 h 30" o "90" → minutos. */
function minutos(texto: string) {
  const t = texto.toLowerCase().replace(",", ".")
  const h = /(\d+(?:\.\d+)?)\s*h/.exec(t)
  const m = /(\d+)\s*(?:min|m\b)/.exec(t) ?? (!h ? /(\d+)/.exec(t) : /h\s*(\d+)/.exec(t))
  return Math.round((h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0))
}

const CON_DURACION: TipoHabito[] = ["paseo", "actividad", "sueno"]

/** I2 · Registrar hábito. Alimentación y Atípico se guardan como eventos (igual que E7). */
export function RegistrarHabito({ mascotas }: { mascotas: { id: string; nombre: string }[] }) {
  const router = useRouter()
  const [mascota] = useMascotaActiva(mascotas)
  const [tipo, setTipo] = useState<TipoHabito>("paseo")
  const [fecha, setFecha] = useState(HOY)
  const [duracion, setDuracion] = useState("")
  const [consistencia, setConsistencia] = useState("normal")
  const [observacion, setObservacion] = useState("")
  const [fotos, setFotos] = useState<Adjunto[]>([])
  const [salir, setSalir] = useState(false)

  const pideDuracion = CON_DURACION.includes(tipo)
  const completo = !!fecha && (pideDuracion ? minutos(duracion) > 0 : tipo === "deposiciones" || observacion.trim() !== "")
  const tocado = !!duracion || !!observacion || fotos.length > 0

  function volver() {
    if (puedeVolver()) router.back()
    else router.push("/habitos")
  }

  function guardar() {
    const soportes = fotos.map(({ nombre, tipo: t, tamanoKb }) => ({ nombre, tipo: t, tamanoKb }))
    if (tipo === "alimentacion" || tipo === "atipico") {
      guardarEvento({
        id: crypto.randomUUID(),
        mascota_id: mascota.id,
        tipo: tipo === "atipico" ? "comportamiento" : "alimentacion",
        fecha,
        que_cambio: observacion.trim(),
        soportes,
        fecha_creacion: HOY,
      })
    } else {
      guardarHabito({
        id: crypto.randomUUID(),
        mascota_id: mascota.id,
        tipo,
        fecha,
        duracion_min: pideDuracion ? String(minutos(duracion)) : "",
        consistencia: tipo === "deposiciones" ? consistencia : "",
        observacion: observacion.trim(),
        imagen: fotos[0]?.nombre ?? "",
      })
    }
    toast.success("Hábito registrado")
    router.replace("/habitos")
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Registrar hábito" izquierda={<BotonIcono icono="close" etiqueta="Cerrar" onClick={() => (tocado ? setSalir(true) : volver())} />} />

      <div role="radiogroup" aria-label="Tipo de hábito" className="grid grid-cols-3 gap-2.5">
        {TIPOS_HABITO.map((t) => {
          const activo = tipo === t.slug
          return (
            <button
              key={t.slug}
              type="button"
              role="radio"
              aria-checked={activo}
              onClick={() => setTipo(t.slug)}
              className={cn(
                "flex h-22 flex-col items-center justify-center gap-2 rounded-md px-1 transition-colors",
                activo ? "bg-primario text-superficie" : "bg-superficie text-texto",
              )}
            >
              <span className="grid size-9 place-items-center rounded-completo bg-acento-suave text-primario">
                <Icono nombre={t.icono} className="icono-m" />
              </span>
              <span className="w-full truncate text-center texto-etiqueta">{t.nombre}</span>
            </button>
          )
        })}
      </div>

      <div className={cn("grid gap-3", pideDuracion && "grid-cols-2")}>
        <Campo etiqueta="Fecha" type="date" max={HOY} valor={fecha} onCambio={setFecha} />
        {pideDuracion && (
          <Campo etiqueta="Duración" requerido placeholder={tipo === "sueno" ? "8 h" : "45 min"} valor={duracion} onCambio={setDuracion} />
        )}
      </div>

      {tipo === "deposiciones" && (
        <div className="flex flex-col gap-2">
          <span className="texto-etiqueta-fuerte text-texto">Cómo fue</span>
          <div className="flex flex-wrap gap-2">
            {CONSISTENCIAS.map((c) => (
              <Chip key={c.valor} texto={c.etiqueta} activo={consistencia === c.valor} onClick={() => setConsistencia(c.valor)} />
            ))}
          </div>
          {consistencia === "con_sangre" && (
            <Nota tono="error" icono="warning">
              Consúltalo con tu veterinario.
            </Nota>
          )}
        </div>
      )}

      <AreaTexto
        etiqueta="Observación"
        requerido={tipo === "alimentacion" || tipo === "atipico"}
        placeholder={tipo === "atipico" ? "Por ejemplo, ladra de noche" : "Paseo largo en el parque, muy activa."}
        valor={observacion}
        onCambio={setObservacion}
      />
      <BloqueSoporte aceptaPdf={false} textoArea="Foto de apoyo" iconoArea="add_a_photo" soportes={fotos} onCambio={setFotos} />

      <BarraAccion>
        <Boton disabled={!completo} onClick={guardar}>
          Guardar
          <Icono nombre="check" className="icono-m" />
        </Boton>
      </BarraAccion>
      <DialogoSalir abierto={salir} mensaje="Perderás los datos de este hábito." onSeguir={() => setSalir(false)} onSalir={volver} />
    </main>
  )
}
