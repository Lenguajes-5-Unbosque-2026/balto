import { Icono } from "@/components/icono"
import { cn } from "@/lib/utils"

type RasgoProps = {
  icono: string
  texto: string
  /** Rojo cuando el dato es una alerta (por ejemplo, vacunas vencidas). */
  alerta?: boolean
  /** Verde cuando el dato es bueno (por ejemplo, examen "Normal" en F7). */
  exito?: boolean
  className?: string
}

/** Rasgo verde sobre una tarjeta oscura (G2, H1). */
export function RasgoOscuro({ icono, texto }: { icono: string; texto: string }) {
  return (
    <span className="flex size-19 shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-primario px-0.5 text-center text-superficie">
      <Icono nombre={icono} className="icono-m" />
      <span className="line-clamp-2 w-full texto-micro normal-case">{texto}</span>
    </span>
  )
}

/** Cuadro de 76 px con ícono y dato corto: "Al día", "28 kg", "1 soporte" (componente Rasgo). */
export function Rasgo({ icono, texto, alerta, exito, className }: RasgoProps) {
  return (
    <span
      className={cn(
        "flex size-19 shrink-0 flex-col items-center justify-center gap-1 rounded-md px-0.5 text-center",
        alerta ? "bg-error-suave text-error" : exito ? "bg-exito-suave text-texto" : "bg-acento-suave text-texto",
        className,
      )}
    >
      <Icono nombre={icono} className={cn("icono-m", alerta ? "" : exito ? "text-exito" : "text-primario")} />
      {/* Hasta dos líneas: "Registrar peso" no cabe en una. */}
      <span className="line-clamp-2 w-full texto-micro normal-case">{texto}</span>
    </span>
  )
}
