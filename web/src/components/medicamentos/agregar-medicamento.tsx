"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { DialogoSalir } from "@/components/dialogo-salir"
import { Encabezado } from "@/components/encabezado"
import { Icono } from "@/components/icono"
import { PasoHorarios, type Horarios } from "@/components/medicamentos/paso-horarios"
import { Nota } from "@/components/nota"
import { Pasos } from "@/components/pasos"
import { BloqueSoporte, textoTamano, type Adjunto } from "@/components/registro/bloque-soporte"
import { HOY, diasEntre, sumarDias } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { nombreTratamiento } from "@/lib/medicamentos"
import { guardarEvento } from "@/lib/registro-local"
import { guardarTratamiento } from "@/lib/usar-medicamentos"

type Datos = { nombre: string; presentacion: string; via: string; dosis: string; duracion: string; prescrito: string; cada: string; desde: string; hasta: string }

const VACIO: Datos = { nombre: "", presentacion: "", via: "", dosis: "", duracion: "", prescrito: "", cada: "", desde: HOY, hasta: "" }

/** "7 días" → 7. */
const dias = (texto: string) => Number.parseInt(texto.replace(/\D+/g, " ").trim().split(" ")[0] ?? "", 10) || 0

/** "12 horas" o "Cada 12 h" → "cada_12h"; "8" → "cada_8h". */
function frecuenciaDe(texto: string) {
  const h = dias(texto)
  return h === 8 || h === 12 || h === 24 ? `cada_${h}h` : "cada_12h"
}

/** G3 · Agregar medicamento → G7 · Revisar fórmula (si hay foto) → G4 · Horarios de toma. */
export function AgregarMedicamento({ mascotas }: { mascotas: { id: string; nombre: string }[] }) {
  const router = useRouter()
  const [mascota] = useMascotaActiva(mascotas)
  const [paso, setPaso] = useState<"datos" | "revisar" | "horarios">("datos")
  const [d, setD] = useState<Datos>(VACIO)
  const [formula, setFormula] = useState<Adjunto[]>([])
  const [confirmarSalida, setConfirmarSalida] = useState(false)

  const set = (campo: keyof Datos) => (valor: string) => setD((x) => ({ ...x, [campo]: valor }))
  const tocado = formula.length > 0 || Object.entries(d).some(([k, v]) => v && !(k === "desde" && v === HOY))

  function cerrar() {
    if (tocado) setConfirmarSalida(true)
    else salir()
  }

  function salir() {
    if (window.history.length > 1) router.back()
    else router.push("/medicamentos")
  }

  /** Con la foto de la fórmula se pasa a revisar los datos (G7). La lectura automática está pendiente de definir. */
  function adjuntar(soportes: Adjunto[]) {
    setFormula(soportes)
    if (soportes.length > formula.length) {
      setD((x) => ({ ...x, hasta: x.hasta || (dias(x.duracion) ? sumarDias(x.desde, dias(x.duracion)) : "") }))
      setPaso("revisar")
    }
  }

  function guardar(h: Horarios) {
    const duracion = d.hasta && d.desde ? diasEntre(d.desde, d.hasta) : dias(d.duracion) || 7
    const inicio = d.desde || HOY
    const id = crypto.randomUUID()
    const eventoId = crypto.randomUUID()
    const medicamento = d.nombre.trim()
    const soportes = formula.map(({ nombre, tipo, tamanoKb }) => ({ nombre, tipo, tamanoKb }))
    // El tratamiento también es un evento de tipo tratamiento: aparece en D2, F3 y D1.
    guardarEvento({
      id: eventoId,
      mascota_id: mascota.id,
      tipo: "tratamiento",
      fecha: inicio,
      medicamento: nombreTratamiento({ medicamento, presentacion: d.presentacion }),
      dosis: d.dosis,
      via: d.via.toLowerCase(),
      frecuencia: h.frecuencia,
      duracion_dias: String(duracion),
      soportes,
      recordatorio: String(h.recordatorio),
      fecha_creacion: HOY,
    })
    guardarTratamiento(id, {
      mascota_id: mascota.id,
      evento_id: eventoId,
      medicamento,
      presentacion: d.presentacion,
      via: d.via.toLowerCase(),
      dosis: d.dosis,
      frecuencia: h.frecuencia,
      dias_semana: h.dias_semana,
      fecha_inicio: inicio,
      duracion_dias: String(duracion),
      fecha_fin: sumarDias(inicio, duracion),
      prescrito_por: d.prescrito,
      estado: "vigente",
      finalizado_antes: "false",
      recordatorio: String(h.recordatorio),
      horas: h.horas,
    })
    toast.success(`${medicamento} quedó en los medicamentos de ${mascota.nombre}`)
    router.replace(`/medicamentos/detalle?id=${id}`)
  }

  if (paso === "horarios") {
    return (
      <PasoHorarios
        conPasos
        inicial={{ frecuencia: frecuenciaDe(d.cada), horas: [], dias_semana: "", recordatorio: true }}
        onVolver={() => setPaso(formula.length ? "revisar" : "datos")}
        onGuardar={guardar}
      />
    )
  }

  const dialogo = (
    <DialogoSalir abierto={confirmarSalida} mensaje="Perderás los datos de este medicamento." onSeguir={() => setConfirmarSalida(false)} onSalir={salir} />
  )

  if (paso === "revisar") {
    const archivo = formula.at(-1)
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Revisar fórmula" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setPaso("datos")} />} />
        <Pasos paso={1} nombre="Medicamento" />
        {archivo && (
          <div className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
              <Icono nombre={archivo.tipo === "pdf" ? "picture_as_pdf" : "image"} className="icono-m" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate texto-cuerpo-fuerte text-texto">{archivo.nombre}</span>
              <span className="texto-etiqueta text-texto-secundario">
                {archivo.tipo === "pdf" ? "PDF" : "Foto"} · {textoTamano(archivo.tamanoKb)} · Por revisar
              </span>
            </span>
            {archivo.url && (
              <a href={archivo.url} target="_blank" rel="noreferrer" aria-label="Ver la fórmula" className="text-texto-secundario">
                <Icono nombre="visibility" className="icono-m" />
              </a>
            )}
          </div>
        )}
        <Campo etiqueta="Medicamento" requerido icono="medication" placeholder="Nombre y concentración" valor={d.nombre} onCambio={set("nombre")} />
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Dosis" icono="straighten" placeholder="1 cápsula" valor={d.dosis} onCambio={set("dosis")} />
          <Campo etiqueta="Cada" icono="schedule" placeholder="12 horas" valor={d.cada} onCambio={set("cada")} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Desde" type="date" icono="event" valor={d.desde} onCambio={set("desde")} />
          <Campo etiqueta="Hasta" type="date" icono="event_busy" valor={d.hasta} onCambio={set("hasta")} />
        </div>
        <Nota tono="error" icono="warning">
          Confirma la dosis con tu veterinario antes de activar recordatorios.
        </Nota>
        <BarraAccion>
          <Boton disabled={!d.nombre.trim()} onClick={() => setPaso("horarios")} className="px-2 texto-cuerpo-fuerte">
            Confirmar y seguir
          </Boton>
          <Boton variante="secundario" onClick={() => setPaso("datos")}>
            Corregir
          </Boton>
        </BarraAccion>
        {dialogo}
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Agregar medicamento" izquierda={<BotonIcono icono="close" etiqueta="Cerrar" onClick={cerrar} />} />
      <Pasos paso={1} nombre="Medicamento" />
      <Campo etiqueta="Nombre" requerido icono="medication" placeholder="Nombre del medicamento" valor={d.nombre} onCambio={set("nombre")} />
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Presentación" placeholder="Cápsula 250 mg" valor={d.presentacion} onCambio={set("presentacion")} />
        <Campo etiqueta="Vía" placeholder="Oral" valor={d.via} onCambio={set("via")} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Dosis" placeholder="1 cápsula" valor={d.dosis} onCambio={set("dosis")} />
        <Campo etiqueta="Duración" placeholder="7 días" valor={d.duracion} onCambio={set("duracion")} />
      </div>
      <Campo etiqueta="Prescrito por" icono="person" placeholder="Veterinario · clínica" valor={d.prescrito} onCambio={set("prescrito")} />
      <BloqueSoporte aceptaPdf textoArea="Foto de la fórmula médica" iconoArea="receipt_long" soportes={formula} onCambio={adjuntar} />
      <BarraAccion>
        <Boton
          disabled={!d.nombre.trim()}
          onClick={() => {
            setD((x) => ({ ...x, hasta: x.hasta || (dias(x.duracion) ? sumarDias(x.desde, dias(x.duracion)) : "") }))
            setPaso("horarios")
          }}
        >
          Siguiente: horarios
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
      {dialogo}
    </main>
  )
}
