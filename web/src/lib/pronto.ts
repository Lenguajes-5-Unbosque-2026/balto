"use client"

import { toast } from "sonner"

/**
 * Destinos que están fuera del MVP (F, G, H, I, J, K, L, M, N y B): el botón se
 * ve como en Figma y avisa que la sección viene después, en vez de no hacer nada.
 */
export function avisarPronto(seccion: string) {
  toast(`${seccion} llega pronto`, { description: "Estamos construyendo esta sección." })
}
