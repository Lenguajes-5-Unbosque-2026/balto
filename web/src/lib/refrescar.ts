"use server"

import { updateTag } from "next/cache"

import { ETIQUETA_DATOS } from "@/lib/esquema"

/** Después de guardar en Supabase: la próxima pantalla ya se arma con los datos nuevos. */
export async function refrescarDatos() {
  updateTag(ETIQUETA_DATOS)
}
