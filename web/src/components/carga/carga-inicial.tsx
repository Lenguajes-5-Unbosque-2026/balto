"use client"

import { BotonVolver } from "@/components/boton-volver"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, type ReactNode } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { AreaTexto, Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaInterruptor } from "@/components/fila-interruptor"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { OpcionCasilla } from "@/components/opcion-casilla"
import { Pasos } from "@/components/pasos"
import { textoTamano } from "@/components/registro/bloque-soporte"
import { TarjetaEvento } from "@/components/tarjeta-evento"
import type { Evento, Soporte, TipoEvento } from "@/lib/eventos"
import { HOY, diasEntre, fechaNumerica, sumarDias } from "@/lib/fecha"
import { useMascotaActiva, useMascotas } from "@/lib/mascota-activa"
import { horasDesde } from "@/lib/medicamentos"
import { guardarEvento, guardarMascotaActiva } from "@/lib/registro-local"
import { guardarTratamiento } from "@/lib/usar-medicamentos"
import { guardarSalud } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

const OPCIONES = [
  { slug: "carnet", nombre: "Carnet de vacunación", detalle: "Foto o escaneo", icono: "badge", paso: "Carnet" },
  { slug: "examenes", nombre: "Exámenes o laboratorios", detalle: "PDF o foto", icono: "lab_profile", paso: "Exámenes" },
  { slug: "formulas", nombre: "Fórmulas o tratamientos activos", detalle: "Foto de la fórmula", icono: "receipt_long", paso: "Tratamientos" },
  { slug: "historial", nombre: "Historial en WhatsApp o correo", detalle: "Texto copiado", icono: "chat", paso: "Historial" },
] as const

type Opcion = (typeof OPCIONES)[number]["slug"] | "nada"
type Archivo = Soporte
type Vacuna = { vacuna: string; fecha: string; veterinaria: string; proximo_refuerzo: string }
type Fase = "subir" | "leyendo" | "revisar" | "fallo"

const MAX_KB = 10 * 1024
const CLASES = [
  { tipo: "consulta", nombre: "Consulta", icono: "stethoscope", campo: "motivo" },
  { tipo: "vacuna", nombre: "Vacuna", icono: "vaccines", campo: "vacuna" },
  { tipo: "examen", nombre: "Examen", icono: "labs", campo: "tipo_examen" },
  { tipo: "tratamiento", nombre: "Tratamiento", icono: "medication", campo: "medicamento" },
  { tipo: "comportamiento", nombre: "Comportamiento", icono: "psychology", campo: "que_cambio" },
] as const

/** Archivo elegido → soporte (o null si no es JPG, PNG o PDF de hasta 10 MB: C13). */
function aSoporte(f: File): Archivo | null {
  const tipo = f.type === "application/pdf" ? "pdf" : f.type === "image/png" ? "png" : f.type === "image/jpeg" ? "jpg" : null
  if (!tipo || f.size / 1024 > MAX_KB) return null
  return { nombre: f.name, tipo, tamanoKb: Math.round(f.size / 1024) }
}

/** C1 a C13 · Carga inicial de datos (obligatoria) de la mascota (/carga-inicial?mascota=m01). */
export function CargaInicial({ mascotas }: { mascotas: { id: string; nombre: string; especie: string; alergias?: string[] }[] }) {
  const router = useRouter()
  const id = useSearchParams().get("mascota")
  const [activa] = useMascotaActiva(mascotas)
  // También las mascotas recién creadas en B.
  const mascota = useMascotas(mascotas).find((m) => m.id === id) ?? activa
  const [elegidas, setElegidas] = useState<Opcion[]>([])
  const [indice, setIndice] = useState(-1)
  const [fase, setFase] = useState<Fase>("subir")
  const [archivo, setArchivo] = useState<Archivo | null>(null)
  const [guardados, setGuardados] = useState<Evento[]>([])
  const [alertas, setAlertas] = useState(0)

  const pasos = elegidas.includes("nada") ? (["nada"] as Opcion[]) : OPCIONES.map((o) => o.slug).filter((s) => elegidas.includes(s))
  const actual = pasos[indice]
  const info = OPCIONES.find((o) => o.slug === actual)
  const nombre = mascota.nombre

  function alternar(o: Opcion) {
    // "No tengo nada guardado" excluye las demás opciones.
    if (o === "nada") setElegidas((x) => (x.includes("nada") ? [] : ["nada"]))
    else setElegidas((x) => (x.includes(o) ? x.filter((y) => y !== o) : [...x.filter((y) => y !== "nada"), o]))
  }

  function registrar(eventos: Omit<Evento, "id" | "mascota_id" | "fecha_creacion">[]) {
    const nuevos = eventos.map((e) => ({ ...e, id: crypto.randomUUID(), mascota_id: mascota.id, fecha_creacion: HOY }) as Evento)
    for (const e of nuevos) guardarEvento(e)
    setGuardados((x) => [...x, ...nuevos])
    return nuevos
  }

  function siguiente() {
    setArchivo(null)
    setFase("subir")
    setIndice((i) => i + 1)
  }

  function volver() {
    if (fase !== "subir") setFase("subir")
    else if (indice <= 0) setIndice(-1)
    else setIndice((i) => i - 1)
  }

  const pasosUi = info && <Pasos paso={indice + 1} total={pasos.length} nombre={info.paso} />
  const encabezado = (titulo: string) => <Encabezado titulo={titulo} izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />

  // C1 · ¿Qué información tienes a la mano?
  if (indice === -1) {
    return (
      <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
        <Encabezado titulo="Información inicial" izquierda={<BotonVolver respaldo="/" />} />
        <h1 className="texto-titulo-pantalla text-texto">¿Qué información de {nombre} tienes a la mano?</h1>
        <p className="-mt-1 texto-cuerpo text-texto-secundario">Elige todo lo que aplique. Puedes subir más después.</p>
        {OPCIONES.map((o) => (
          <OpcionCasilla key={o.slug} icono={o.icono} titulo={o.nombre} marcada={elegidas.includes(o.slug)} onCambio={() => alternar(o.slug)} />
        ))}
        <OpcionCasilla icono="block" titulo="No tengo nada guardado" marcada={elegidas.includes("nada")} onCambio={() => alternar("nada")} />
        <BarraAccion>
          <Boton disabled={elegidas.length === 0} onClick={() => setIndice(0)}>
            Empezar carga
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  // C7 · Resumen de carga inicial
  if (indice >= pasos.length) {
    const soportes = guardados.reduce((s, e) => s + (e.soportes?.length ?? 0), 0)
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Resumen" derecha={<BotonVolver respaldo="/" cerrar />} />
        <Estado tono="exito" icono="check_circle" titulo={guardados.length ? `¡El perfil de ${nombre} ya tiene historia!` : `${nombre} quedó listo`} />
        <div className="grid grid-cols-3 gap-2">
          <Ficha numero={guardados.length} texto="Eventos" className="bg-primario text-superficie" />
          <Ficha numero={soportes} texto="Soportes" className="bg-acento text-texto" />
          <Ficha numero={alertas} texto="Alertas" className="bg-error-suave text-error" />
        </div>
        {guardados.slice(0, 3).map((e) => (
          <TarjetaEvento key={e.id} evento={e} href={`/evento?id=${e.id}`} variante="borde" />
        ))}
        <button
          type="button"
          onClick={() => {
            setElegidas([])
            setIndice(-1)
          }}
          className="self-center p-2 texto-etiqueta-fuerte text-primario"
        >
          Agregar más archivos
        </button>
        <BarraAccion>
          <Boton
            onClick={() => {
              guardarMascotaActiva(mascota.id)
              // O5 la primera vez que se llega a Inicio, si el navegador aún no dio permiso.
              const pedir = typeof Notification !== "undefined" && Notification.permission === "default"
              router.push(pedir ? "/permisos/notificaciones?siguiente=/" : "/")
            }}
          >
            Ir al perfil de {nombre}
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  // C12 · Leyendo el documento
  if (fase === "leyendo" && archivo) {
    return <Leyendo archivo={archivo} buscando={actual === "carnet" ? "vacunas y fechas" : actual === "formulas" ? "medicamento y dosis" : "tipo, fecha y resultado"} pasos={pasosUi} onListo={() => setFase("revisar")} onCancelar={() => { setArchivo(null); setFase("subir") }} />
  }

  // C13 · No pudimos leer el archivo
  if (fase === "fallo") {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado("Carga inicial")}
        <Estado tono="error" icono="broken_image" titulo="No pudimos leer el archivo" mensaje="La foto quedó borrosa o el formato no es compatible." />
        <Nota>Aceptamos JPG, PNG y PDF de hasta 10 MB.</Nota>
        <FilaOpcion icono="photo_camera" titulo="Tomar la foto otra vez" detalle="Con buena luz y sin reflejos" onClick={() => setFase("subir")} />
        <FilaOpcion icono="edit" titulo="Escribir los datos a mano" detalle="Sin subir archivo" onClick={() => setFase("subir")} />
        <BarraAccion>
          <Boton onClick={() => setFase("subir")}>Tomar otra foto</Boton>
          <Boton variante="secundario" onClick={() => setFase("subir")}>
            Escribir a mano
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  const elegirArchivo = (f?: File) => {
    if (!f) return
    const s = aSoporte(f)
    if (!s) setFase("fallo")
    else setArchivo(s)
  }

  if (actual === "carnet") {
    return (
      <PasoCarnet
        nombre={nombre}
        pasos={pasosUi}
        encabezado={encabezado("Carnet de vacunación")}
        fase={fase}
        archivo={archivo}
        onArchivo={(f) => {
          elegirArchivo(f)
          if (f && aSoporte(f)) setFase("leyendo")
        }}
        onTomarOtra={() => {
          setArchivo(null)
          setFase("subir")
        }}
        onGuardar={(vacunas) => {
          const nuevos = registrar(
            vacunas.map((v, i) => ({
              tipo: (/despara/i.test(v.vacuna) ? "desparasitacion" : "vacuna") as TipoEvento,
              fecha: v.fecha,
              ...(/despara/i.test(v.vacuna) ? { producto: v.vacuna, proxima_dosis: v.proximo_refuerzo } : { vacuna: v.vacuna, proximo_refuerzo: v.proximo_refuerzo }),
              veterinaria: v.veterinaria,
              recordatorio: String(!!v.proximo_refuerzo),
              // La foto del carnet queda como soporte de la primera vacuna.
              soportes: i === 0 && archivo ? [archivo] : [],
            })),
          )
          setAlertas((x) => x + nuevos.filter((e) => (e.proximo_refuerzo || e.proxima_dosis) && (e.proximo_refuerzo || e.proxima_dosis)! >= HOY).length)
          siguiente()
        }}
      />
    )
  }

  if (actual === "examenes") {
    return (
      <PasoExamen
        pasos={pasosUi}
        encabezado={encabezado("Examen o laboratorio")}
        fase={fase}
        archivo={archivo}
        onArchivo={elegirArchivo}
        onQuitar={() => setArchivo(null)}
        onLeer={() => setFase("leyendo")}
        onCorregir={() => setFase("subir")}
        onGuardar={(d) => {
          registrar([{ tipo: "examen", fecha: d.fecha, tipo_examen: d.tipo, resultado_principal: d.resultado, resultado: "normal", soportes: archivo ? [archivo] : [] }])
          siguiente()
        }}
      />
    )
  }

  if (actual === "formulas") {
    return (
      <PasoFormula
        nombre={nombre}
        pasos={pasosUi}
        encabezado={encabezado("Fórmula o tratamiento")}
        fase={fase}
        archivo={archivo}
        onArchivo={elegirArchivo}
        onLeer={() => setFase("leyendo")}
        onCorregir={() => setFase("subir")}
        onGuardar={(d) => {
          const frecuencia = [8, 12, 24].includes(d.cada) ? `cada_${d.cada}h` : d.cada ? `Cada ${d.cada} h` : ""
          const duracion = d.desde && d.hasta ? Math.max(diasEntre(d.desde, d.hasta), 1) : 7
          const [ev] = registrar([
            { tipo: "tratamiento", fecha: d.desde || HOY, medicamento: d.medicamento, dosis: d.dosis, frecuencia, duracion_dias: String(duracion), soportes: archivo ? [archivo] : [] },
          ])
          if (d.recordatorio) {
            guardarTratamiento(crypto.randomUUID(), {
              mascota_id: mascota.id,
              evento_id: ev.id,
              medicamento: d.medicamento,
              presentacion: "",
              via: "oral",
              dosis: d.dosis,
              frecuencia: frecuencia.startsWith("cada_") ? frecuencia : "cada_24h",
              dias_semana: "",
              fecha_inicio: d.desde || HOY,
              duracion_dias: String(duracion),
              fecha_fin: sumarDias(d.desde || HOY, duracion),
              prescrito_por: "",
              estado: "vigente",
              finalizado_antes: "false",
              recordatorio: "true",
              horas: horasDesde("08:00", frecuencia.startsWith("cada_") ? frecuencia : "cada_24h"),
            })
          }
          siguiente()
        }}
      />
    )
  }

  if (actual === "historial") {
    return (
      <PasoHistorial
        nombre={nombre}
        pasos={pasosUi}
        encabezado={encabezado(fase === "revisar" ? "Revisar historial" : "Historial en chats")}
        fase={fase}
        onDetectar={() => setFase("revisar")}
        onCorregir={() => setFase("subir")}
        onGuardar={(eventos) => {
          registrar(
            eventos.map((e) => {
              const c = CLASES.find((x) => x.tipo === e.tipo)!
              return { tipo: e.tipo, fecha: e.fecha, [c.campo]: e.texto, ...(e.tipo === "examen" ? { resultado: "normal" } : {}) } as Omit<Evento, "id" | "mascota_id" | "fecha_creacion">
            }),
          )
          siguiente()
        }}
      />
    )
  }

  // C6 · Sin historial previo
  return (
    <PasoBasico
      alergiasActuales={mascota.alergias ?? []}
      encabezado={encabezado("Carga inicial")}
      onGuardar={(peso, alergias) => {
        registrar([{ tipo: "peso", fecha: HOY, peso_kg: String(peso) }])
        guardarSalud(mascota.id, { alergias })
        siguiente()
      }}
    />
  )
}

function Ficha({ numero, texto, className }: { numero: number; texto: string; className: string }) {
  return (
    <div className={cn("flex h-17 flex-col justify-center rounded-md px-3", className)}>
      <span className="texto-titulo-tarjeta">{numero}</span>
      <span className="texto-etiqueta">{texto}</span>
    </div>
  )
}

/** Área punteada de la cámara con Cámara, Galería y PDF (C2, C4). */
function AreaArchivo({ texto, archivo, onArchivo }: { texto: string; archivo: Archivo | null; onArchivo: (f?: File) => void }) {
  const camara = useRef<HTMLInputElement>(null)
  const galeria = useRef<HTMLInputElement>(null)
  const pdf = useRef<HTMLInputElement>(null)
  return (
    <>
      <button
        type="button"
        onClick={() => camara.current?.click()}
        className="flex h-48 flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-primario bg-acento-suave text-texto-secundario"
      >
        <Icono nombre={archivo ? (archivo.tipo === "pdf" ? "picture_as_pdf" : "image") : "photo_camera"} className="icono-xl text-primario" />
        <span className="px-4 text-center texto-etiqueta">{archivo ? `${archivo.nombre} · ${textoTamano(archivo.tamanoKb)}` : texto}</span>
      </button>
      <div className="flex flex-wrap gap-2">
        <Chip texto="Cámara" icono="photo_camera" onClick={() => camara.current?.click()} />
        <Chip texto="Galería" icono="photo_library" onClick={() => galeria.current?.click()} />
        <Chip texto="PDF" icono="picture_as_pdf" onClick={() => pdf.current?.click()} />
      </div>
      <input ref={camara} type="file" accept="image/*" capture="environment" hidden onChange={(e) => onArchivo(e.target.files?.[0])} />
      <input ref={galeria} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => onArchivo(e.target.files?.[0])} />
      <input ref={pdf} type="file" accept="application/pdf" hidden onChange={(e) => onArchivo(e.target.files?.[0])} />
    </>
  )
}

/** C12 · Leyendo el documento: progreso por etapas. */
function Leyendo({ archivo, buscando, pasos, onListo, onCancelar }: { archivo: Archivo; buscando: string; pasos: ReactNode; onListo: () => void; onCancelar: () => void }) {
  useEffect(() => {
    const t = setTimeout(onListo, 2200)
    return () => clearTimeout(t)
  }, [onListo])
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Carga inicial" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={onCancelar} />} />
      <div className="flex flex-col items-center gap-3 pt-2 text-center">
        <span className="grid size-26 animate-pulse place-items-center rounded-completo bg-exito text-oscuro">
          <Icono nombre="hourglass_top" className="icono-estado" />
        </span>
        <h1 className="texto-titulo-pantalla text-texto">Leyendo tu documento</h1>
        <p className="texto-cuerpo text-texto-secundario">Esto toma unos segundos. Puedes dejar la app abierta.</p>
      </div>
      {pasos}
      <FilaOpcion tono="exito" icono="check_circle" titulo={archivo.tipo === "pdf" ? "Archivo recibido" : "Foto recibida"} detalle={`${archivo.nombre} · ${textoTamano(archivo.tamanoKb)}`} derecha={<span />} />
      <FilaOpcion icono="sync" titulo={`Buscando ${buscando}`} detalle="En proceso" derecha={<span />} />
      <BarraAccion>
        <Boton variante="secundario" onClick={onCancelar}>
          Cancelar
        </Boton>
      </BarraAccion>
    </main>
  )
}

const VACUNA_VACIA: Vacuna = { vacuna: "", fecha: "", veterinaria: "", proximo_refuerzo: "" }

/** C2 · Subir carnet (con vacunas etiquetadas) → C12 → C8 · Revisar vacunas. */
function PasoCarnet(props: {
  nombre: string
  pasos: ReactNode
  encabezado: ReactNode
  fase: Fase
  archivo: Archivo | null
  onArchivo: (f?: File) => void
  onTomarOtra: () => void
  onGuardar: (v: Vacuna[]) => void
}) {
  const [vacunas, setVacunas] = useState<Vacuna[]>([])
  const [editando, setEditando] = useState<number | null>(null)
  const revisar = props.fase === "revisar"

  const lista = vacunas.map((v, i) => (
    <FilaOpcion
      key={i}
      icono={/despara/i.test(v.vacuna) ? "pest_control" : "vaccines"}
      titulo={v.vacuna}
      detalle={[v.fecha && fechaNumerica(v.fecha), v.veterinaria || (revisar && !props.archivo ? "sin soporte" : "")].filter(Boolean).join(" · ")}
      derecha={<Icono nombre="edit" className="icono-m text-texto-secundario" />}
      onClick={() => setEditando(i)}
    />
  ))
  const hoja = (
    <Hoja abierta={editando !== null} onCerrar={() => setEditando(null)} titulo={editando === vacunas.length ? "Agregar vacuna" : "Editar vacuna"}>
      {editando !== null && (
        <EditarVacuna
          inicial={vacunas[editando] ?? VACUNA_VACIA}
          onQuitar={editando < vacunas.length ? () => { setVacunas((x) => x.filter((_, j) => j !== editando)); setEditando(null) } : undefined}
          onListo={(v) => {
            setVacunas((x) => (editando < x.length ? x.map((y, j) => (j === editando ? v : y)) : [...x, v]))
            setEditando(null)
          }}
        />
      )}
    </Hoja>
  )

  if (revisar) {
    return (
      <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
        {props.encabezado}
        {props.pasos}
        <h1 className="texto-titulo-tarjeta text-texto">Esto encontramos en el carnet</h1>
        <Nota icono="fact_check">Revisa y corrige antes de guardar. Tú tienes la última palabra.</Nota>
        {vacunas.length ? lista : <p className="py-2 texto-cuerpo text-texto-secundario">Agrega las vacunas que ves en el carnet.</p>}
        <button type="button" onClick={() => setEditando(vacunas.length)} className="self-center p-2 texto-etiqueta-fuerte text-primario">
          Agregar una vacuna que falte
        </button>
        <BarraAccion>
          <Boton disabled={!vacunas.length} onClick={() => props.onGuardar(vacunas)} className="px-2 texto-cuerpo-fuerte">
            Confirmar y guardar
          </Boton>
          <Boton variante="secundario" onClick={props.onTomarOtra} className="px-2 texto-cuerpo-fuerte">
            Tomar otra foto
          </Boton>
        </BarraAccion>
        {hoja}
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      {props.encabezado}
      {props.pasos}
      <AreaArchivo texto="Vista de cámara · encuadra el carnet" archivo={props.archivo} onArchivo={props.onArchivo} />
      <div className="mt-1 flex items-center justify-between">
        <h2 className="texto-titulo-seccion font-semibold text-texto">Vacunas etiquetadas</h2>
        <button type="button" onClick={() => setEditando(vacunas.length)} className="texto-etiqueta-fuerte text-primario">
          Agregar
        </button>
      </div>
      {vacunas.length ? lista : <p className="texto-etiqueta text-texto-secundario">Toma la foto del carnet o agrega las vacunas de {props.nombre} a mano.</p>}
      <BarraAccion>
        <Boton disabled={!vacunas.length} onClick={() => props.onGuardar(vacunas)}>
          Guardar y seguir
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
      {hoja}
    </main>
  )
}

function EditarVacuna({ inicial, onListo, onQuitar }: { inicial: Vacuna; onListo: (v: Vacuna) => void; onQuitar?: () => void }) {
  const [v, setV] = useState(inicial)
  const set = (k: keyof Vacuna) => (x: string) => setV((y) => ({ ...y, [k]: x }))
  return (
    <div className="flex flex-col gap-3">
      <Campo etiqueta="Vacuna o desparasitación" requerido icono="vaccines" placeholder="Antirrábica" sugerencias={["Antirrábica", "Múltiple DHPPi+L", "Tos de las perreras", "Triple felina", "Desparasitación"]} valor={v.vacuna} onCambio={set("vacuna")} />
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Fecha aplicada" type="date" max={HOY} valor={v.fecha} onCambio={set("fecha")} />
        <Campo etiqueta="Próximo refuerzo" type="date" valor={v.proximo_refuerzo} onCambio={set("proximo_refuerzo")} />
      </div>
      <Campo etiqueta="Veterinaria" icono="local_hospital" placeholder="Opcional" valor={v.veterinaria} onCambio={set("veterinaria")} />
      <div className="mt-2 flex gap-2.5">
        {onQuitar && (
          <Boton variante="destructivo-contorno" onClick={onQuitar}>
            Quitar
          </Boton>
        )}
        <Boton disabled={!v.vacuna.trim() || !v.fecha} onClick={() => onListo(v)}>
          Listo
        </Boton>
      </div>
    </div>
  )
}

/** C3 · Subir examen → C12 → C9 · Revisar examen detectado. */
function PasoExamen(props: {
  pasos: ReactNode
  encabezado: ReactNode
  fase: Fase
  archivo: Archivo | null
  onArchivo: (f?: File) => void
  onQuitar: () => void
  onLeer: () => void
  onCorregir: () => void
  onGuardar: (d: { tipo: string; fecha: string; resultado: string }) => void
}) {
  const [d, setD] = useState({ tipo: "", fecha: "", resultado: "" })
  const pdf = useRef<HTMLInputElement>(null)
  const revisar = props.fase === "revisar"
  const completo = d.tipo.trim() && d.fecha
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {props.encabezado}
      {props.pasos}
      {props.archivo ? (
        <div className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre={props.archivo.tipo === "pdf" ? "picture_as_pdf" : "image"} className="icono-m" />
          </span>
          <span className="flex min-w-0 flex-1 flex-col">
            <span className="truncate texto-cuerpo-fuerte text-texto">{props.archivo.nombre}</span>
            <span className="texto-etiqueta text-texto-secundario">
              {props.archivo.tipo === "pdf" ? "PDF" : "Foto"} · {textoTamano(props.archivo.tamanoKb)} · {revisar ? "Leído" : "Cargado"}
            </span>
          </span>
          {!revisar && (
            <button type="button" aria-label="Quitar archivo" onClick={props.onQuitar} className="text-texto-secundario">
              <Icono nombre="close" className="icono-m" />
            </button>
          )}
        </div>
      ) : (
        <>
          <FilaOpcion borde icono="upload_file" titulo="Subir el examen" detalle="PDF o foto, hasta 10 MB" onClick={() => pdf.current?.click()} />
          <input ref={pdf} type="file" accept="application/pdf,image/jpeg,image/png" hidden onChange={(e) => props.onArchivo(e.target.files?.[0])} />
        </>
      )}
      {revisar && <Nota icono="edit_note">Si algún dato quedó mal leído, corrígelo aquí.</Nota>}
      <Campo etiqueta="Tipo de examen" icono="labs" placeholder="Hemograma completo" valor={d.tipo} onCambio={(v) => setD((x) => ({ ...x, tipo: v }))} />
      <Campo etiqueta="Fecha" type="date" icono="event" max={HOY} valor={d.fecha} onCambio={(v) => setD((x) => ({ ...x, fecha: v }))} />
      <AreaTexto etiqueta="Resultado principal" placeholder="Valores dentro de rangos normales." valor={d.resultado} onCambio={(v) => setD((x) => ({ ...x, resultado: v }))} />
      <BarraAccion>
        {revisar ? (
          <>
            <Boton disabled={!completo} onClick={() => props.onGuardar(d)}>
              Confirmar
            </Boton>
            <Boton variante="secundario" onClick={props.onCorregir} className="px-2 texto-cuerpo-fuerte">
              Corregir datos
            </Boton>
          </>
        ) : (
          <Boton disabled={!completo} onClick={() => (props.archivo ? props.onLeer() : props.onGuardar(d))}>
            Guardar y seguir
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        )}
      </BarraAccion>
    </main>
  )
}

/** C4 · Subir fórmula → C12 → C10 · Revisar fórmula detectada. */
function PasoFormula(props: {
  nombre: string
  pasos: ReactNode
  encabezado: ReactNode
  fase: Fase
  archivo: Archivo | null
  onArchivo: (f?: File) => void
  onLeer: () => void
  onCorregir: () => void
  onGuardar: (d: { medicamento: string; dosis: string; cada: number; desde: string; hasta: string; recordatorio: boolean }) => void
}) {
  const [d, setD] = useState({ medicamento: "", dosis: "", cada: "", desde: HOY, hasta: "", recordatorio: true })
  const set = (k: "medicamento" | "dosis" | "cada" | "desde" | "hasta") => (v: string) => setD((x) => ({ ...x, [k]: v }))
  const revisar = props.fase === "revisar"
  const datos = { ...d, cada: Number.parseInt(d.cada, 10) || 0 }
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {props.encabezado}
      {props.pasos}
      {!revisar && <AreaArchivo texto="Foto de la fórmula médica" archivo={props.archivo} onArchivo={props.onArchivo} />}
      <Campo etiqueta="Medicamento" icono="medication" placeholder="Amoxicilina 250 mg" valor={d.medicamento} onCambio={set("medicamento")} />
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Dosis" icono="straighten" placeholder="1 cápsula" valor={d.dosis} onCambio={set("dosis")} />
        <Campo etiqueta="Cada (horas)" icono="schedule" inputMode="numeric" placeholder="12" valor={d.cada} onCambio={(v) => set("cada")(v.replace(/\D/g, ""))} />
      </div>
      {revisar && (
        <div className="grid grid-cols-2 gap-3">
          <Campo etiqueta="Desde" type="date" icono="event" valor={d.desde} onCambio={set("desde")} />
          <Campo etiqueta="Hasta" type="date" icono="event_busy" valor={d.hasta} onCambio={set("hasta")} />
        </div>
      )}
      {revisar ? (
        <Nota tono="error" icono="warning">
          Confirma la dosis con tu veterinario antes de activar los recordatorios.
        </Nota>
      ) : (
        <div className="rounded-md bg-superficie p-3.5">
          <FilaInterruptor icono="notifications_active" titulo="Activar recordatorios desde hoy" detalle={`Te avisamos cada toma de ${props.nombre}`} activo={d.recordatorio} onCambio={(a) => setD((x) => ({ ...x, recordatorio: a }))} />
        </div>
      )}
      <BarraAccion>
        {revisar ? (
          <>
            <Boton disabled={!d.medicamento.trim()} onClick={() => props.onGuardar(datos)}>
              Confirmar
            </Boton>
            <Boton variante="secundario" onClick={props.onCorregir} className="px-2 texto-cuerpo-fuerte">
              Corregir datos
            </Boton>
          </>
        ) : (
          <Boton disabled={!d.medicamento.trim()} onClick={() => (props.archivo ? props.onLeer() : props.onGuardar(datos))}>
            Guardar y seguir
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        )}
      </BarraAccion>
    </main>
  )
}

type EventoTexto = { texto: string; tipo: (typeof CLASES)[number]["tipo"]; fecha: string }

/** C5 · Transcribir historial de chats → C11 · Revisar eventos del historial (un evento por línea o por punto y coma). */
function PasoHistorial(props: {
  nombre: string
  pasos: ReactNode
  encabezado: ReactNode
  fase: Fase
  onDetectar: () => void
  onCorregir: () => void
  onGuardar: (e: EventoTexto[]) => void
}) {
  const [texto, setTexto] = useState("")
  const [tipo, setTipo] = useState<EventoTexto["tipo"]>("consulta")
  const [fecha, setFecha] = useState(HOY)
  const [eventos, setEventos] = useState<EventoTexto[]>([])

  function detectar() {
    const partes = texto
      .split(/\n|;/)
      .map((x) => x.replace(/^["“”\s-]+|["“”\s]+$/g, "").trim())
      .filter((x) => x.length > 2)
    setEventos(partes.map((t) => ({ texto: t, tipo, fecha })))
    props.onDetectar()
  }

  if (props.fase === "revisar") {
    return (
      <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
        {props.encabezado}
        {props.pasos}
        <h1 className="texto-titulo-tarjeta text-texto">
          {eventos.length ? `Detectamos ${eventos.length} ${eventos.length === 1 ? "evento" : "eventos"} en el texto` : "No encontramos eventos en el texto"}
        </h1>
        {eventos.map((e, i) => (
          <div key={i} className="flex flex-col gap-2.5 rounded-md bg-superficie p-3.5">
            <p className="texto-cuerpo text-texto">{e.texto}</p>
            <div className="sin-barra-desplazamiento -mx-3.5 flex gap-2 overflow-x-auto px-3.5">
              {CLASES.map((c) => (
                <Chip key={c.tipo} texto={c.nombre} icono={c.icono} activo={e.tipo === c.tipo} onClick={() => setEventos((x) => x.map((y, j) => (j === i ? { ...y, tipo: c.tipo } : y)))} />
              ))}
              <Chip texto="Descartar" icono="delete" onClick={() => setEventos((x) => x.filter((_, j) => j !== i))} />
            </div>
          </div>
        ))}
        <BarraAccion>
          <Boton disabled={!eventos.length} onClick={() => props.onGuardar(eventos)} className="px-2 texto-cuerpo-fuerte">
            Guardar eventos
          </Boton>
          <Boton variante="secundario" onClick={props.onCorregir} className="px-2 texto-cuerpo-fuerte">
            {eventos.length ? "Revisar uno por uno" : "Escribir a mano"}
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {props.encabezado}
      {props.pasos}
      <AreaTexto etiqueta="Pega o escribe la información" placeholder={`"${props.nombre}, control 5 sep: dermatitis leve; champú medicado 2 veces por semana…"`} valor={texto} onCambio={setTexto} />
      <span className="texto-micro text-texto-secundario">Clasifica este dato como</span>
      <div className="flex flex-wrap gap-2">
        {CLASES.map((c) => (
          <Chip key={c.tipo} texto={c.nombre} icono={c.icono} activo={tipo === c.tipo} onClick={() => setTipo(c.tipo)} />
        ))}
      </div>
      <Campo etiqueta="Fecha del evento" type="date" icono="event" max={HOY} valor={fecha} onCambio={setFecha} />
      <BarraAccion>
        <Boton disabled={!texto.trim()} onClick={detectar}>
          Agregar a la línea de tiempo
          <Icono nombre="add" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}

/** C6 · Sin historial previo: peso y alergias. */
function PasoBasico({ alergiasActuales, encabezado, onGuardar }: { alergiasActuales: string[]; encabezado: ReactNode; onGuardar: (peso: number, alergias: string[]) => void }) {
  const [peso, setPeso] = useState("")
  const [alergias, setAlergias] = useState<string[]>(alergiasActuales)
  const [ninguna, setNinguna] = useState(false)
  const [nueva, setNueva] = useState("")
  const kg = Number.parseFloat(peso.replace(",", "."))
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {encabezado}
      <Estado icono="edit_note" titulo="Empecemos con lo básico" mensaje="Si no tienes documentos, con esto el perfil ya sirve en una consulta." />
      <Campo etiqueta="Peso actual (kg)" requerido icono="monitor_weight" inputMode="decimal" placeholder="0,0" valor={peso} onCambio={setPeso} />
      <span className="texto-micro text-texto-secundario">Alergias conocidas</span>
      <div className="flex flex-wrap gap-2">
        <Chip
          texto="Ninguna conocida"
          activo={ninguna}
          onClick={() => {
            setNinguna((x) => !x)
            setAlergias([])
          }}
        />
        {alergias.map((a) => (
          <Chip key={a} texto={a} activo onClick={() => setAlergias((x) => x.filter((y) => y !== a))} />
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          const a = nueva.trim().replace(/^./, (c) => c.toUpperCase())
          if (a && !alergias.includes(a)) setAlergias((x) => [...x, a])
          setNinguna(false)
          setNueva("")
        }}
      >
        <Campo etiqueta="Agregar alergia" icono="add" placeholder="Pollo" valor={nueva} onCambio={setNueva} className="flex-1" />
        <button type="submit" disabled={!nueva.trim()} aria-label="Agregar alergia" className="mt-7 grid size-14 shrink-0 place-items-center rounded-completo bg-primario text-superficie disabled:opacity-50">
          <Icono nombre="check" className="icono-m" />
        </button>
      </form>
      <BarraAccion>
        <Boton disabled={!(kg > 0) || (!ninguna && alergias.length === 0)} onClick={() => onGuardar(kg, alergias)}>
          Guardar y continuar
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
