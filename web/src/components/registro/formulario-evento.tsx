"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { AreaTexto, Campo } from "@/components/campo"
import { DialogoSalir } from "@/components/dialogo-salir"
import { FilaInterruptor } from "@/components/fila-interruptor"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Selector } from "@/components/selector"
import { BloqueSoporte, type Adjunto } from "@/components/registro/bloque-soporte"
import { ChipsTipo } from "@/components/registro/chips-tipo"
import { EncabezadoRegistro } from "@/components/registro/encabezado-registro"
import { GraficaPeso } from "@/components/registro/grafica-peso"
import type { MascotaBasica, Medicion } from "@/components/registro/tipos"
import type { Evento, TipoEvento } from "@/lib/eventos"
import { HOY, fechaCorta, sumarDias } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { guardarEvento } from "@/lib/registro-local"

/** Campos obligatorios de cada tipo (tabla "Campos por tipo" de la spec de E). */
const OBLIGATORIOS: Record<TipoEvento, string[]> = {
  vacuna: ["vacuna", "fecha"],
  desparasitacion: ["producto", "fecha"],
  consulta: ["veterinaria", "fecha"],
  examen: ["tipo_examen", "fecha"],
  tratamiento: ["medicamento"],
  peso: ["peso_kg"],
  alimentacion: ["que_cambio"],
  comportamiento: ["que_cambio"],
  otro: ["titulo", "fecha"],
}

/** Al cambiar de tipo con un chip se conservan la fecha, los soportes y, en E7, el texto. */
const COMUNES = ["fecha", "que_cambio"]

type FormularioEventoProps = {
  tipoInicial: TipoEvento
  mascotas: MascotaBasica[]
  mediciones: Medicion[]
  veterinarias: string[]
  /** Días de anticipación de los avisos (M3); 0 si están apagados. */
  anticipacion: number
}

export function FormularioEvento({ tipoInicial, mascotas, mediciones, veterinarias, anticipacion }: FormularioEventoProps) {
  const router = useRouter()
  const [mascota, cambiarMascota] = useMascotaActiva(mascotas)
  const [tipo, setTipo] = useState<TipoEvento>(tipoInicial)
  const [valores, setValores] = useState<Record<string, string>>({ fecha: HOY, resultado: "normal" })
  const [soportes, setSoportes] = useState<Adjunto[]>([])
  const [recordatorio, setRecordatorio] = useState(false)
  const [confirmarSalida, setConfirmarSalida] = useState(false)

  const v = (campo: string) => valores[campo] ?? ""
  const set = (campo: string) => (valor: string) => setValores((x) => ({ ...x, [campo]: valor }))

  const tocado =
    soportes.length > 0 ||
    Object.entries(valores).some(([k, val]) => val && !(k === "fecha" && val === HOY) && !(k === "resultado" && val === "normal"))
  const completo = OBLIGATORIOS[tipo].every((c) => v(c).trim() !== "")

  function cambiarTipo(nuevo: TipoEvento) {
    if (nuevo === tipo) return
    setValores((x) => Object.fromEntries(Object.entries(x).filter(([k]) => COMUNES.includes(k) || k === "resultado")))
    setRecordatorio(false)
    setTipo(nuevo)
    window.history.replaceState(null, "", `/registrar/${nuevo}`)
  }

  function cerrar() {
    if (tocado) setConfirmarSalida(true)
    else router.push("/")
  }

  function guardar() {
    const evento: Evento = {
      ...Object.fromEntries(Object.entries(valores).filter(([, val]) => val !== "")),
      id: crypto.randomUUID(),
      mascota_id: mascota.id,
      tipo,
      fecha: v("fecha") || HOY,
      peso_kg: tipo === "peso" ? v("peso_kg").replace(",", ".") : undefined,
      recordatorio: String(recordatorio),
      soportes: soportes.map(({ nombre, tipo: t, tamanoKb }) => ({ nombre, tipo: t, tamanoKb })),
      fecha_creacion: HOY,
    }
    if (tipo !== "examen") delete evento.resultado
    guardarEvento(evento)
    router.push(`/registrar/guardado?id=${evento.id}`)
  }

  /** "7 días antes · 5 sep 2027" para los recordatorios de E2 y E10. */
  function detalleAviso(proxima: string) {
    if (anticipacion === 0) return "Activa los avisos en Ajustes › Notificaciones"
    if (!proxima) return `${anticipacion} días antes`
    return `${anticipacion} días antes · ${fechaCorta(sumarDias(proxima, -anticipacion))}`
  }

  const esE7 = tipo === "alimentacion" || tipo === "comportamiento"

  return (
    <main className="flex flex-1 flex-col gap-4 px-6 pt-14">
      <EncabezadoRegistro onCerrar={cerrar} mascotas={mascotas} activa={mascota} onCambioMascota={cambiarMascota} />

      {esE7 ? (
        <Selector
          etiqueta="Tipo de registro"
          valor={tipo}
          onCambio={(t) => cambiarTipo(t as TipoEvento)}
          opciones={[
            { valor: "alimentacion", etiqueta: "Alimentación" },
            { valor: "comportamiento", etiqueta: "Comportamiento" },
          ]}
        />
      ) : (
        <ChipsTipo actual={tipo} onCambio={cambiarTipo} />
      )}

      {tipo === "vacuna" && (
        <section className="flex flex-col gap-4 rounded-lg bg-superficie p-5 shadow-tarjeta">
          <Campo etiqueta="Vacuna aplicada" requerido icono="vaccines" placeholder="Nombre de la vacuna" valor={v("vacuna")} onCambio={set("vacuna")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Fecha aplicada" requerido type="date" valor={v("fecha")} onCambio={set("fecha")} />
            <Campo etiqueta="Próximo refuerzo" type="date" valor={v("proximo_refuerzo")} onCambio={set("proximo_refuerzo")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Veterinaria" placeholder="Opcional" sugerencias={veterinarias} valor={v("veterinaria")} onCambio={set("veterinaria")} />
            <Campo etiqueta="Lote" placeholder="Opcional" valor={v("lote")} onCambio={set("lote")} />
          </div>
          <BloqueSoporte etiqueta="Soporte" textoArea="Foto del carnet o PDF (opcional)" iconoArea="upload_file" soportes={soportes} onCambio={setSoportes} />
          <FilaInterruptor
            icono="notifications_active"
            titulo="Recordarme el refuerzo"
            detalle={detalleAviso(v("proximo_refuerzo"))}
            activo={recordatorio && !!v("proximo_refuerzo")}
            onCambio={setRecordatorio}
            deshabilitado={!v("proximo_refuerzo") || anticipacion === 0}
          />
        </section>
      )}

      {tipo === "desparasitacion" && (
        <>
          <Campo etiqueta="Producto" requerido icono="medication" placeholder="Nombre del antiparasitario" valor={v("producto")} onCambio={set("producto")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Fecha" requerido type="date" icono="event" valor={v("fecha")} onCambio={set("fecha")} />
            <Campo etiqueta="Vía" icono="straighten" placeholder="Oral" valor={v("via")} onCambio={set("via")} />
          </div>
          <Campo etiqueta="Próxima dosis" type="date" icono="event_repeat" valor={v("proxima_dosis")} onCambio={set("proxima_dosis")} />
          <div className="rounded-md bg-superficie p-3.5">
            <FilaInterruptor
              icono="notifications"
              titulo="Recordarme la próxima dosis"
              detalle={detalleAviso(v("proxima_dosis"))}
              activo={recordatorio && !!v("proxima_dosis")}
              onCambio={setRecordatorio}
              deshabilitado={!v("proxima_dosis") || anticipacion === 0}
            />
          </div>
          <Nota>Interna cada 3 meses, externa cada mes. Confirma con tu veterinario.</Nota>
        </>
      )}

      {tipo === "consulta" && (
        <>
          <Campo etiqueta="Veterinaria que atendió" requerido icono="local_hospital" placeholder="Nombre de la veterinaria" sugerencias={veterinarias} valor={v("veterinaria")} onCambio={set("veterinaria")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Motivo" icono="help" placeholder="Opcional" valor={v("motivo")} onCambio={set("motivo")} />
            <Campo etiqueta="Fecha" requerido type="date" valor={v("fecha")} onCambio={set("fecha")} />
          </div>
          <Campo etiqueta="Diagnóstico" icono="stethoscope" placeholder="Opcional" valor={v("diagnostico")} onCambio={set("diagnostico")} />
          <AreaTexto etiqueta="Recomendaciones" placeholder="Lo que indicó el veterinario" valor={v("recomendaciones")} onCambio={set("recomendaciones")} />
          <BloqueSoporte etiqueta="Soporte" textoArea="Foto o PDF (opcional)" iconoArea="upload_file" soportes={soportes} onCambio={setSoportes} />
        </>
      )}

      {tipo === "examen" && (
        <>
          <Campo etiqueta="Tipo de examen" requerido icono="labs" placeholder="Por ejemplo, hemograma" valor={v("tipo_examen")} onCambio={set("tipo_examen")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Laboratorio" icono="science" placeholder="Opcional" valor={v("laboratorio")} onCambio={set("laboratorio")} />
            <Campo etiqueta="Fecha" requerido type="date" valor={v("fecha")} onCambio={set("fecha")} />
          </div>
          <AreaTexto etiqueta="Resultado principal" placeholder="Lo más importante del resultado" valor={v("resultado_principal")} onCambio={set("resultado_principal")} />
          <Selector
            etiqueta="Resultado"
            valor={v("resultado")}
            onCambio={set("resultado")}
            opciones={[
              { valor: "normal", etiqueta: "Resultado normal" },
              { valor: "alterado", etiqueta: "Alterado" },
            ]}
          />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Solicitado por" icono="person" placeholder="Opcional" valor={v("solicitado_por")} onCambio={set("solicitado_por")} />
            <Campo etiqueta="Próximo control" type="date" valor={v("proximo_control")} onCambio={set("proximo_control")} />
          </div>
          <BloqueSoporte etiqueta="Soporte" textoArea="Foto o PDF (opcional)" iconoArea="upload_file" soportes={soportes} onCambio={setSoportes} />
        </>
      )}

      {tipo === "tratamiento" && (
        <>
          <Campo etiqueta="Medicamento" requerido icono="medication" placeholder="Nombre y concentración" valor={v("medicamento")} onCambio={set("medicamento")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Dosis" placeholder="1 cápsula" valor={v("dosis")} onCambio={set("dosis")} />
            <Campo etiqueta="Vía" placeholder="Oral" valor={v("via")} onCambio={set("via")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Frecuencia" placeholder="Cada 12 h" valor={v("frecuencia")} onCambio={set("frecuencia")} />
            <Campo etiqueta="Duración" placeholder="7 días" valor={v("duracion_dias")} onCambio={set("duracion_dias")} />
          </div>
          <HorariosToma frecuencia={v("frecuencia")} />
          <BloqueSoporte textoArea="Foto de la fórmula (opcional)" iconoArea="receipt_long" soportes={soportes} onCambio={setSoportes} />
        </>
      )}

      {tipo === "peso" && (
        <>
          <Campo etiqueta="Peso (kg)" requerido icono="monitor_weight" inputMode="decimal" placeholder="0,0" valor={v("peso_kg")} onCambio={set("peso_kg")} />
          <Campo etiqueta="Fecha de la medición" type="date" icono="event" valor={v("fecha")} onCambio={set("fecha")} />
          <GraficaPeso mediciones={mediciones.filter((m) => m.mascotaId === mascota.id)} nuevo={v("peso_kg")} fecha={v("fecha") || HOY} />
        </>
      )}

      {esE7 && (
        <>
          <AreaTexto
            etiqueta="¿Qué cambió?"
            requerido
            placeholder={tipo === "alimentacion" ? "Por ejemplo, cambiamos de concentrado" : "Por ejemplo, ladra de noche"}
            valor={v("que_cambio")}
            onCambio={set("que_cambio")}
          />
          <Campo etiqueta="Fecha" type="date" icono="event" valor={v("fecha")} onCambio={set("fecha")} />
          <BloqueSoporte aceptaPdf={false} soportes={soportes} onCambio={setSoportes} />
        </>
      )}

      {tipo === "otro" && (
        <>
          <Campo etiqueta="¿Qué pasó?" requerido icono="edit" placeholder="Título del evento" valor={v("titulo")} onCambio={set("titulo")} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Fecha" requerido type="date" icono="event" valor={v("fecha")} onCambio={set("fecha")} />
            <Campo etiqueta="Lugar" icono="place" placeholder="Casa" valor={v("lugar")} onCambio={set("lugar")} />
          </div>
          <AreaTexto etiqueta="Detalle" placeholder="Describe lo que quieres recordar de este evento." valor={v("detalle")} onCambio={set("detalle")} />
          <BloqueSoporte aceptaPdf={false} soportes={soportes} onCambio={setSoportes} />
        </>
      )}

      <BarraAccion>
        <Boton disabled={!completo} onClick={guardar}>
          Guardar evento
        </Boton>
      </BarraAccion>

      <DialogoSalir
        abierto={confirmarSalida}
        objeto="de este evento"
        onSeguir={() => setConfirmarSalida(false)}
        onSalir={() => router.push("/")}
      />
    </main>
  )
}

/** Fila "Crear horarios de toma" de E5: muestra las horas según la frecuencia. */
function HorariosToma({ frecuencia }: { frecuencia: string }) {
  const horas = Number.parseInt(frecuencia.replace(/\D+/g, " ").trim().split(" ")[0] ?? "", 10)
  const tomas =
    horas > 0 && horas <= 24
      ? Array.from({ length: Math.floor(24 / horas) }, (_, i) => `${String((8 + i * horas) % 24).padStart(2, "0")}:00`)
      : []
  return (
    <div className="flex items-center gap-3 rounded-md bg-superficie p-3.5">
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre="schedule" className="icono-m" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="texto-cuerpo-fuerte text-texto">Crear horarios de toma</span>
        <span className="texto-etiqueta text-texto-secundario">
          {tomas.length ? tomas.join(" · ") : "Escribe la frecuencia, por ejemplo «Cada 12 h»"}
        </span>
      </span>
    </div>
  )
}
