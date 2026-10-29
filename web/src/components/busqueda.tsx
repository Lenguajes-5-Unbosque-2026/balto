"use client"

import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

type BusquedaProps = {
  valor: string
  onCambio: (valor: string) => void
  placeholder: string
  onFiltros?: () => void
  /** Marca el botón de filtros cuando hay filtros aplicados. */
  filtrosActivos?: boolean
}

/** Campo con lupa y botón de filtros (componente Búsqueda del kit). */
export function Busqueda({ valor, onCambio, placeholder, onFiltros, filtrosActivos }: BusquedaProps) {
  return (
    <div className="flex h-13 gap-2.5">
      <label className="flex min-w-0 flex-1 items-center gap-3 rounded-md border border-primario bg-superficie px-4">
        <Icono nombre="search" className="icono-m text-texto-secundario" />
        <input
          type="search"
          value={valor}
          onChange={(e) => onCambio(e.target.value)}
          placeholder={placeholder}
          enterKeyHint="search"
          className="h-full min-w-0 flex-1 appearance-none bg-transparent texto-cuerpo text-texto outline-none placeholder:text-texto-secundario [&::-webkit-search-cancel-button]:hidden"
        />
        {valor && (
          <button type="button" aria-label="Borrar búsqueda" onClick={() => onCambio("")} className="grid size-6 place-items-center text-texto-secundario">
            <Icono nombre="cancel" className="icono-m" />
          </button>
        )}
      </label>
      {onFiltros && (
        <button
          type="button"
          aria-label={filtrosActivos ? "Filtros (hay filtros aplicados)" : "Filtros"}
          onClick={onFiltros}
          className="relative grid size-13 shrink-0 place-items-center rounded-md bg-primario-relleno text-superficie"
        >
          <Icono nombre="tune" className="icono-l" />
          {filtrosActivos && (
            <span aria-hidden className={cn("absolute top-2.5 right-2.5 size-2.5 rounded-completo border-2 border-primario bg-superficie")} />
          )}
        </button>
      )}
    </div>
  )
}
