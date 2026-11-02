import { cn } from "@/lib/utils"

/** "PASO 1 DE 2 · MEDICAMENTO" con una barra por paso (G3, G4, G7, L1–L4). */
export function Pasos({ paso, total = 2, nombre }: { paso: number; total?: number; nombre: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="texto-micro text-primario">
        Paso {paso} de {total} · {nombre}
      </span>
      <div className="flex gap-1.5">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} className={cn("h-1.5 flex-1 rounded-completo", i < paso ? "bg-primario" : "bg-acento")} />
        ))}
      </div>
    </div>
  )
}
