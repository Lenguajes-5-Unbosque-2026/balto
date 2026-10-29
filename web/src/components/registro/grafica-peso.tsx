import { Icono } from "@/components/icono"
import type { Medicion } from "@/components/registro/tipos"
import { cn } from "@/lib/utils"

type GraficaPesoProps = {
  mediciones: Medicion[]
  /** Peso que se está escribiendo en E6 (texto, admite coma). */
  nuevo: string
  fecha: string
}

/** Gráfica "Evolución del peso · 6 meses" de E6 y la comparación con la medición anterior. */
export function GraficaPeso({ mediciones, nuevo, fecha }: GraficaPesoProps) {
  const kgNuevo = Number.parseFloat(nuevo.replace(",", "."))
  const anteriores = [...mediciones].sort((a, b) => a.fecha.localeCompare(b.fecha)).filter((m) => m.fecha <= fecha)
  const barras = [...anteriores.map((m) => m.kg), ...(kgNuevo > 0 ? [kgNuevo] : [])].slice(-6)
  const max = Math.max(...barras, 1)
  const min = Math.min(...barras, max)
  const ultima = anteriores.at(-1)
  const diferencia = kgNuevo > 0 && ultima ? kgNuevo - ultima.kg : null

  return (
    <>
      <section className="flex flex-col gap-3.5 rounded-bloque border border-borde bg-superficie p-5">
        <div className="flex items-center justify-between">
          <h2 className="texto-cuerpo-fuerte text-texto">Evolución del peso</h2>
          <span className="texto-micro text-texto-secundario">6 meses</span>
        </div>
        {barras.length ? (
          <div className="flex h-24 items-end gap-3" aria-label={`Pesos: ${barras.join(", ")} kg`}>
            {barras.map((kg, i) => (
              <span
                key={i}
                className={cn(
                  "flex-1 rounded-sm",
                  i === barras.length - 1 && kgNuevo > 0 ? "bg-primario" : "bg-acento",
                )}
                // Altura proporcional al peso: es un dato, no un valor de diseño.
                style={{ height: `${40 + ((kg - min) / Math.max(max - min, 0.1)) * 60}%` }}
              />
            ))}
          </div>
        ) : (
          <p className="texto-etiqueta text-texto-secundario">Esta es la primera medición.</p>
        )}
      </section>
      {diferencia !== null && (
        <div className="flex items-center gap-2.5 rounded-md bg-acento-suave px-4 py-3.5">
          <Icono nombre={diferencia >= 0 ? "trending_up" : "trending_down"} className="icono-s text-primario" />
          <span className="texto-etiqueta text-texto">
            {diferencia >= 0 ? "+" : "−"}
            {Math.abs(diferencia).toFixed(1).replace(".", ",")} kg frente a la medición anterior.
          </span>
        </div>
      )}
    </>
  )
}
