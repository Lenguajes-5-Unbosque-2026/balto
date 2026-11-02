"use client"

import { useRouter } from "next/navigation"
import { useRef, useState } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, botonVariants } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { reducirFoto } from "@/components/cuenta/editar-mascota"
import { DialogoSalir } from "@/components/dialogo-salir"
import { Encabezado } from "@/components/encabezado"
import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"
import { Pasos } from "@/components/pasos"
import { Selector } from "@/components/selector"
import { DUENO_ACTUAL_ID } from "@/lib/cuenta-actual"
import { HOY } from "@/lib/fecha"
import { guardarMascotaNueva, useMascotasNuevas } from "@/lib/mascota-activa"
import { guardarEvento, guardarMascotaActiva } from "@/lib/registro-local"
import { guardarSalud } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

const RAZAS = {
  perro: ["Mestizo / no sé", "Criollo", "Golden Retriever", "Labrador Retriever", "Beagle", "Bulldog francés", "Pastor alemán", "Poodle", "Schnauzer", "Shih Tzu", "Yorkshire terrier", "Pug", "Border collie", "Chihuahua"],
  gato: ["Mestizo / no sé", "Criollo", "Persa", "Siamés", "Maine coon", "Angora", "Bengalí", "British shorthair", "Ragdoll", "Esfinge"],
}

/** "Luna" → "BAL-0006-LUNA". */
const cedula = (numero: number, nombre: string) =>
  `BAL-${String(numero).padStart(4, "0")}-${nombre.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase().replace(/[^A-Z0-9]/g, "")}`

/** B1 · Datos básicos → B2 · Foto → B4 · Salud inicial, con B8 · Salir sin guardar. */
export function NuevaMascota({ siguienteCedula }: { siguienteCedula: number }) {
  const router = useRouter()
  const nuevas = useMascotasNuevas()
  const camara = useRef<HTMLInputElement>(null)
  const galeria = useRef<HTMLInputElement>(null)
  const [paso, setPaso] = useState<1 | 2 | 3>(1)
  const [salir, setSalir] = useState(false)
  const [m, setM] = useState({ especie: "perro" as "perro" | "gato", nombre: "", raza: "", sexo: "", nacimiento: "", esterilizada: true, microchip: "", imagen: "" })
  const [salud, setSalud] = useState({ peso: "", alergias: [] as string[], nueva: "", condiciones: "", medicacion: "" })
  const [agregando, setAgregando] = useState(false)
  const set = (k: keyof typeof m) => (v: string) => setM((x) => ({ ...x, [k]: v }))

  const nombre = m.nombre.trim() || "tu mascota"
  const tocado = !!(m.nombre || m.raza || m.sexo || m.nacimiento || m.microchip || m.imagen)

  function cerrar() {
    if (tocado) setSalir(true)
    else volver()
  }

  function volver() {
    if (window.history.length > 1) router.back()
    else router.push("/")
  }

  async function foto(archivo?: File) {
    if (!archivo) return
    try {
      setM((x) => ({ ...x, imagen: "" }))
      const url = await reducirFoto(archivo)
      setM((x) => ({ ...x, imagen: url }))
    } catch {
      toast.error("No pudimos leer esa foto", { description: "Prueba con una foto JPG o PNG." })
    }
  }

  function agregarAlergia() {
    const a = salud.nueva.trim().replace(/^./, (c) => c.toUpperCase())
    if (a && !salud.alergias.includes(a)) setSalud((x) => ({ ...x, alergias: [...x.alergias, a] }))
    setSalud((x) => ({ ...x, nueva: "" }))
    setAgregando(false)
  }

  function guardar() {
    const id = crypto.randomUUID()
    const numero = siguienteCedula + Object.keys(nuevas).length
    guardarMascotaNueva({
      id,
      dueno_id: DUENO_ACTUAL_ID,
      nombre: m.nombre.trim(),
      especie: m.especie,
      raza: m.raza.trim(),
      sexo: m.sexo,
      fecha_nacimiento: m.nacimiento,
      esterilizada: String(m.esterilizada),
      microchip: m.microchip,
      cedula: cedula(numero, m.nombre.trim()),
      fecha_emision_cedula: HOY,
      imagen: m.imagen,
      alergias: salud.alergias,
    })
    const peso = Number.parseFloat(salud.peso.replace(",", "."))
    if (peso > 0) guardarEvento({ id: crypto.randomUUID(), mascota_id: id, tipo: "peso", fecha: HOY, peso_kg: String(peso), fecha_creacion: HOY })
    if (salud.medicacion.trim()) {
      guardarEvento({ id: crypto.randomUUID(), mascota_id: id, tipo: "tratamiento", fecha: HOY, medicamento: salud.medicacion.trim(), fecha_creacion: HOY })
    }
    const condicion = salud.condiciones.trim()
    if (condicion && !/^ningun/i.test(condicion)) {
      guardarSalud(id, {
        alergias: salud.alergias,
        condiciones: [{ id: crypto.randomUUID(), mascota_id: id, nombre: condicion, fecha_diagnostico: HOY, diagnosticada_por: "" }],
      })
    }
    // La mascota nueva pasa a ser la activa (spec de B).
    guardarMascotaActiva(id)
    router.replace(`/mascotas/cedula?id=${id}`)
  }

  const encabezado = (
    <Encabezado
      titulo="Nueva mascota"
      izquierda={paso === 1 ? <BotonIcono icono="close" etiqueta="Cerrar" onClick={cerrar} /> : <BotonIcono icono="arrow_back" etiqueta="Volver" onClick={() => setPaso((p) => (p - 1) as 1 | 2)} />}
    />
  )
  const dialogo = <DialogoSalir abierto={salir} mensaje="Perderás los datos que escribiste de esta mascota." onSeguir={() => setSalir(false)} onSalir={volver} />

  if (paso === 2) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado}
        <Pasos paso={2} total={3} nombre="Foto" />
        <button
          type="button"
          onClick={() => camara.current?.click()}
          className="relative flex h-60 flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-primario bg-acento-suave text-texto-secundario"
        >
          {m.imagen ? (
            <FotoMascota nombre={nombre} imagen={m.imagen} className="absolute inset-0 size-full rounded-none" />
          ) : (
            <>
              <Icono nombre="photo_camera" className="icono-xl text-primario" />
              <span className="texto-etiqueta">Vista de cámara · encuádrala bien</span>
            </>
          )}
        </button>
        <p className="texto-cuerpo text-texto-secundario">Una foto clara ayuda a reconocer a {nombre} en consultas y emergencias.</p>
        <div className="flex gap-2.5">
          <button type="button" onClick={() => camara.current?.click()} className={cn("inline-flex items-center justify-center", botonVariants({ variante: "suave" }))}>
            Cámara
            <Icono nombre="photo_camera" className="icono-m" />
          </button>
          <button type="button" onClick={() => galeria.current?.click()} className={cn("inline-flex items-center justify-center", botonVariants({ variante: "suave" }))}>
            Galería
            <Icono nombre="photo_library" className="icono-m" />
          </button>
        </div>
        <input ref={camara} type="file" accept="image/*" capture="environment" hidden onChange={(e) => foto(e.target.files?.[0])} />
        <input ref={galeria} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => foto(e.target.files?.[0])} />
        <button
          type="button"
          onClick={() => {
            setM((x) => ({ ...x, imagen: "" }))
            setPaso(3)
          }}
          className="self-center p-2 texto-etiqueta-fuerte text-primario"
        >
          Omitir por ahora
        </button>
        <BarraAccion>
          <Boton disabled={!m.imagen} onClick={() => setPaso(3)}>
            Siguiente
            <Icono nombre="arrow_forward" className="icono-m" />
          </Boton>
        </BarraAccion>
        {dialogo}
      </main>
    )
  }

  if (paso === 3) {
    return (
      <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
        {encabezado}
        <Pasos paso={3} total={3} nombre="Salud inicial" />
        <Campo etiqueta="Peso actual (kg)" icono="monitor_weight" inputMode="decimal" placeholder="0,0" valor={salud.peso} onCambio={(v) => setSalud((x) => ({ ...x, peso: v }))} />
        <span className="texto-micro text-texto-secundario">Alergias conocidas</span>
        <div className="flex flex-wrap gap-2">
          {salud.alergias.map((a) => (
            <button
              key={a}
              type="button"
              aria-label={`Quitar ${a}`}
              onClick={() => setSalud((x) => ({ ...x, alergias: x.alergias.filter((y) => y !== a) }))}
              className="flex h-10 items-center rounded-completo bg-primario px-4 texto-etiqueta-fuerte text-superficie"
            >
              {a}
            </button>
          ))}
          {agregando ? (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                agregarAlergia()
              }}
              className="flex h-10 items-center gap-1 rounded-completo border border-primario bg-superficie pr-1 pl-4"
            >
              <input
                autoFocus
                value={salud.nueva}
                onChange={(e) => setSalud((x) => ({ ...x, nueva: e.target.value }))}
                onBlur={agregarAlergia}
                placeholder="Pollo"
                className="w-28 bg-transparent texto-etiqueta text-texto outline-none"
              />
              <button type="submit" aria-label="Agregar alergia" className="grid size-8 place-items-center rounded-completo bg-primario text-superficie">
                <Icono nombre="check" className="icono-s" />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAgregando(true)}
              className="flex h-10 items-center gap-1.5 rounded-completo border border-borde-fuerte bg-superficie px-4 texto-etiqueta-fuerte text-texto"
            >
              <Icono nombre="add" className="icono-s" />
              Agregar
            </button>
          )}
        </div>
        <Campo etiqueta="Condiciones preexistentes" icono="healing" placeholder="Ninguna" valor={salud.condiciones} onCambio={(v) => setSalud((x) => ({ ...x, condiciones: v }))} />
        <Campo etiqueta="Medicación vigente" icono="medication" placeholder="Ninguna" valor={salud.medicacion} onCambio={(v) => setSalud((x) => ({ ...x, medicacion: v }))} />
        <BarraAccion>
          <Boton onClick={guardar}>
            Guardar perfil
            <Icono nombre="check" className="icono-m" />
          </Boton>
        </BarraAccion>
        {dialogo}
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      {encabezado}
      <Pasos paso={1} total={3} nombre="Datos básicos" />
      <Selector
        etiqueta="Especie"
        valor={m.especie}
        onCambio={(v) => setM((x) => ({ ...x, especie: v as "perro" | "gato", raza: "" }))}
        opciones={[
          { valor: "perro", etiqueta: "Perro" },
          { valor: "gato", etiqueta: "Gato" },
        ]}
      />
      <Campo etiqueta="Nombre" requerido icono="pets" placeholder="¿Cómo se llama?" valor={m.nombre} onCambio={set("nombre")} />
      <Campo etiqueta="Raza" icono="search" placeholder="Busca la raza" sugerencias={RAZAS[m.especie]} valor={m.raza} onCambio={set("raza")} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <span className="texto-etiqueta-fuerte text-texto">Sexo *</span>
          <Selector
            etiqueta="Sexo"
            valor={m.sexo}
            onCambio={set("sexo")}
            opciones={[
              { valor: "hembra", etiqueta: "Hembra" },
              { valor: "macho", etiqueta: "Macho" },
            ]}
          />
        </div>
        <Campo etiqueta="Nacimiento" type="date" max={HOY} valor={m.nacimiento} onCambio={set("nacimiento")} />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-md bg-superficie p-4">
        <span className="texto-cuerpo-fuerte text-texto">{m.sexo === "macho" ? "Esterilizado" : "Esterilizada"}</span>
        <Interruptor etiqueta="Esterilizada" activo={m.esterilizada} onCambio={(a) => setM((x) => ({ ...x, esterilizada: a }))} />
      </div>
      <Campo
        etiqueta="Microchip (opcional)"
        icono="memory"
        inputMode="numeric"
        placeholder="15 dígitos"
        valor={m.microchip.replace(/(\d{3})(?=\d)/g, "$1 ")}
        onCambio={(v) => set("microchip")(v.replace(/\D/g, "").slice(0, 15))}
      />
      {m.microchip && m.microchip.length !== 15 && <span className="-mt-2 texto-etiqueta text-error">El microchip tiene 15 dígitos.</span>}
      <BarraAccion>
        <Boton disabled={!m.nombre.trim() || !m.sexo || (!!m.microchip && m.microchip.length !== 15)} onClick={() => setPaso(2)}>
          Siguiente
          <Icono nombre="arrow_forward" className="icono-m" />
        </Boton>
      </BarraAccion>
      {dialogo}
    </main>
  )
}
