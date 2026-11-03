"use client"

import { useRegistrarNavegacion } from "@/lib/navegacion"

/** Lleva la cuenta de las pantallas visitadas para que "volver" siempre tenga a dónde ir. */
export function RegistroNavegacion() {
  useRegistrarNavegacion()
  return null
}
