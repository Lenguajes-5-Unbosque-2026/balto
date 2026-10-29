"use client"

import { Icono } from "@/components/icono"
import { avisarPronto } from "@/lib/pronto"

/** Accesos por defecto de la spec de Inicio; sus flujos (F, G, H, I, K) vienen después del MVP. */
const ACCESOS = [
  { nombre: "Salud", icono: "favorite" },
  { nombre: "Medicamentos", icono: "medication" },
  { nombre: "Alimentación", icono: "restaurant" },
  { nombre: "Hábitos", icono: "pets" },
  { nombre: "Veterinarias", icono: "local_hospital" },
  { nombre: "Calendario", icono: "calendar_month" },
]

/** "Accesos rápidos" con "Personalizar" y los mosaicos en fila deslizable (componente Acceso rápido). */
export function AccesosRapidos() {
  return (
    <section className="flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <h2 className="texto-titulo-seccion text-texto">Accesos rápidos</h2>
        <button type="button" onClick={() => avisarPronto("Personalizar accesos")} className="texto-etiqueta-fuerte text-primario">
          Personalizar
        </button>
      </div>
      <ul className="sin-barra-desplazamiento -mx-6 flex gap-2.5 overflow-x-auto px-6">
        {ACCESOS.map((a) => (
          <li key={a.nombre}>
            <button
              type="button"
              onClick={() => avisarPronto(a.nombre)}
              className="flex h-24 w-26.75 flex-col items-center justify-center gap-2 rounded-md bg-superficie px-1"
            >
              <span className="grid size-10 place-items-center rounded-completo bg-acento-suave text-primario">
                <Icono nombre={a.icono} className="icono-m" />
              </span>
              <span className="w-full truncate text-center texto-etiqueta text-texto">{a.nombre}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
