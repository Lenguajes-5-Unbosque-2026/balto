"use client"

import { useState } from "react"

import { Boton } from "@/components/boton"
import { Chip } from "@/components/chip"
import { Hoja } from "@/components/hoja"
import { CATEGORIAS_ALERTA, type CategoriaAlerta } from "@/lib/alertas"

export type FiltrosAlertas = { mascota: string; categorias: CategoriaAlerta[] }

export const SIN_FILTROS: FiltrosAlertas = { mascota: "todas", categorias: [] }

type HojaFiltrosAlertasProps = {
  abierta: boolean
  onCerrar: () => void
  mascotas: { id: string; nombre: string }[]
  filtros: FiltrosAlertas
  onAplicar: (f: FiltrosAlertas) => void
}

/** J8 · Filtros de alertas: una mascota (o todas) y los tipos de alerta. */
export function HojaFiltrosAlertas({ abierta, onCerrar, mascotas, filtros, onAplicar }: HojaFiltrosAlertasProps) {
  return (
    <Hoja abierta={abierta} onCerrar={onCerrar} titulo="Filtrar alertas">
      <Contenido mascotas={mascotas} filtros={filtros} onAplicar={onAplicar} />
    </Hoja>
  )
}

function Contenido({ mascotas, filtros, onAplicar }: Omit<HojaFiltrosAlertasProps, "abierta" | "onCerrar">) {
  const [mascota, setMascota] = useState(filtros.mascota)
  const [categorias, setCategorias] = useState(filtros.categorias)

  function alternar(c: CategoriaAlerta) {
    setCategorias((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))
  }

  return (
    <div className="flex flex-col gap-3.5">
      <span className="texto-micro text-texto-secundario">Mascota</span>
      <div className="flex flex-wrap gap-2">
        {[{ id: "todas", nombre: "Todas" }, ...mascotas].map((m) => (
          <Chip key={m.id} texto={m.nombre} activo={mascota === m.id} onClick={() => setMascota(m.id)} />
        ))}
      </div>
      <span className="texto-micro text-texto-secundario">Tipo</span>
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS_ALERTA.map((c) => (
          <Chip key={c.slug} texto={c.nombre} icono={c.icono} activo={categorias.includes(c.slug)} onClick={() => alternar(c.slug)} />
        ))}
      </div>
      <div className="mt-3 flex gap-2.5">
        <Boton variante="secundario" onClick={() => onAplicar(SIN_FILTROS)}>
          Limpiar
        </Boton>
        <Boton onClick={() => onAplicar({ mascota, categorias })}>Aplicar</Boton>
      </div>
    </div>
  )
}
