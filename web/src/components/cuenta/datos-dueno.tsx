"use client"

import { useState, useSyncExternalStore } from "react"
import { toast } from "sonner"

import { BarraAccion } from "@/components/barra-accion"
import { Boton } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Encabezado } from "@/components/encabezado"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import type { Dueno } from "@/lib/datos"
import { guardarDueno, useDueno } from "@/lib/usar-cuenta"
import { useVolver } from "@/lib/usar-salud"

const sinSuscripcion = () => () => {}

/** M2 · Editar datos del dueño. */
export function DatosDueno({ dueno }: { dueno: Dueno }) {
  // Toma los valores una sola vez: espera a leer los cambios guardados en este navegador.
  const listo = useSyncExternalStore(sinSuscripcion, () => true, () => false)
  return listo ? <Formulario base={dueno} /> : null
}

function Formulario({ base }: { base: Dueno }) {
  const volver = useVolver("/ajustes")
  const actual = useDueno(base)
  const [inicial] = useState(actual)
  const [d, setD] = useState(actual)
  const set = (campo: keyof Dueno) => (v: string) => setD((x) => ({ ...x, [campo]: v }))

  const tocado = (["nombre", "correo", "ciudad", "telefono"] as const).some((k) => d[k] !== inicial[k])
  const telefonoValido = d.telefono.replace(/\D/g, "").length >= 10
  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo)

  function guardar() {
    guardarDueno(base.id, { nombre: d.nombre.trim(), correo: d.correo.trim(), ciudad: d.ciudad.trim(), telefono: d.telefono.trim() })
    toast.success("Cambios guardados", d.correo !== inicial.correo ? { description: `Verifica el nuevo correo: te enviamos un código a ${d.correo}.` } : undefined)
    volver()
  }

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Mis datos" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <Campo etiqueta="Nombre completo" icono="person" autoComplete="name" valor={d.nombre} onCambio={set("nombre")} />
      <Campo etiqueta="Correo" type="email" icono="mail" autoComplete="email" valor={d.correo} onCambio={set("correo")} />
      {!correoValido && <span className="-mt-2 texto-etiqueta text-error">Revisa el correo: parece incompleto.</span>}
      <Campo etiqueta="Ciudad" icono="location_on" valor={d.ciudad} onCambio={set("ciudad")} />
      <Campo etiqueta="Teléfono" type="tel" icono="call" autoComplete="tel" valor={d.telefono} onCambio={set("telefono")} />
      {!telefonoValido && <span className="-mt-2 texto-etiqueta text-error">El teléfono debe tener al menos 10 dígitos.</span>}
      <Nota>El teléfono aparece en la vista rápida y en los reportes PDF.</Nota>
      <BarraAccion>
        <Boton disabled={!tocado || !telefonoValido || !correoValido || !d.nombre.trim()} onClick={guardar}>
          Guardar cambios
          <Icono nombre="check" className="icono-m" />
        </Boton>
      </BarraAccion>
    </main>
  )
}
