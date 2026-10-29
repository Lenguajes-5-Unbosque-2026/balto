import type { ReactNode } from "react"

/** Barra inferior fija con uno o dos botones del mismo ancho (componente Barra de acción). */
export function BarraAccion({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Reserva el espacio de la barra para que el contenido no quede debajo. */}
      <div aria-hidden className="h-28 shrink-0" />
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto flex max-w-app gap-2.5 bg-fondo px-6 pt-4 pb-9">
        {children}
      </div>
    </>
  )
}
