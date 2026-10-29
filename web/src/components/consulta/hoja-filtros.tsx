"use client"

import { useState } from "react"

import { Boton } from "@/components/boton"
import { Campo } from "@/components/campo"
import { Chip } from "@/components/chip"
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer"
import { CATEGORIAS, type Categoria } from "@/lib/eventos"
import type { Filtros } from "@/lib/filtros-linea"

type HojaFiltrosProps = {
  abierta: boolean
  onCerrar: () => void
  filtros: Filtros
  onAplicar: (cambios: Pick<Filtros, "categorias" | "desde" | "hasta">) => void
}

/** D3 · Filtros de la línea de tiempo: tipos de evento y rango de fechas. */
export function HojaFiltros({ abierta, onCerrar, filtros, onAplicar }: HojaFiltrosProps) {
  return (
    <Drawer open={abierta} onOpenChange={(o) => !o && onCerrar()}>
      <DrawerContent className="mx-auto max-w-app rounded-t-xl border-0 bg-superficie px-6 pt-3 pb-9">
        <span aria-hidden className="mx-auto mb-4 h-1.5 w-11 rounded-completo bg-acento" />
        {/* Se monta al abrir para empezar con los filtros que ya están aplicados. */}
        {abierta && <Contenido filtros={filtros} onAplicar={onAplicar} />}
      </DrawerContent>
    </Drawer>
  )
}

function Contenido({ filtros, onAplicar }: Pick<HojaFiltrosProps, "filtros" | "onAplicar">) {
  const [categorias, setCategorias] = useState<Categoria[]>(filtros.categorias)
  const [desde, setDesde] = useState(filtros.desde)
  const [hasta, setHasta] = useState(filtros.hasta)

  function alternar(c: Categoria) {
    setCategorias((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))
  }

  function aplicar() {
    // Si las fechas quedaron al revés, se ordenan en vez de mostrar un error.
    const [a, b] = desde && hasta && desde > hasta ? [hasta, desde] : [desde, hasta]
    onAplicar({ categorias, desde: a, hasta: b })
  }

  return (
    <div className="flex flex-col gap-4">
      <DrawerTitle className="texto-titulo-tarjeta text-texto">Filtrar eventos</DrawerTitle>
      <span className="texto-micro text-texto-secundario">Tipo de evento</span>
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS.map((c) => (
          <Chip key={c.slug} texto={c.nombre} icono={c.icono} activo={categorias.includes(c.slug)} onClick={() => alternar(c.slug)} />
        ))}
      </div>
      <span className="texto-micro text-texto-secundario">Rango de fechas</span>
      <div className="grid grid-cols-2 gap-3">
        <Campo etiqueta="Desde" type="date" valor={desde} onCambio={setDesde} />
        <Campo etiqueta="Hasta" type="date" valor={hasta} onCambio={setHasta} />
      </div>
      <div className="mt-2 flex gap-2.5">
        <Boton variante="secundario" onClick={() => onAplicar({ categorias: [], desde: "", hasta: "" })}>
          Limpiar
        </Boton>
        <Boton onClick={aplicar}>Aplicar</Boton>
      </div>
    </div>
  )
}
