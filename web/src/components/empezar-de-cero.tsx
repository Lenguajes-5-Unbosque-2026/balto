"use client"

import { Fragment, useEffect, useState } from "react"

/**
 * Con cacheComponents, Next deja ocultas (pero vivas) las pantallas que ya se visitaron, y al volver
 * aparecen como se dejaron. En un flujo eso no sirve: quien termina de compartir y vuelve a entrar
 * vería otra vez "Paso 3 de 3". Al salir de la pantalla (los efectos se limpian al ocultarse),
 * esta vuelve a montar lo que envuelve para que la próxima vez empiece de cero.
 */
export function EmpezarDeCero({ children }: { children: React.ReactNode }) {
  const [vez, setVez] = useState(0)
  useEffect(() => () => setVez((v) => v + 1), [])
  return <Fragment key={vez}>{children}</Fragment>
}
