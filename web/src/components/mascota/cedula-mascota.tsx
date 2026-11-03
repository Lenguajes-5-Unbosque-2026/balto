"use client"

import { BotonIconoEnlace } from "@/components/boton-icono"
import { useSearchParams } from "next/navigation"

import { BarraAccion } from "@/components/barra-accion"
import { BotonEnlace } from "@/components/boton"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { Rasgo } from "@/components/rasgo"
import type { Mascota } from "@/lib/datos"
import { fechaCorta } from "@/lib/fecha"
import { completarNueva, useMascotasNuevas } from "@/lib/mascota-activa"
import { razaCorta } from "@/lib/perfil"

const mayuscula = (t: string) => t.charAt(0).toUpperCase() + t.slice(1)

type Props = { mascotas: (Mascota & { fecha_emision_cedula?: string })[] }

function useMascota({ mascotas }: Props) {
  const id = useSearchParams().get("id")
  const nuevas = useMascotasNuevas()
  return mascotas.find((m) => m.id === id) ?? (id && nuevas[id] ? completarNueva(nuevas[id]) : undefined)
}

/** B6 · Cédula de la mascota (/mascotas/cedula?id=…). */
export function CedulaMascota(props: Props) {
  const m = useMascota(props)
  if (!m) return <NoEncontrada />
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo={`Cédula de ${m.nombre}`} derecha={<BotonIconoEnlace href="/" icono="close" etiqueta="Ir a Inicio" />} />
      <section className="flex flex-col gap-3 rounded-lg border border-borde-fuerte bg-superficie p-4 movil-m:p-5">
        <span className="texto-micro text-primario">Cédula animal · Balto</span>
        <h1 className="texto-titulo-pantalla break-all text-texto">{m.cedula}</h1>
        <span className="texto-etiqueta text-texto-secundario">
          Emitida el {fechaCorta(m.fecha_emision_cedula ?? "")} · {mayuscula(m.especie)}
          {m.raza && ` · ${razaCorta(m.raza)}`}
        </span>
        <div className="flex gap-2">
          <Rasgo icono="verified" texto="Única" exito />
          <Rasgo icono="qr_code_2" texto="Digital" />
        </div>
      </section>
      <Nota icono="badge">Este número identifica a {m.nombre} dentro de la app. Sirve en consultas y emergencias.</Nota>
      <FilaOpcion icono="qr_code_2" titulo="Ver versión digital" detalle="Para mostrar en el celular" href="/vista-rapida" />
      <BarraAccion>
        <BotonEnlace href={`/mascotas/creada?id=${m.id}`}>Continuar</BotonEnlace>
      </BarraAccion>
    </main>
  )
}

/** B5 · Perfil creado: el siguiente paso es la carga inicial obligatoria (C1). */
export function PerfilCreado(props: Props) {
  const m = useMascota(props)
  if (!m) return <NoEncontrada />
  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14">
      <Encabezado titulo="Perfil creado" izquierda={<BotonIconoEnlace href={`/mascotas/cedula?id=${m.id}`} icono="arrow_back" etiqueta="Volver a la cédula" />} />
      <Estado tono="exito" icono="check_circle" titulo={`¡Perfil de ${m.nombre} creado!`} mensaje="Su información queda respaldada. Ahora sube lo que ya tienes: carnet, exámenes o fórmulas." />
      <Nota>Este paso es obligatorio. Si no tienes documentos, registra al menos el peso y las alergias.</Nota>
      <BarraAccion>
        <BotonEnlace href={`/carga-inicial?mascota=${m.id}`}>
          Continuar a la carga inicial
          <Icono nombre="arrow_forward" className="icono-m" />
        </BotonEnlace>
      </BarraAccion>
    </main>
  )
}

function NoEncontrada() {
  return (
    <main className="flex flex-1 flex-col justify-center gap-6 px-pantalla">
      <Estado icono="search_off" titulo="No encontramos la mascota" />
      <BotonEnlace href="/">Ir a Inicio</BotonEnlace>
    </main>
  )
}
