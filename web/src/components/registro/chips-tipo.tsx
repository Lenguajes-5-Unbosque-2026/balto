"use client"

import { Icono } from "@/components/icono"
import { TIPOS_EVENTO, type TipoEvento } from "@/lib/eventos"
import { cn } from "@/lib/utils"

type ChipsTipoProps = {
  actual: TipoEvento
  onCambio: (tipo: TipoEvento) => void
}

/** Chips para cambiar de tipo sin volver a E1; el tipo actual va primero (componente Chip). */
export function ChipsTipo({ actual, onCambio }: ChipsTipoProps) {
  const tipos = TIPOS_EVENTO.filter((t) => t.slug !== "comportamiento")
  const ordenados = [...tipos.filter((t) => t.slug === actual), ...tipos.filter((t) => t.slug !== actual)]
  return (
    <nav aria-label="Tipo de evento" className="sin-barra-desplazamiento -mx-pantalla overflow-x-auto px-pantalla">
      <ul className="flex w-max gap-2">
        {ordenados.map((t) => {
          const activo = t.slug === actual
          return (
            <li key={t.slug}>
              <button
                type="button"
                aria-pressed={activo}
                onClick={() => onCambio(t.slug)}
                className={cn(
                  "flex h-9.5 items-center gap-1.5 rounded-completo border px-4 texto-etiqueta-fuerte transition-colors",
                  activo
                    ? "border-primario-relleno bg-primario-relleno text-superficie"
                    : "border-borde-fuerte bg-superficie text-texto",
                )}
              >
                <Icono nombre={t.icono} className="icono-s" />
                {t.nombre}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
