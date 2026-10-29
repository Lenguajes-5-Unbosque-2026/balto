import type { ReactNode } from "react"

/** Botón a la izquierda, título centrado y botón opcional a la derecha (componente Encabezado). */
export function Encabezado({ titulo, izquierda, derecha }: { titulo: string; izquierda?: ReactNode; derecha?: ReactNode }) {
  return (
    <header className="grid h-11 shrink-0 grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2">
      <span className="flex">{izquierda}</span>
      <h1 className="truncate text-center texto-titulo-seccion text-texto">{titulo}</h1>
      <span className="flex justify-end">{derecha}</span>
    </header>
  )
}
