"use client"

import Link from "next/link"
import { useState } from "react"
import { toast } from "sonner"

import { Boton } from "@/components/boton"
import { BotonIconoEnlace } from "@/components/boton-icono"
import { Campo } from "@/components/campo"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { guardarCambiosMascota } from "@/lib/mascota-activa"
import { guardarMascotaActiva } from "@/lib/registro-local"

/** O1 · Sin mascotas registradas: Inicio cuando no hay mascotas activas. */
export function SinMascotas({ dueno, mascotas }: { dueno: string; mascotas: { id: string; nombre: string; cedula: string }[] }) {
  const [buscando, setBuscando] = useState(false)
  const [cedula, setCedula] = useState("")

  function buscar() {
    const m = mascotas.find((x) => x.cedula.toUpperCase() === cedula.trim().toUpperCase())
    if (!m) {
      toast("No encontramos esa cédula", { description: "Revisa el número: BAL-0001-NOMBRE." })
      return
    }
    // La cédula de una mascota archivada la devuelve a Inicio.
    guardarCambiosMascota(m.id, { archivada: false })
    guardarMascotaActiva(m.id)
    toast.success(`${m.nombre} volvió a Inicio`)
    setBuscando(false)
  }

  return (
    <div className="flex flex-col gap-4 px-pantalla pt-12">
      <header className="flex h-12.5 items-center gap-3">
        <Link href="/ajustes" aria-label="Ajustes" className="grid size-12 shrink-0 place-items-center rounded-md bg-acento-suave text-primario">
          <Icono nombre="person" className="icono-m" />
        </Link>
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="truncate texto-titulo-tarjeta text-texto">Hola, {dueno.split(" ")[0]}</span>
          <span className="texto-etiqueta text-texto-secundario">Todo en un solo lugar</span>
        </span>
        <BotonIconoEnlace href="/notificaciones" icono="notifications" etiqueta="Notificaciones" />
      </header>
      <div className="pt-6">
        <Estado icono="pets" titulo="Aún no tienes mascotas" mensaje="Registra a tu primera mascota y empieza a guardar su historial." />
      </div>
      <FilaOpcion icono="add_circle" titulo="Registrar una mascota" detalle="Toma 2 minutos" href="/mascotas/nueva" />
      <FilaOpcion icono="qr_code_scanner" titulo="Ya tengo una cédula Balto" detalle="Buscar por número" onClick={() => setBuscando(true)} />
      <Hoja abierta={buscando} onCerrar={() => setBuscando(false)} titulo="Buscar por cédula">
        <div className="flex flex-col gap-3">
          <Campo etiqueta="Número de la cédula" icono="badge" placeholder="BAL-0001-LUNA" valor={cedula} onCambio={setCedula} />
          <Boton disabled={!cedula.trim()} onClick={buscar}>
            Buscar
          </Boton>
        </div>
      </Hoja>
    </div>
  )
}
