import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

type OpcionCasillaProps = {
  icono: string
  titulo: string
  marcada: boolean
  onCambio: () => void
  deshabilitada?: boolean
}

/** Opción de varias elecciones con ícono y casilla (L1, I3). */
export function OpcionCasilla({ icono, titulo, marcada, onCambio, deshabilitada }: OpcionCasillaProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={marcada}
      disabled={deshabilitada}
      onClick={onCambio}
      className={cn(
        "flex min-h-16 w-full items-center gap-3.5 rounded-md border bg-superficie px-3.5 py-3 text-left transition-colors disabled:opacity-100",
        marcada ? "border-primario" : "border-borde-fuerte",
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-sm bg-acento-suave text-primario">
        <Icono nombre={icono} className="icono-m" />
      </span>
      <span className="min-w-0 flex-1 texto-cuerpo-fuerte text-texto">{titulo}</span>
      <Icono nombre={marcada ? "check_box" : "check_box_outline_blank"} className={cn("icono-m", marcada ? "text-primario" : "text-texto-secundario")} />
    </button>
  )
}
