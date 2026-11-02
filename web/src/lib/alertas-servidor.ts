import { obtenerMascotas, obtenerPlanes } from "@/lib/datos"

/** Nombre y foto de las mascotas activas, lo único que necesitan las pantallas de J. */
export function mascotasAlerta() {
  return obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre, imagen: m.imagen }))
}

/** Marca del alimento de cada plan, para "Se acaba el alimento". */
export function marcasDePlanes(): Record<string, string> {
  return Object.fromEntries(obtenerPlanes().map((p) => [p.id, p.marca]))
}
