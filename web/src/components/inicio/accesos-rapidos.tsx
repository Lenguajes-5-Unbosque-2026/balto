"use client"

import Link from "next/link"
import { useState } from "react"

import { Boton } from "@/components/boton"
import { Hoja } from "@/components/hoja"
import { Icono } from "@/components/icono"
import { OpcionCasilla } from "@/components/opcion-casilla"
import { guardarEnMapa, useMapaLocal } from "@/lib/almacen-local"

/** Accesos por defecto de la spec de Inicio. */
const ACCESOS = [
  { nombre: "Salud", icono: "favorite", href: "/salud" },
  { nombre: "Medicamentos", icono: "medication", href: "/medicamentos" },
  { nombre: "Alimentación", icono: "restaurant", href: "/alimentacion" },
  { nombre: "Hábitos", icono: "pets", href: "/habitos" },
  { nombre: "Veterinarias", icono: "local_hospital", href: "/veterinarias" },
  { nombre: "Calendario", icono: "calendar_month", href: "/calendario" },
  { nombre: "Tienda", icono: "storefront", href: "/tienda" },
  { nombre: "Compartir", icono: "ios_share", href: "/compartir" },
]

const POR_DEFECTO = ACCESOS.slice(0, 6).map((a) => a.nombre)
const CLAVE = "balto:accesos"

/** "Accesos rápidos" con "Personalizar" y los mosaicos en fila deslizable (componente Acceso rápido). */
export function AccesosRapidos() {
  const elegidos = useMapaLocal<{ nombres: string[] }>(CLAVE).inicio?.nombres ?? POR_DEFECTO
  const [personalizando, setPersonalizando] = useState(false)

  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h2 className="texto-titulo-seccion text-texto">Accesos rápidos</h2>
        <button type="button" onClick={() => setPersonalizando(true)} className="texto-etiqueta-fuerte text-primario">
          Personalizar
        </button>
      </div>
      <ul className="sin-barra-desplazamiento -mx-pantalla flex gap-2.5 overflow-x-auto px-pantalla">
        {ACCESOS.filter((a) => elegidos.includes(a.nombre)).map((a) => (
          <li key={a.nombre}>
            <Link href={a.href} className="flex h-24 w-26.75 flex-col items-center justify-center gap-2 rounded-md bg-superficie px-1">
              <span className="grid size-10 place-items-center rounded-completo bg-acento-suave text-primario">
                <Icono nombre={a.icono} className="icono-m" />
              </span>
              <span className="w-full truncate text-center texto-etiqueta text-texto">{a.nombre}</span>
            </Link>
          </li>
        ))}
      </ul>
      <Hoja abierta={personalizando} onCerrar={() => setPersonalizando(false)} titulo="Personalizar accesos">
        <Personalizar inicial={elegidos} onListo={() => setPersonalizando(false)} />
      </Hoja>
    </section>
  )
}

function Personalizar({ inicial, onListo }: { inicial: string[]; onListo: () => void }) {
  const [nombres, setNombres] = useState(inicial)
  return (
    <div className="flex flex-col gap-2.5">
      {ACCESOS.map((a) => (
        <OpcionCasilla
          key={a.nombre}
          icono={a.icono}
          titulo={a.nombre}
          marcada={nombres.includes(a.nombre)}
          onCambio={() => setNombres((x) => (x.includes(a.nombre) ? x.filter((y) => y !== a.nombre) : [...x, a.nombre]))}
        />
      ))}
      <Boton
        className="mt-2"
        disabled={nombres.length === 0}
        onClick={() => {
          guardarEnMapa<{ nombres: string[] }>(CLAVE, "inicio", { nombres })
          onListo()
        }}
      >
        Guardar
      </Boton>
    </div>
  )
}
