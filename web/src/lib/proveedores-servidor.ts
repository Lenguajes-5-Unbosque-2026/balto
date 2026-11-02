import { obtenerCitas, obtenerMascotas, obtenerProveedores } from "@/lib/datos"

/** Lo que leen las pantallas de K. */
export function datosProveedores() {
  return {
    proveedores: obtenerProveedores(),
    mascotas: obtenerMascotas().map((m) => ({ id: m.id, nombre: m.nombre })),
    citas: obtenerCitas(),
  }
}
