"use client"

import { Boton } from "@/components/boton"
import { Dialogo } from "@/components/dialogo"

type DialogoSalirProps = {
  abierto: boolean
  onSeguir: () => void
  onSalir: () => void
  /** Lo que se pierde: "Perderás los datos que escribiste de este evento." */
  mensaje: string
}

/** Diálogo "¿Salir sin guardar?" de B8, reutilizado en E y D6. */
export function DialogoSalir({ abierto, onSeguir, onSalir, mensaje }: DialogoSalirProps) {
  return (
    <Dialogo abierto={abierto} onCerrar={onSeguir} icono="warning" titulo="¿Salir sin guardar?" mensaje={mensaje}>
      <Boton onClick={onSeguir}>Seguir editando</Boton>
      <Boton variante="destructivo-contorno" onClick={onSalir}>
        Salir y descartar
      </Boton>
    </Dialogo>
  )
}
