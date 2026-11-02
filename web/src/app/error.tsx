"use client"

import { AlgoSalioMal } from "@/components/estados/estados"

/** O9 · Algo salió mal: cualquier error inesperado de una pantalla. */
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <AlgoSalioMal onReintentar={reset} />
}
