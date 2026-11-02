import { obtenerComidas, obtenerPlanes } from "@/lib/datos"

/** Lo que leen las pantallas de H. */
export function datosAlimentacion() {
  return { planes: obtenerPlanes(), comidas: obtenerComidas() }
}
