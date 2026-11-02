"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useSyncExternalStore } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { DialogoSalir } from "@/components/dialogo-salir"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"
import { Nota } from "@/components/nota"
import { Selector } from "@/components/selector"
import {
  ALTERNATIVAS,
  alimentoToxico,
  etapa,
  nombrePlan,
  porcionSugerida,
  repartir,
  type AlimentoToxico,
  type Comida,
  type Plan,
} from "@/lib/alimentacion"
import type { Evento } from "@/lib/eventos"
import { HOY } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import { ultimoPeso, type PerfilMascota } from "@/lib/perfil"
import { guardarEvento } from "@/lib/registro-local"
import { guardarPlan, usePlanes, type DatosAlimentacion } from "@/lib/usar-alimentacion"
import { useEventos } from "@/lib/usar-eventos"

type RegistrarProps = DatosAlimentacion & { mascotas: PerfilMascota[]; eventos: Evento[] }

const sinSuscripcion = () => () => {}

/** H2 · Registrar alimento → H3 · Alerta de alimento tóxico o H4 · Porción sugerida y horarios. */
export function RegistrarAlimento(props: RegistrarProps) {
  // El formulario toma el plan actual una sola vez: espera a leer lo guardado en este navegador.
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false)
  return listo ? <Formulario {...props} /> : null
}

function Formulario({ mascotas, eventos: base, ...datos }: RegistrarProps) {
  const router = useRouter()
  const editar = useSearchParams().get("editar") === "1"
  const [mascota] = useMascotaActiva(mascotas)
  const actual = usePlanes(datos).planes[mascota.id]
  const peso = ultimoPeso(useEventos(base).filter((e) => e.mascota_id === mascota.id))
  const kg = peso ? Number(peso.peso_kg) : 0

  const [paso, setPaso] = useState<"alimento" | "toxico" | "porcion">("alimento")
  const [tipo, setTipo] = useState<"concentrado" | "casero" | "snack">(editar && actual ? actual.tipo : "concentrado")
  const [marca, setMarca] = useState(editar && actual?.tipo === "concentrado" ? actual.marca : "")
  const [tipoAlimento, setTipoAlimento] = useState(editar && actual ? actual.tipo_alimento : "")
  const [presentacion, setPresentacion] = useState(editar && actual?.presentacion_kg ? `${actual.presentacion_kg} kg` : "")
  const [que, setQue] = useState(editar && actual?.tipo === "casero" ? actual.marca : "")
  const [gramos, setGramos] = useState(editar && actual?.tipo === "casero" ? String(actual.gramos_dia) : "")
  const [toxico, setToxico] = useState<AlimentoToxico | null>(null)
  const [salir, setSalir] = useState(false)

  const [actividad, setActividad] = useState<Plan["actividad"]>(actual?.actividad ?? "media")
  const [comidas, setComidas] = useState<Comida[]>(actual?.comidas ?? [])
  const [recordatorio, setRecordatorio] = useState(actual?.recordatorio ?? true)
  const [editando, setEditando] = useState<number | null>(null)

  const texto = tipo === "concentrado" ? `${marca} ${tipoAlimento}` : que
  const completo = tipo === "concentrado" ? marca.trim() !== "" : que.trim() !== ""
  const tocado = !editar && (marca || tipoAlimento || presentacion || que || gramos)
  const anios = Number.parseInt(mascota.edad, 10) || 0
  const sugerida = tipo === "casero" ? Number(gramos) || 0 : porcionSugerida(kg, actividad, mascota.especie)

  function cerrar() {
    if (tocado) setSalir(true)
    else volver()
  }

  function volver() {
    if (window.history.length > 1) router.back()
    else router.push("/alimentacion")
  }

  function continuar() {
    const t = alimentoToxico(texto, mascota.especie)
    if (t) {
      setToxico(t)
      setPaso("toxico")
      return
    }
    if (tipo === "snack") {
      // Un snack seguro no cambia el plan: queda como evento de alimentación.
      guardarEvento({ id: crypto.randomUUID(), mascota_id: mascota.id, tipo: "alimentacion", fecha: HOY, que_cambio: `Snack: ${que.trim()}`, fecha_creacion: HOY })
      toast.success("Snack registrado")
      volver()
      return
    }
    const total = tipo === "casero" ? Number(gramos) || 0 : porcionSugerida(kg, actividad, mascota.especie)
    if (!comidas.length || !editar) setComidas(repartir(total, actual?.comidas.length || 2))
    setPaso("porcion")
  }

  function cambiarCantidad(n: number) {
    if (n < 1 || n > 4) return
    setComidas(repartir(sugerida, n))
  }

  function cambiarActividad(a: Plan["actividad"]) {
    setActividad(a)
    if (tipo !== "casero") setComidas(repartir(porcionSugerida(kg, a, mascota.especie), comidas.length || 2))
  }

  function guardar() {
    const plan: Plan = {
      mascota_id: mascota.id,
      tipo: tipo === "casero" ? "casero" : "concentrado",
      marca: tipo === "casero" ? que.trim() : marca.trim(),
      tipo_alimento: tipo === "casero" ? "" : tipoAlimento.trim(),
      presentacion_kg: Number.parseFloat(presentacion.replace(",", ".")) || 0,
      gramos_dia: comidas.reduce((s, c) => s + c.gramos, 0),
      actividad,
      // Balto asume que la bolsa se abrió hoy cuando cambia el alimento.
      fecha_bolsa_abierta: actual && actual.marca === marca.trim() ? actual.fecha_bolsa_abierta : HOY,
      comidas,
      recordatorio,
    }
    if (actual && nombrePlan(actual) !== nombrePlan(plan)) {
      guardarEvento({
        id: crypto.randomUUID(),
        mascota_id: mascota.id,
        tipo: "alimentacion",
        fecha: HOY,
        que_cambio: `Cambió de ${actual.marca} a ${plan.marca}`,
        fecha_creacion: HOY,
      })
    }
    guardarPlan(mascota.id, plan)
    toast.success("Plan guardado")
    router.replace("/alimentacion")
  }

  if (paso === "toxico" && toxico) {
    const especie = mascota.especie === "gato" ? "gatos" : "perros"
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Registrar alimento" izquierda={<BotonIcono icono="close" etiqueta="Cerrar" onClick={volver} />} />
        <div className="pt-4">
          <Estado tono="error" icono="dangerous" titulo={`Este alimento es tóxico para ${especie}`} mensaje={toxico.razon} />
        </div>
        <h2 className="mt-1 texto-titulo-seccion font-semibold text-texto">Alternativas seguras</h2>
        <div className="flex flex-wrap gap-2">
          {ALTERNATIVAS[mascota.especie].map((a) => (
            <Chip key={a} texto={a} onClick={() => {
              setTipo("snack")
              setQue(a)
              setPaso("alimento")
            }} />
          ))}
        </div>
        <Nota icono="local_hospital">Si ya lo comió, contacta a tu veterinario de inmediato.</Nota>
        <button type="button" onClick={() => setPaso("alimento")} className="self-center p-2 texto-etiqueta-fuerte text-primario">
          Cambiar alimento
        </button>
        <BarraAccion>
          <Boton onClick={() => router.push(`/alimentacion/urgencia?alimento=${encodeURIComponent(toxico.nombre)}`)} className="px-3">
            Buscar veterinaria de urgencia
            <Icono nombre="local_hospital" className="icono-m" />
          </Boton>
        </BarraAccion>
      </main>
    )
  }

  if (paso === "porcion") {
    const total = comidas.reduce((s, c) => s + c.gramos, 0)
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        <Encabezado titulo="Porción y horarios" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setPaso("alimento")} />} />
        <section className="flex items-center gap-3.5 rounded-lg bg-primario p-4 text-superficie movil-m:p-5">
          <span className="grid size-13 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="scale" className="icono-l" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="texto-titulo-tarjeta">{total} g al día</span>
            <span className="texto-etiqueta text-sobre-oscuro-secundario">
              {tipo === "casero"
                ? "La porción que definiste"
                : kg
                  ? `Guía para ${String(kg).replace(".", ",")} kg · ${etapa(anios, mascota.sexo)} · actividad ${actividad}`
                  : `Registra el peso de ${mascota.nombre} para afinar la guía`}
            </span>
          </div>
        </section>
        <Nota>Es una guía general. Ajústala con tu veterinario.</Nota>

        {tipo !== "casero" && (
          <>
            <span className="texto-micro text-texto-secundario">Nivel de actividad</span>
            <Selector
              etiqueta="Nivel de actividad"
              valor={actividad}
              onCambio={(v) => cambiarActividad(v as Plan["actividad"])}
              opciones={[
                { valor: "baja", etiqueta: "Baja" },
                { valor: "media", etiqueta: "Media" },
                { valor: "alta", etiqueta: "Alta" },
              ]}
            />
          </>
        )}

        <div className="flex items-center justify-between">
          <span className="texto-cuerpo-fuerte text-texto">Comidas al día</span>
          <div className="flex items-center gap-3.5">
            <button
              type="button"
              aria-label="Una comida menos"
              disabled={comidas.length <= 1}
              onClick={() => cambiarCantidad(comidas.length - 1)}
              className="grid size-11 place-items-center rounded-completo bg-acento text-primario disabled:opacity-50"
            >
              <Icono nombre="remove" className="icono-m" />
            </button>
            <span className="w-4 text-center texto-titulo-seccion font-semibold text-texto">{comidas.length}</span>
            <button
              type="button"
              aria-label="Una comida más"
              disabled={comidas.length >= 4}
              onClick={() => cambiarCantidad(comidas.length + 1)}
              className="grid size-11 place-items-center rounded-completo bg-primario text-superficie disabled:opacity-50"
            >
              <Icono nombre="add" className="icono-m" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {comidas.map((c, i) => (
            <button
              key={`${c.nombre}-${i}`}
              type="button"
              onClick={() => setEditando(i)}
              className="flex items-center gap-3.5 rounded-md border border-borde-fuerte bg-superficie p-3.5 text-left"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
                <Icono nombre={Number(c.hora.slice(0, 2)) >= 17 ? "dark_mode" : "light_mode"} className="icono-m" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="texto-cuerpo-fuerte text-texto">{c.nombre}</span>
                <span className="texto-etiqueta text-texto-secundario">{c.gramos} g</span>
              </span>
              <span className="texto-cuerpo-fuerte text-primario">{c.hora}</span>
            </button>
          ))}
          <div className="flex items-center gap-3.5 rounded-md border border-borde-fuerte bg-superficie p-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
              <Icono nombre="notifications_active" className="icono-m" />
            </span>
            <span className="flex-1 texto-cuerpo-fuerte text-texto">Recordatorio de comida</span>
            <Interruptor etiqueta="Recordatorio de comida" activo={recordatorio} onCambio={setRecordatorio} />
          </div>
        </div>

        <BarraAccion>
          <Boton disabled={total <= 0} onClick={guardar}>
            Guardar plan
            <Icono nombre="check" className="icono-m" />
          </Boton>
        </BarraAccion>

        <Hoja abierta={editando !== null} onCerrar={() => setEditando(null)} titulo={editando !== null ? comidas[editando]?.nombre ?? "Comida" : "Comida"}>
          {editando !== null && (
            <EditarComida
              comida={comidas[editando]}
              onGuardar={(c) => {
                setComidas((x) => x.map((y, j) => (j === editando ? c : y)).sort((a, b) => a.hora.localeCompare(b.hora)))
                setEditando(null)
              }}
            />
          )}
        </Hoja>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Registrar alimento" izquierda={<BotonIcono icono="close" etiqueta="Cerrar" onClick={cerrar} />} />
      <Selector
        etiqueta="Tipo de alimento"
        valor={tipo}
        onCambio={(v) => setTipo(v as typeof tipo)}
        opciones={[
          { valor: "concentrado", etiqueta: "Concentrado" },
          { valor: "casero", etiqueta: "Casero" },
          { valor: "snack", etiqueta: "Snack" },
        ]}
      />
      {tipo === "concentrado" ? (
        <>
          <Campo etiqueta="Marca" requerido icono="storefront" placeholder="Marca del concentrado" valor={marca} onCambio={setMarca} />
          <div className="grid grid-cols-2 gap-3">
            <Campo etiqueta="Tipo" placeholder="Adulto · salmón" valor={tipoAlimento} onCambio={setTipoAlimento} />
            <Campo etiqueta="Presentación" placeholder="15 kg" inputMode="decimal" valor={presentacion} onCambio={setPresentacion} />
          </div>
        </>
      ) : (
        <>
          <Campo etiqueta="¿Qué le das?" requerido icono="restaurant" placeholder={tipo === "casero" ? "Arroz, pollo y zanahoria" : "Por ejemplo, zanahoria"} valor={que} onCambio={setQue} />
          {tipo === "casero" && <Campo etiqueta="Gramos por día" inputMode="numeric" icono="scale" placeholder="250" valor={gramos} onCambio={(v) => setGramos(v.replace(/\D/g, ""))} />}
        </>
      )}
      <Nota icono="shield">Revisaremos que el alimento sea seguro para su especie.</Nota>
      <BarraAccion>
        <Boton disabled={!completo || (tipo === "casero" && !Number(gramos))} onClick={continuar}>
          {tipo === "snack" ? "Registrar snack" : "Continuar"}
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
      <DialogoSalir abierto={salir} mensaje="Perderás los datos de este alimento." onSeguir={() => setSalir(false)} onSalir={volver} />
    </main>
  )
}

function EditarComida({ comida, onGuardar }: { comida: Comida; onGuardar: (c: Comida) => void }) {
  const [hora, setHora] = useState(comida.hora)
  const [gramos, setGramos] = useState(String(comida.gramos))
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Hora" type="time" icono="schedule" valor={hora} onCambio={setHora} />
        <Campo etiqueta="Gramos" inputMode="numeric" icono="scale" valor={gramos} onCambio={(v) => setGramos(v.replace(/\D/g, ""))} />
      </div>
      <Boton className="mt-2" disabled={!hora || !Number(gramos)} onClick={() => onGuardar({ ...comida, hora, gramos: Number(gramos) })}>
        Listo
      </Boton>
    </div>
  )
}
