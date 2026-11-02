"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useRef, useState, useSyncExternalStore } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Dialogo } from "@/components/dialogo"
import { DialogoSalir } from "@/components/dialogo-salir"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FotoMascota } from "@/components/foto-mascota"
import { Icono } from "@/components/icono"
import { Interruptor } from "@/components/interruptor"
import { Selector } from "@/components/selector"
import type { Mascota } from "@/lib/datos"
import { aplicarCambios, completarNueva, guardarCambiosMascota, useCambiosMascotas, useMascotasNuevas } from "@/lib/mascota-activa"
import { microchipLegible } from "@/lib/perfil"

const sinSuscripcion = () => () => {}

/** Reduce la foto a 480 px de lado para guardarla en el navegador sin ocupar demasiado. */
export async function reducirFoto(archivo: File) {
  const imagen = await createImageBitmap(archivo)
  const escala = Math.min(1, 480 / Math.max(imagen.width, imagen.height))
  const lienzo = document.createElement("canvas")
  lienzo.width = Math.round(imagen.width * escala)
  lienzo.height = Math.round(imagen.height * escala)
  lienzo.getContext("2d")!.drawImage(imagen, 0, 0, lienzo.width, lienzo.height)
  return lienzo.toDataURL("image/jpeg", 0.82)
}

/** M18 · Editar mascota, con M13 · Archivar mascota (/ajustes/mascotas/editar?id=m01). */
export function EditarMascota({ mascotas }: { mascotas: Mascota[] }) {
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false)
  const id = useSearchParams().get("id")
  const cambios = useCambiosMascotas()
  const nuevas = useMascotasNuevas()
  const base = mascotas.find((m) => m.id === id) ?? (id && nuevas[id] ? (completarNueva(nuevas[id]) as unknown as Mascota) : undefined)

  if (!listo) return null
  if (!base) {
    return (
      <main className="flex flex-1 flex-col justify-center gap-6 px-pantalla">
        <Estado icono="search_off" titulo="No encontramos la mascota" />
        <BotonEnlace href="/ajustes/mascotas" variante="secundario">
          Ir a mis mascotas
        </BotonEnlace>
      </main>
    )
  }
  const activas = [...mascotas.map((m) => m.id), ...Object.keys(nuevas)].filter((x) => !cambios[x]?.archivada).length
  return <Formulario mascota={aplicarCambios(base, cambios[base.id])} unica={activas <= 1} />
}

function Formulario({ mascota, unica }: { mascota: Mascota; unica: boolean }) {
  const router = useRouter()
  const foto = useRef<HTMLInputElement>(null)
  const [inicial] = useState(mascota)
  const [m, setM] = useState(mascota)
  const [archivar, setArchivar] = useState(false)
  const [salir, setSalir] = useState(false)
  const set = (campo: keyof Mascota) => (v: string) => setM((x) => ({ ...x, [campo]: v }))

  const campos = ["nombre", "especie", "raza", "sexo", "fecha_nacimiento", "esterilizada", "microchip", "imagen"] as const
  const tocado = campos.some((k) => m[k] !== inicial[k])
  const esterilizada = m.esterilizada === "true"

  function volver() {
    if (window.history.length > 1) router.back()
    else router.push("/ajustes/mascotas")
  }

  function guardar() {
    guardarCambiosMascota(m.id, Object.fromEntries(campos.filter((k) => m[k] !== inicial[k]).map((k) => [k, m[k]])))
    toast.success("Cambios guardados")
    volver()
  }

  async function elegirFoto(archivo?: File) {
    if (!archivo) return
    try {
      const url = await reducirFoto(archivo)
      setM((x) => ({ ...x, imagen: url }))
    } catch {
      toast.error("No pudimos leer esa foto", { description: "Prueba con una foto JPG o PNG." })
    }
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado
        titulo="Editar mascota"
        izquierda={<BotonIcono icono="close" etiqueta="Cerrar" onClick={() => (tocado ? setSalir(true) : volver())} />}
      />

      <button type="button" onClick={() => foto.current?.click()} className="flex items-center gap-3.5 rounded-md bg-superficie p-3.5 text-left">
        {m.imagen !== inicial.imagen ? (
          <FotoMascota nombre={m.nombre} imagen={m.imagen} className="size-10 rounded-sm" />
        ) : (
          <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
            <Icono nombre="photo_camera" className="icono-m" />
          </span>
        )}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate texto-cuerpo-fuerte text-texto">Foto de {m.nombre || "tu mascota"}</span>
          <span className="texto-etiqueta text-texto-secundario">{m.imagen !== inicial.imagen ? "Foto nueva sin guardar" : "Cambiar foto"}</span>
        </span>
        <Icono nombre="chevron_right" className="icono-m text-texto-secundario" />
      </button>
      <input ref={foto} type="file" accept="image/jpeg,image/png" hidden onChange={(e) => elegirFoto(e.target.files?.[0])} />

      <Selector
        etiqueta="Especie"
        valor={m.especie}
        onCambio={set("especie")}
        opciones={[
          { valor: "perro", etiqueta: "Perro" },
          { valor: "gato", etiqueta: "Gato" },
        ]}
      />
      <Campo etiqueta="Nombre" icono="pets" valor={m.nombre} onCambio={set("nombre")} />
      <Campo etiqueta="Raza" icono="search" placeholder="Criollo" valor={m.raza} onCambio={set("raza")} />
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <span className="texto-etiqueta-fuerte text-texto">Sexo</span>
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
        <Campo etiqueta="Nacimiento" type="date" valor={m.fecha_nacimiento} onCambio={set("fecha_nacimiento")} />
      </div>
      <div className="flex items-center justify-between gap-3 rounded-md bg-superficie p-4">
        <span className="texto-cuerpo-fuerte text-texto">{m.sexo === "macho" ? "Esterilizado" : "Esterilizada"}</span>
        <Interruptor etiqueta="Esterilizada" activo={esterilizada} onCambio={(a) => setM((x) => ({ ...x, esterilizada: String(a) }))} />
      </div>
      <Campo etiqueta="Microchip (opcional)" icono="memory" inputMode="numeric" placeholder="15 dígitos" valor={microchipLegible(m.microchip)} onCambio={(v) => set("microchip")(v.replace(/\D/g, "").slice(0, 15))} />
      <button
        type="button"
        onClick={() => (unica ? toast("No puedes archivar tu única mascota activa") : setArchivar(true))}
        className="self-center p-2 texto-etiqueta-fuerte text-primario"
      >
        Archivar mascota
      </button>

      <BarraAccion>
        <Boton disabled={!tocado || !m.nombre.trim()} onClick={guardar}>
          Guardar cambios
        </Boton>
      </BarraAccion>

      {/* M13 · Archivar mascota */}
      <Dialogo
        abierto={archivar}
        onCerrar={() => setArchivar(false)}
        icono="inventory_2"
        titulo={`¿Archivar a ${inicial.nombre}?`}
        mensaje="Su historial se guarda completo, pero deja de aparecer en Inicio y no genera alertas."
      >
        <Boton
          onClick={() => {
            guardarCambiosMascota(m.id, { archivada: true })
            toast.success(`${inicial.nombre} quedó en Archivadas`)
            router.replace("/ajustes/mascotas")
          }}
        >
          Archivar a {inicial.nombre}
        </Boton>
        <Boton variante="secundario" onClick={() => setArchivar(false)}>
          Cancelar
        </Boton>
      </Dialogo>

      <DialogoSalir abierto={salir} mensaje="Perderás los cambios de esta mascota." onSeguir={() => setSalir(false)} onSalir={volver} />
    </main>
  )
}
