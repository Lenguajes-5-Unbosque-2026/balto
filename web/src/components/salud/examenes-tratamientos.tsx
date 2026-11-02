"use client"

import { useState } from "react"

import { BotonEnlace } from "@/components/boton"
import { BotonIcono } from "@/components/boton-icono"
import { Chip } from "@/components/chip"
import { Encabezado } from "@/components/encabezado"
import { Estado } from "@/components/estado"
import { TarjetaEvento } from "@/components/tarjeta-evento"
import { ordenarEventos, type Evento } from "@/lib/eventos"
import type { PerfilMascota } from "@/lib/perfil"
import { resumenExamen, textoSoportesSalud } from "@/lib/salud"
import { useMascotaYEventos, useVolver } from "@/lib/usar-salud"

const FILTROS = [
  { valor: "todos", nombre: "Todos" },
  { valor: "examen", nombre: "Exámenes", icono: "labs" },
  { valor: "tratamiento", nombre: "Tratamientos", icono: "medication" },
] as const

/** F3 · Exámenes y tratamientos de la mascota activa. */
export function ExamenesTratamientos({ mascotas, eventos: base, tratamientos }: { mascotas: PerfilMascota[]; eventos: Evento[]; tratamientos: Record<string, string> }) {
  const volver = useVolver("/salud")
  const { eventos } = useMascotaYEventos(mascotas, base)
  const [filtro, setFiltro] = useState<(typeof FILTROS)[number]["valor"]>("todos")

  const lista = ordenarEventos(
    eventos.filter((e) => (filtro === "todos" ? e.tipo === "examen" || e.tipo === "tratamiento" : e.tipo === filtro)),
  )

  return (
    <main className="flex flex-1 flex-col gap-4 px-pantalla pt-14 pb-10">
      <Encabezado titulo="Exámenes y tratamientos" izquierda={<BotonIcono icono="arrow_back" etiqueta="Volver" onClick={volver} />} />
      <div className="sin-barra-desplazamiento -mx-pantalla flex gap-2 overflow-x-auto px-pantalla">
        {FILTROS.map((f) => (
          <Chip key={f.valor} texto={f.nombre} icono={"icono" in f ? f.icono : undefined} activo={filtro === f.valor} onClick={() => setFiltro(f.valor)} />
        ))}
      </div>

      {lista.length === 0 ? (
        <div className="flex flex-col gap-5 pt-6">
          <Estado icono="labs" titulo="Nada por aquí todavía" mensaje="Registra un examen o un tratamiento para verlo en esta lista." />
          <div className="flex gap-2.5">
            <BotonEnlace href="/registrar/examen">Examen</BotonEnlace>
            <BotonEnlace href="/registrar/tratamiento" variante="secundario">
              Tratamiento
            </BotonEnlace>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {lista.map((e) => (
            <TarjetaEvento
              key={e.id}
              evento={e}
              variante="borde"
              // Los tratamientos abren G2; los que no están en G, el detalle de D4.
              href={e.tipo === "examen" ? `/salud/examen?id=${e.id}` : tratamientos[e.id] ? `/medicamentos/detalle?id=${tratamientos[e.id]}` : `/evento?id=${e.id}`}
              detalle={e.tipo === "examen" ? resumenExamen(e) : `Tratamiento${e.duracion_dias ? ` · ${e.duracion_dias} días` : ""}`}
              textoSoportes={textoSoportesSalud(e)}
            />
          ))}
        </div>
      )}
    </main>
  )
}
