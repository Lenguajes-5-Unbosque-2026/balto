"use client"

import { useState } from "react"

import { BarraAccion } from "@/components/barra-accion"
import { Boton, BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Busqueda } from "@/components/busqueda"
import { Encabezado } from "@/components/encabezado"
import { FilaOpcion } from "@/components/fila-opcion"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { Nota } from "@/components/nota"
import { normalizar } from "@/lib/eventos"
import { useVolver } from "@/lib/usar-salud"

const PREGUNTAS = [
  {
    p: "¿Cómo subo el carnet de vacunas?",
    r: "Toca + en la barra de abajo, elige Vacuna y en Soporte toma la foto del carnet o sube el PDF. Revisa la foto antes de guardarla.",
  },
  {
    p: "¿Cómo comparto el perfil con la veterinaria?",
    r: "Desde Inicio o la vista rápida, toca el ícono de compartir. Elige qué incluir y envía un PDF o un enlace que vence cuando digas.",
  },
  {
    p: "¿Quien recibe el enlace necesita la app?",
    r: "No. Lo abre en cualquier navegador, sin cuenta, y ve solo lo que seleccionaste.",
  },
  {
    p: "¿Cómo me avisan del próximo refuerzo?",
    r: "Al registrar una vacuna con fecha de próximo refuerzo, enciende «Recordarme el refuerzo». La alerta aparece en Alertas y te llega el aviso.",
  },
  {
    p: "¿Puedo tener varias mascotas?",
    r: "Sí. Cámbialas desde la fila de mascotas de Inicio; cada una tiene su propio perfil e historial.",
  },
  {
    p: "¿Qué pasa si archivo una mascota?",
    r: "Su historial se guarda completo, pero deja de aparecer en Inicio y no genera alertas. Puedes restaurarla desde Mis mascotas.",
  },
]

/** M8 · Ayuda: buscador de preguntas frecuentes, escríbenos, términos y reportar un problema. */
export function Ayuda() {
  const volver = useVolver("/ajustes")
  const [busqueda, setBusqueda] = useState("")
  const [hoja, setHoja] = useState<"preguntas" | "terminos" | null>(null)
  const encontradas = PREGUNTAS.filter((x) => normalizar(`${x.p} ${x.r}`).includes(normalizar(busqueda)))

  return (
    <main className="flex flex-1 flex-col gap-3 px-pantalla pt-14">
      <Encabezado titulo="Ayuda" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <Busqueda valor={busqueda} onCambio={setBusqueda} placeholder="¿Con qué necesitas ayuda?" />

      {busqueda ? (
        encontradas.length ? (
          encontradas.map((x) => <Pregunta key={x.p} {...x} />)
        ) : (
          <p className="py-4 text-center texto-cuerpo text-texto-secundario">No encontramos «{busqueda}». Escríbenos y te ayudamos.</p>
        )
      ) : (
        <>
          <FilaOpcion icono="help" titulo="Preguntas frecuentes" detalle="Cómo subir el carnet, compartir el perfil" onClick={() => setHoja("preguntas")} />
          <FilaOpcion icono="chat" titulo="Escríbenos" detalle="Respondemos en 1 día hábil" href="/ajustes/escribenos" />
          <FilaOpcion icono="description" titulo="Términos y política de datos" detalle="Versión 23 sep 2026" onClick={() => setHoja("terminos")} />
          <FilaOpcion icono="bug_report" titulo="Reportar un problema" detalle="Adjunta una captura si puedes" href="/ajustes/escribenos?tema=problema" />
        </>
      )}
      <Nota icono="emergency">Si es una urgencia de salud, llama directo a tu veterinaria.</Nota>

      <BarraAccion>
        <BotonEnlace href="/ajustes/escribenos">Escribirnos</BotonEnlace>
      </BarraAccion>

      <Hoja abierta={hoja === "preguntas"} onCerrar={() => setHoja(null)} titulo="Preguntas frecuentes">
        <div className="flex flex-col gap-3">
          {PREGUNTAS.map((x) => (
            <Pregunta key={x.p} {...x} />
          ))}
        </div>
      </Hoja>
      <Hoja abierta={hoja === "terminos"} onCerrar={() => setHoja(null)} titulo="Términos y política de datos">
        <div className="flex flex-col gap-3 texto-cuerpo text-texto">
          <p>La información que registras de tus mascotas es tuya. Balto la guarda para mostrártela y para compartirla solo cuando tú lo decidas.</p>
          <p>Puedes descargar todos tus datos en cualquier momento desde Ajustes › Exportar mis datos, y eliminar tu cuenta cuando quieras.</p>
          <p className="texto-etiqueta text-texto-secundario">Versión vigente: 23 de septiembre de 2026.</p>
          <Boton onClick={() => setHoja(null)}>Entendido</Boton>
        </div>
      </Hoja>
    </main>
  )
}

function Pregunta({ p, r }: { p: string; r: string }) {
  return (
    <details className="group rounded-md bg-superficie p-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 texto-cuerpo-fuerte text-texto">
        {p}
        <Icono nombre="expand_more" className="icono-m text-texto-secundario transition-transform group-open:rotate-180" />
      </summary>
      <p className="pt-2 texto-cuerpo text-texto-secundario">{r}</p>
    </details>
  )
}
