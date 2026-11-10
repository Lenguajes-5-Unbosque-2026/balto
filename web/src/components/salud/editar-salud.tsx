"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useSyncExternalStore } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { AreaTexto, Campo } from "@/components/campo"
import { DialogoSalir } from "@/components/dialogo-salir"
import { Encabezado } from "@/components/encabezado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { puedeVolver } from "@/lib/navegacion"
import type { Condicion } from "@/lib/datos"
import { normalizar } from "@/lib/eventos"
import { hoy } from "@/lib/fecha"
import { useMascotaActiva } from "@/lib/mascota-activa"
import type { PerfilMascota } from "@/lib/perfil"
import { ALERGIAS_SUGERIDAS, guardarSalud, useSalud } from "@/lib/usar-salud"
import { cn } from "@/lib/utils"

type EditarSaludProps = { mascotas: PerfilMascota[]; condiciones: Condicion[]; veterinarias: string[] }

const sinSuscripcion = () => () => {}

/** F6 · Editar alergias y condiciones (/salud/alergias/editar?condicion=c01). */
export function EditarSalud(props: EditarSaludProps) {
  // El formulario toma los valores una sola vez: espera a leer los cambios guardados en este navegador.
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false)
  return listo ? <Formulario {...props} /> : null
}

function Formulario({ mascotas, condiciones: base, veterinarias }: EditarSaludProps) {
  const router = useRouter()
  const [mascota] = useMascotaActiva(mascotas)
  const salud = useSalud(mascota, base)
  const idCondicion = useSearchParams().get("condicion")
  const elegida = salud.condiciones.find((c) => c.id === idCondicion) ?? salud.condiciones[0]

  const [inicial] = useState(() => ({ alergias: salud.alergias, nombre: elegida?.nombre ?? "", por: elegida?.diagnosticada_por ?? "" }))
  const [alergias, setAlergias] = useState(inicial.alergias)
  const [nueva, setNueva] = useState("")
  const [nombre, setNombre] = useState(inicial.nombre)
  const [por, setPor] = useState(inicial.por)
  const [parpadeo, setParpadeo] = useState("")
  const [confirmar, setConfirmar] = useState(false)

  const tocado = alergias.join("|") !== inicial.alergias.join("|") || nombre !== inicial.nombre || por !== inicial.por
  const sugeridas = ALERGIAS_SUGERIDAS.filter((s) => !alergias.some((a) => normalizar(a) === normalizar(s)))

  function agregar(texto: string) {
    const limpio = texto.trim().replace(/^./, (c) => c.toUpperCase())
    if (!limpio) return
    const repetida = alergias.find((a) => normalizar(a) === normalizar(limpio))
    if (repetida) {
      // No se agrega dos veces: el chip existente parpadea (spec de F).
      setParpadeo(repetida)
      setTimeout(() => setParpadeo(""), 900)
    } else {
      setAlergias((x) => [...x, limpio])
    }
    setNueva("")
  }

  function salir() {
    if (puedeVolver()) router.back()
    else router.push("/salud/alergias")
  }

  function guardar() {
    const resto = salud.condiciones.filter((c) => c.id !== elegida?.id)
    const condicion: Condicion | null = nombre.trim()
      ? {
          id: elegida?.id ?? crypto.randomUUID(),
          mascota_id: mascota.id,
          nombre: nombre.trim(),
          fecha_diagnostico: elegida?.fecha_diagnostico ?? hoy(),
          diagnosticada_por: por.trim(),
        }
      : null
    guardarSalud(mascota.id, { alergias, condiciones: condicion ? [condicion, ...resto] : resto })
    toast.success("Cambios guardados")
    salir()
  }

  const cancelar = () => (tocado ? setConfirmar(true) : salir())

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Editar" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={cancelar} />} />

      <form
        className="flex flex-col gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          agregar(nueva)
        }}
      >
        <label htmlFor="nueva-alergia" className="texto-etiqueta-fuerte text-texto">
          Agregar alergia
        </label>
        <div className="flex h-14 items-center gap-3 rounded-md border border-borde bg-superficie px-3 focus-within:border-primario movil-m:px-4">
          <Icono nombre="add" className="icono-m text-texto-secundario" />
          <input
            id="nueva-alergia"
            value={nueva}
            onChange={(e) => setNueva(e.target.value)}
            placeholder="Escribe y confirma"
            enterKeyHint="done"
            className="h-full min-w-0 flex-1 bg-transparent texto-cuerpo text-texto outline-none placeholder:text-texto-secundario"
          />
          {nueva.trim() && (
            <button type="submit" aria-label="Confirmar alergia" className="grid size-9 place-items-center rounded-completo bg-primario text-superficie">
              <Icono nombre="check" className="icono-s" />
            </button>
          )}
        </div>
      </form>

      <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
        {alergias.map((a) => (
          <button
            key={a}
            type="button"
            aria-label={`Quitar ${a}`}
            onClick={() => setAlergias((x) => x.filter((y) => y !== a))}
            className={cn(
              "flex h-9.5 shrink-0 items-center gap-1.5 rounded-completo bg-primario px-4 texto-etiqueta-fuerte whitespace-nowrap text-superficie",
              parpadeo === a && "animate-pulse",
            )}
          >
            <Icono nombre="close" className="icono-s" />
            {a}
          </button>
        ))}
        {sugeridas.slice(0, 3).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => agregar(s)}
            className="flex h-9.5 shrink-0 items-center gap-1.5 rounded-completo border border-borde-fuerte bg-superficie px-4 texto-etiqueta-fuerte whitespace-nowrap text-texto"
          >
            <Icono nombre="add" className="icono-s" />
            Sugerido: {s.toLowerCase()}
          </button>
        ))}
      </div>

      <AreaTexto
        etiqueta="Condiciones"
        placeholder="Dermatitis atópica diagnosticada en septiembre de 2026."
        valor={nombre}
        onCambio={setNombre}
      />
      <Campo
        etiqueta="Diagnosticada por"
        icono="local_hospital"
        placeholder="Veterinaria o veterinario"
        sugerencias={veterinarias}
        valor={por}
        onCambio={setPor}
      />
      <Nota tono="exito" icono="verified">
        Guarda solo lo que te confirmó un veterinario.
      </Nota>

      <BarraAccion>
        <Boton disabled={!tocado} onClick={guardar}>
          Guardar
        </Boton>
        <Boton variante="secundario" onClick={cancelar}>
          Cancelar
        </Boton>
      </BarraAccion>

      <DialogoSalir abierto={confirmar} mensaje="Perderás los cambios." onSeguir={() => setConfirmar(false)} onSalir={salir} />
    </main>
  )
}
