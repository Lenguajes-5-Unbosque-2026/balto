import { obtenerHorarios, obtenerMascotas, obtenerTomas, obtenerTratamientos } from "@/lib/datos"

/** Lo que leen todas las pantallas de G. */
export function datosMedicamentos() {
  return { tratamientos: obtenerTratamientos(), horarios: obtenerHorarios(), tomas: obtenerTomas() }
}

export function mascotasMedicamentos() {
  return obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre }))
}
